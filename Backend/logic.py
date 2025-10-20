from io import BytesIO
from Crypto.Cipher import AES, DES, DES3, ChaCha20_Poly1305, CAST
from Crypto.Random import get_random_bytes
import base64

compatible_map: dict[str, list[str] | None] = {
    "AES":       ["ECB", "CBC", "CFB", "OFB", "CTR", "EAX", "GCM", "CCM", "SIV", "OCB"],
    "DES":       ["ECB", "CBC", "CFB", "OFB", "CTR"],          
    "DES3":      ["ECB", "CBC", "CFB", "OFB", "CTR"],        
    "CAST-128":  ["ECB", "CBC", "CFB", "OFB"],                      
    "ChaCha20":  ["ChaCha20_Poly1305"],                            
}

NONCE_SIZES = {
    "AES": {
        "CBC": 16, "CFB": 16, "OFB": 16, "CTR": 16,
        "EAX": 12, "GCM": 12, "CCM": 7, "SIV": 16, "OCB": 15
    },
    "DES": {"CBC": 8, "CFB": 8, "OFB": 8, "CTR": 8},
    "DES3": {"CBC": 8, "CFB": 8, "OFB": 8, "CTR": 8},
    "CAST-128": {"CBC": 8, "CFB": 8, "OFB": 8},
    "ChaCha20": {"ChaCha20_Poly1305": 12}
}

TAG_SIZE = 16 

def pad_data(data: bytes, block_size: int) -> bytes:
    """Add PKCS7 padding to data."""
    padding_len = block_size - (len(data) % block_size)
    return data + bytes([padding_len] * padding_len)

def unpad_data(data: bytes, block_size: int) -> bytes:
    """Remove PKCS7 padding from data."""
    padding_len = data[-1]
    return data[:-padding_len]

def encrypt_text(text: str, algorithm: str, mode: str):
    return encrypt_bytes(text.encode(), algorithm, mode)

def encrypt_file(file_input, algorithm: str, mode: str):
    """Encrypts either bytes or a file path string"""
    if isinstance(file_input, (bytes, bytearray)):
        data = file_input
    elif isinstance(file_input, str):
        with open(file_input, "rb") as f:
            data = f.read()
    else:
        raise TypeError("encrypt_file() expects bytes or a valid file path string")

    return encrypt_bytes(data, algorithm, mode)

def encrypt_bytes(data: bytes, algorithm: str, mode: str):
    """MAIN ENCRYPTION LOGIC"""
    algorithm = algorithm.upper()
    mode = mode.upper()

    match algorithm:
        case "AES":
            key = get_random_bytes(32)
            mode_constant = getattr(AES, f"MODE_{mode}")
            
            if mode == "ECB":
                padded_data = pad_data(data, 16)
                cipher = AES.new(key, mode_constant)
                ciphertext = cipher.encrypt(padded_data)
                combined = ciphertext
            
            elif mode == "CBC":
                iv_size = NONCE_SIZES["AES"][mode]
                iv = get_random_bytes(iv_size)
                padded_data = pad_data(data, 16)
                cipher = AES.new(key, mode_constant, iv=iv)
                ciphertext = cipher.encrypt(padded_data)
                combined = iv + ciphertext
            
            elif mode in ["CFB", "OFB"]:
                iv_size = NONCE_SIZES["AES"][mode]
                iv = get_random_bytes(iv_size)
                cipher = AES.new(key, mode_constant, iv=iv)
                ciphertext = cipher.encrypt(data)
                combined = iv + ciphertext
            
            elif mode == "CTR":
                nonce_size = NONCE_SIZES["AES"]["CTR"]
                nonce = get_random_bytes(nonce_size)
                cipher = AES.new(key, mode_constant, nonce=nonce)
                ciphertext = cipher.encrypt(data)
                combined = nonce + ciphertext
            
            elif mode in ["EAX", "GCM", "OCB"]:
                nonce_size = NONCE_SIZES["AES"][mode]
                nonce = get_random_bytes(nonce_size)
                cipher = AES.new(key, mode_constant, nonce=nonce)
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = nonce + tag + ciphertext
            
            elif mode == "CCM":
                nonce_size = NONCE_SIZES["AES"]["CCM"]
                nonce = get_random_bytes(nonce_size)
                cipher = AES.new(key, mode_constant, nonce=nonce)
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = nonce + tag + ciphertext
            
            elif mode == "SIV":
                nonce_size = NONCE_SIZES["AES"]["SIV"]
                nonce = get_random_bytes(nonce_size)
                cipher = AES.new(key, mode_constant, nonce=nonce)
                ciphertext, tag = cipher.encrypt_and_digest(data)
                combined = tag + nonce + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "AES", mode
        
        case "DES":
            key = get_random_bytes(8)
            mode_constant = getattr(DES, f"MODE_{mode}")
            
            if mode == "ECB":
                padded_data = pad_data(data, 8)
                cipher = DES.new(key, mode_constant)
                ciphertext = cipher.encrypt(padded_data)
                combined = ciphertext
            
            else:  # CBC, CFB, OFB, CTR
                if mode == "CBC":
                    iv_size = NONCE_SIZES["DES"][mode]
                    iv = get_random_bytes(iv_size)
                    padded_data = pad_data(data, 8)
                    cipher = DES.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(padded_data)
                    combined = iv + ciphertext
                elif mode in ["CFB", "OFB"]:
                    iv_size = NONCE_SIZES["DES"][mode]
                    iv = get_random_bytes(iv_size)
                    cipher = DES.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(data)
                    combined = iv + ciphertext
                else:  # CTR
                    nonce = get_random_bytes(NONCE_SIZES["DES"]["CTR"])
                    cipher = DES.new(key, mode_constant, nonce=nonce)
                    ciphertext = cipher.encrypt(data)
                    combined = nonce + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "DES", mode
        
        case "DES3":
            key = get_random_bytes(24)
            mode_constant = getattr(DES3, f"MODE_{mode}")
            
            if mode == "ECB":
                padded_data = pad_data(data, 8)
                cipher = DES3.new(key, mode_constant)
                ciphertext = cipher.encrypt(padded_data)
                combined = ciphertext
            
            else:  # CBC, CFB, OFB, CTR
                if mode == "CBC":
                    iv_size = NONCE_SIZES["DES3"][mode]
                    iv = get_random_bytes(iv_size)
                    padded_data = pad_data(data, 8)
                    cipher = DES3.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(padded_data)
                    combined = iv + ciphertext
                elif mode in ["CFB", "OFB"]:
                    iv_size = NONCE_SIZES["DES3"][mode]
                    iv = get_random_bytes(iv_size)
                    cipher = DES3.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(data)
                    combined = iv + ciphertext
                else:  # CTR
                    nonce = get_random_bytes(NONCE_SIZES["DES3"]["CTR"])
                    cipher = DES3.new(key, mode_constant, nonce=nonce)
                    ciphertext = cipher.encrypt(data)
                    combined = nonce + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "DES3", mode
        
        case "CAST-128":
            key = get_random_bytes(16)
            mode_constant = getattr(CAST, f"MODE_{mode}")
            
            if mode == "ECB":
                padded_data = pad_data(data, 8)
                cipher = CAST.new(key, mode_constant)
                ciphertext = cipher.encrypt(padded_data)
                combined = ciphertext
            
            else:  # CBC, CFB, OFB
                if mode == "CBC":
                    iv_size = NONCE_SIZES["CAST-128"][mode]
                    iv = get_random_bytes(iv_size)
                    padded_data = pad_data(data, 8)
                    cipher = CAST.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(padded_data)
                    combined = iv + ciphertext
                else:  # CFB, OFB
                    iv_size = NONCE_SIZES["CAST-128"][mode]
                    iv = get_random_bytes(iv_size)
                    cipher = CAST.new(key, mode_constant, iv=iv)
                    ciphertext = cipher.encrypt(data)
                    combined = iv + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "CAST-128", mode
        
        case "ChaCha20":
            key = get_random_bytes(32)
            nonce = get_random_bytes(12)
            # mode_constant = getattr(CAST, f"MODE_{mode}")
            aead = ChaCha20_Poly1305.new(key)
            ciphertext = aead.encrypt(nonce, data, None)
            combined = nonce + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "ChaCha20", "ChaCha20_Poly1305"

def decrypt_bytes(ciphertext_b64: str, key_hex: str, algorithm: str, mode: str):
    """MAIN DECRYPTION LOGIC"""
    algorithm = algorithm.upper()
    mode = mode.upper()
    key = bytes.fromhex(key_hex)
    raw = base64.b64decode(ciphertext_b64)

    match algorithm:
        case "AES":
            mode_constant = getattr(AES, f"MODE_{mode}")
            
            if mode == "ECB":
                cipher = AES.new(key, mode_constant)
                padded_data = cipher.decrypt(raw)
                data = unpad_data(padded_data, 16)
            
            elif mode == "CBC":
                iv_size = NONCE_SIZES["AES"][mode]
                iv = raw[:iv_size]
                ciphertext = raw[iv_size:]
                cipher = AES.new(key, mode_constant, iv=iv)
                padded_data = cipher.decrypt(ciphertext)
                data = unpad_data(padded_data, 16)
            
            elif mode in ["CFB", "OFB"]:
                iv_size = NONCE_SIZES["AES"][mode]
                iv = raw[:iv_size]
                ciphertext = raw[iv_size:]
                cipher = AES.new(key, mode_constant, iv=iv)
                data = cipher.decrypt(ciphertext)
            
            elif mode == "CTR":
                nonce_size = NONCE_SIZES["AES"]["CTR"]
                nonce = raw[:nonce_size]
                ciphertext = raw[nonce_size:]
                cipher = AES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt(ciphertext)
            
            elif mode in ["EAX", "GCM", "OCB"]:
                nonce_size = NONCE_SIZES["AES"][mode]
                nonce = raw[:nonce_size]
                tag = raw[nonce_size:nonce_size + TAG_SIZE]
                ciphertext = raw[nonce_size + TAG_SIZE:]
                cipher = AES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            
            elif mode == "CCM":
                nonce_size = NONCE_SIZES["AES"]["CCM"]
                nonce = raw[:nonce_size]
                tag = raw[nonce_size:nonce_size + TAG_SIZE]
                ciphertext = raw[nonce_size + TAG_SIZE:]
                cipher = AES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            
            elif mode == "SIV":
                tag = raw[:TAG_SIZE]
                nonce_size = NONCE_SIZES["AES"]["SIV"]
                nonce = raw[TAG_SIZE:TAG_SIZE + nonce_size]
                ciphertext = raw[TAG_SIZE + nonce_size:]
                cipher = AES.new(key, mode_constant, nonce=nonce)
                data = cipher.decrypt_and_verify(ciphertext, tag)
            
            return BytesIO(data)
        
        case "DES":
            mode_constant = getattr(DES, f"MODE_{mode}")
            
            if mode == "ECB":
                cipher = DES.new(key, mode_constant)
                padded_data = cipher.decrypt(raw)
                data = unpad_data(padded_data, 8)
            
            else:  # CBC, CFB, OFB, CTR
                if mode in ["CBC", "CFB", "OFB"]:
                    iv_size = NONCE_SIZES["DES"][mode]
                    iv = raw[:iv_size]
                    ciphertext = raw[iv_size:]
                    cipher = DES.new(key, mode_constant, iv=iv)
                    data = cipher.decrypt(ciphertext)
                else:  # CTR
                    nonce_size = NONCE_SIZES["DES"]["CTR"]
                    nonce = raw[:nonce_size]
                    ciphertext = raw[nonce_size:]
                    cipher = DES.new(key, mode_constant, nonce=nonce)
                    data = cipher.decrypt(ciphertext)
            
            if mode == "CBC":
                data = unpad_data(data, 8)
            
            return BytesIO(data)
        
        case "DES3":
            mode_constant = getattr(DES3, f"MODE_{mode}")
            
            if mode == "ECB":
                cipher = DES3.new(key, mode_constant)
                padded_data = cipher.decrypt(raw)
                data = unpad_data(padded_data, 8)
            
            else:  # CBC, CFB, OFB, CTR
                if mode in ["CBC", "CFB", "OFB"]:
                    iv_size = NONCE_SIZES["DES3"][mode]
                    iv = raw[:iv_size]
                    ciphertext = raw[iv_size:]
                    cipher = DES3.new(key, mode_constant, iv=iv)
                    data = cipher.decrypt(ciphertext)
                else:  # CTR
                    nonce_size = NONCE_SIZES["DES3"]["CTR"]
                    nonce = raw[:nonce_size]
                    ciphertext = raw[nonce_size:]
                    cipher = DES3.new(key, mode_constant, nonce=nonce)
                    data = cipher.decrypt(ciphertext)
            
            if mode == "CBC":
                data = unpad_data(data, 8)
            
            return BytesIO(data)
        
        case "CAST-128":
            mode_constant = getattr(CAST, f"MODE_{mode}")
            
            if mode == "ECB":
                cipher = CAST.new(key, mode_constant)
                padded_data = cipher.decrypt(raw)
                data = unpad_data(padded_data, 8)
            
            else:  # CBC, CFB, OFB
                iv_size = NONCE_SIZES["CAST-128"][mode]
                iv = raw[:iv_size]
                ciphertext = raw[iv_size:]
                cipher = CAST.new(key, mode_constant, iv=iv)
                data = cipher.decrypt(ciphertext)
                if mode == "CBC":
                    data = unpad_data(data, 8)
            
            return BytesIO(data)
        
        case "ChaCha20":
            nonce_size = 12
            nonce = raw[:nonce_size]
            tag = raw[nonce_size:nonce_size + TAG_SIZE]
            ciphertext = raw[nonce_size + TAG_SIZE:]
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            data = cipher.decrypt_and_verify(ciphertext, tag)
            
            return BytesIO(data)

def decrypt_text(ciphertext_b64: str, key_hex: str, algorithm: str, mode: str):
    return decrypt_bytes(ciphertext_b64, key_hex, algorithm, mode).getvalue().decode()

def decrypt_file(ciphertext_b64: str, key_hex: str, output_path: str, algorithm: str, mode: str):
    stream = decrypt_bytes(ciphertext_b64, key_hex, algorithm, mode)
    with open(output_path, "wb") as f:
        f.write(stream.getvalue())