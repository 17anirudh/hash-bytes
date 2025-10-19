from io import BytesIO
from Crypto.Cipher import AES, DES, DES3, ChaCha20_Poly1305, CAST
from cryptography.hazmat.primitives.ciphers.aead import XChaCha20Poly1305
from Crypto.Random import get_random_bytes
import base64, os

compatible_map: dict[str, list[str] | None] = {
    "AES":       ["ECB", "CBC", "CFB", "OFB", "CTR", "OpenPGP", "EAX", "GCM", "CCM", "SIV", "OCB"],
    "DES":       ["ECB", "CBC", "CFB", "OFB", "CTR", "OpenPGP"],          
    "DES3":      ["ECB", "CBC", "CFB", "OFB", "CTR", "OpenPGP"],        
    "CAST-128":  ["ECB", "CBC", "CFB", "OFB"],                      
    "ChaCha20":  ["ChaCha20_Poly1305"],                            
    "XChaCha20": ["ChaCha20_Poly1305"],                            
}

def encrypt_bytes(data: bytes, algorithm: str, mode: str):
    """
    Params: Data(in bytes), Encryption Algorithm and Cipher Mode.
    Returns (ciphertext_b64, key_hex, algorithm, mode)
    """
    algorithm = algorithm.upper()
    mode = mode.upper()
    key = get_random_bytes(32)

    match algorithm:
        case "AES":
            if mode == "ChaCha20_Poly1305":
                raise ValueError(f"{mode} cipher mode cannot be done for AES")
            mode_constant = getattr(AES, f"MODE_{mode}")
            if mode in ["ECB", "SIV", "OpenPGP"]:
                cipher = AES.new(key, mode_constant)
                ciphertext, tag = cipher.encrypt(data)
                combined = ciphertext
            elif mode == "CTR":
                cipher = AES.new(key, mode_constant)
                ciphertext = cipher.encrypt(data)
                combined = cipher.nonce + ciphertext
            else:
                cipher = AES.new(key, mode_constant) 
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = cipher.nonce + tag + ciphertext
            return base64.b64encode(combined).decode(), key.hex(), "AES", mode
        
        case "DES":
            if mode in ["ChaCha20_Poly1305", "EAX", "GCM", "CCM", "SIV", "OCB"]:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            
            if mode in ["ECB", "OpenPGP"]:
                cipher = DES.new(key, mode_constant)
                ciphertext, tag = cipher.encrypt(data)
                combined = ciphertext
            elif mode == "CTR":
                cipher = DES.new(key, mode_constant)
                ciphertext = cipher.encrypt(data)
                combined = cipher.nonce + ciphertext
            else:
                cipher = DES.new(key, mode_constant) 
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = cipher.nonce + tag + ciphertext
            return base64.b64encode(combined).decode(), key.hex(), "DES", mode
        
        case "DES3":
            if mode in ["ChaCha20_Poly1305", "EAX", "GCM", "CCM", "SIV", "OCB"]:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            
            if mode == "ECB":
                cipher = DES3.new(key, mode_constant)
                ciphertext, tag = cipher.encrypt(data)
                combined = ciphertext
            elif mode == "CTR":
                cipher = DES3.new(key, mode_constant)
                ciphertext = cipher.encrypt(data)
                combined = cipher.nonce + ciphertext
            else:
                cipher = DES3.new(key, mode_constant) 
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = cipher.nonce + tag + ciphertext
            return base64.b64encode(combined).decode(), key.hex(), "DES3", mode
        
        case "CAST-128":         
            if mode == "ECB":
                cipher = CAST.new(key, mode_constant)
                ciphertext, tag = cipher.encrypt(data)
                combined = ciphertext
            elif mode in ["CBC", "CFB", "OFB"]:
                cipher = CAST.new(key, mode_constant) 
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = cipher.nonce + tag + ciphertext
            else:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            return base64.b64encode(combined).decode(), key.hex(), "CAST-128", mode
        
        case "ChaCha20":
            if mode == "ChaCha20_Poly1305":
                cipher = ChaCha20_Poly1305.new(key=key)
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = cipher.nonce + tag + ciphertext
            else:
                raise ValueError(f"{algorithm} supports ony {mode} cipher mode")
            return base64.b64encode(combined).decode(), key.hex(), "ChaCha20", mode

        case "XChaCha20":
            if mode == "ChaCha20_Poly1305":
                cipher = XChaCha20Poly1305(key)
                nonce = os.urandom(24) 
                ciphertext = cipher.encrypt(nonce, data, associated_data=None)
                combined = nonce + ciphertext
            else:
                raise ValueError(f"{algorithm} supports ony {mode} cipher mode")
            return base64.b64encode(combined).decode(), key.hex(), "XChaCha20", mode


def decrypt_bytes(ciphertext_b64: str, key_hex: str, algorithm: str, mode: str):
    """
    Decrypts base64 ciphertext into BytesIO.
    """
    algorithm = algorithm.upper()
    mode = mode.upper()
    key = bytes.fromhex(key_hex)
    raw = base64.b64decode(ciphertext_b64)

    match algorithm:
        case "AES":
            if mode == "ChaCha20_Poly1305":
                raise ValueError(f"{mode} cipher mode cannot be done for AES")
            mode_constant = getattr(AES, f"MODE_{mode}")
            if mode in ["ECB", "SIV", "OpenPGP"]:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            elif mode == "CTR":
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
                data = cipher.decrypt(ciphertext, tag)
            else:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            return BytesIO(data)
        
        case "DES":
            if mode in ["ChaCha20_Poly1305", "EAX", "GCM", "CCM", "SIV", "OCB"]:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            
            mode_constant = getattr(DES, f"MODE_{mode}")
            if mode in ["ECB", "OpenPGP"]:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            elif mode == "CTR":
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt(ciphertext, tag)
            else:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            return BytesIO(data)
        
        case "DES3":
            if mode in ["ChaCha20_Poly1305", "EAX", "GCM", "CCM", "SIV", "OCB"]:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            
            mode_constant = getattr(DES3, f"MODE_{mode}")
            if mode in ["ECB", "OpenPGP"]:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES3.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            elif mode == "CTR":
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES3.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt(ciphertext, tag)
            else:
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES3.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            return BytesIO(data)
        
        case "CAST-128":   
            mode_constant = getattr(CAST, f"MODE_{mode}") 
            if mode == "ECB":
                nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
                cipher = DES3.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            elif mode in ["CBC", "CFB", "OFB"]:
                cipher = CAST.new(key, mode_constant) 
                ciphertext, tag = cipher.encrypt_and_digest(raw)
                combined = cipher.nonce + tag + ciphertext
            else:
                raise ValueError(f"{algorithm} incompatible with {mode}")
            return base64.b64encode(combined).decode(), key.hex(), "CAST-128", mode
        
        case "ChaCha20":
            if mode == "ChaCha20_Poly1305":
                nonce, tag, ciphertext = raw[:12], raw[12:28], raw[28:]
                cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            else:
                raise ValueError(f"{algorithm} supports ony {mode} cipher mode")
            return BytesIO(data)

        case "XChaCha20":
            if mode == "ChaCha20_Poly1305":
                nonce, ciphertext = raw[:24], raw[24:]
                aead = XChaCha20Poly1305(key)
                data = aead.decrypt(nonce, ciphertext, None)
            else:
                raise ValueError(f"{algorithm} supports ony {mode} cipher mode")
            return BytesIO(data)


def encrypt_text(text: str, algorithm: str, mode: str):
    return encrypt_bytes(text.encode(), algorithm, mode)


def decrypt_text(ciphertext_b64: str, key_hex: str, algorithm: str, mode: str):
    return decrypt_bytes(ciphertext_b64, key_hex, algorithm, mode).getvalue().decode()


def encrypt_file(file_path: str, algorithm: str, mode: str):
    with open(file_path, "rb") as f:
        data = f.read()
    return encrypt_bytes(data, algorithm, mode)


def decrypt_file(ciphertext_b64: str, key_hex: str, output_path: str, algorithm: str, mode: str):
    stream = decrypt_bytes(ciphertext_b64, key_hex, algorithm, mode)
    with open(output_path, "wb") as f:
        f.write(stream.getvalue())
