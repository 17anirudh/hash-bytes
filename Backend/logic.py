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
        
        case "CHACHA20":
            key = get_random_bytes(32)
            nonce = get_random_bytes(12)
            # mode_constant = getattr(CAST, f"MODE_{mode}")
            cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
            ciphertext, tag = cipher.encrypt_and_digest(data)
            combined = nonce + tag + ciphertext
            
            return base64.b64encode(combined).decode(), key.hex(), "ChaCha20", "ChaCha20_Poly1305"

def decrypt_bytes(ciphertext, key_hex: str, algorithm: str, mode: str) -> BytesIO:
    """Decrypt raw bytes or BytesIO using your NONCE_SIZES and PKCS7 padding"""
    algorithm = algorithm.upper()
    mode = mode.upper()
    key = bytes.fromhex(key_hex)

    # Convert BytesIO or base64 string to bytes
    if isinstance(ciphertext, BytesIO):
        raw = ciphertext.getvalue()
    elif isinstance(ciphertext, str):
        raw = base64.b64decode(ciphertext)
    else:
        raw = ciphertext  # already bytes

    if algorithm == "AES":
        mode_constant = getattr(AES, f"MODE_{mode}")

        if mode == "ECB":
            block_size = 16
            if len(raw) % block_size != 0:
                raise ValueError(f"Ciphertext length {len(raw)} not aligned to {block_size}-byte block for ECB")
            cipher = AES.new(key, mode_constant)
            padded_data = cipher.decrypt(raw)
            data = unpad_data(padded_data, block_size)

        elif mode == "CBC":
            iv_size = NONCE_SIZES["AES"]["CBC"]
            iv, ciphertext_bytes = raw[:iv_size], raw[iv_size:]
            cipher = AES.new(key, mode_constant, iv=iv)
            padded_data = cipher.decrypt(ciphertext_bytes)
            data = unpad_data(padded_data, 16)

        elif mode in ["CFB", "OFB"]:
            iv_size = NONCE_SIZES["AES"][mode]
            iv, ciphertext_bytes = raw[:iv_size], raw[iv_size:]
            cipher = AES.new(key, mode_constant, iv=iv)
            data = cipher.decrypt(ciphertext_bytes)

        elif mode == "CTR":
            nonce_size = NONCE_SIZES["AES"]["CTR"]
            nonce, ciphertext_bytes = raw[:nonce_size], raw[nonce_size:]
            cipher = AES.new(key, mode_constant, nonce=nonce)
            data = cipher.decrypt(ciphertext_bytes)

        elif mode in ["EAX", "GCM", "OCB", "CCM", "SIV"]:
            nonce_size = NONCE_SIZES["AES"].get(mode, 16)
            nonce, tag = raw[:nonce_size], raw[nonce_size:nonce_size + TAG_SIZE]
            ciphertext_bytes = raw[nonce_size + TAG_SIZE:]
            cipher = AES.new(key, mode_constant, nonce=nonce)
            data = cipher.decrypt_and_verify(ciphertext_bytes, tag)

        else:
            raise ValueError(f"Unsupported AES mode: {mode}")

    elif algorithm in ["DES", "DES3", "CAST-128"]:
        CIPHER = {"DES": DES, "DES3": DES3, "CAST-128": CAST}[algorithm]
        mode_constant = getattr(CIPHER, f"MODE_{mode}")
        block_size = 8

        if mode == "ECB":
            if len(raw) % block_size != 0:
                raise ValueError(f"Ciphertext length {len(raw)} not aligned to {block_size}-byte block for ECB")
            cipher = CIPHER.new(key, mode_constant)
            padded_data = cipher.decrypt(raw)
            data = unpad_data(padded_data, block_size)

        elif mode in ["CBC", "CFB", "OFB"]:
            iv_size = NONCE_SIZES[algorithm][mode]
            iv, ciphertext_bytes = raw[:iv_size], raw[iv_size:]
            cipher = CIPHER.new(key, mode_constant, iv=iv)
            data = cipher.decrypt(ciphertext_bytes)
            if mode == "CBC":
                data = unpad_data(data, block_size)

        elif mode == "CTR":
            nonce_size = NONCE_SIZES[algorithm]["CTR"]
            nonce, ciphertext_bytes = raw[:nonce_size], raw[nonce_size:]
            cipher = CIPHER.new(key, mode_constant, nonce=nonce)
            data = cipher.decrypt(ciphertext_bytes)

        else:
            raise ValueError(f"Unsupported {algorithm} mode: {mode}")

    elif algorithm == "CHACHA20":
        nonce_size = NONCE_SIZES["ChaCha20"]["ChaCha20_Poly1305"]
        nonce, tag, ciphertext_bytes = raw[:nonce_size], raw[nonce_size:nonce_size + TAG_SIZE], raw[nonce_size + TAG_SIZE:]
        cipher = ChaCha20_Poly1305.new(key=key, nonce=nonce)
        data = cipher.decrypt_and_verify(ciphertext_bytes, tag)

    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

    return BytesIO(data)

def decrypt_text(ciphertext_b64: str, key_hex: str, algorithm: str, mode: str):
    return decrypt_bytes(ciphertext_b64, key_hex, algorithm, mode).getvalue().decode()

def decrypt_file(key_hex: str, file_input, algorithm: str, mode: str):
    if isinstance(file_input, (bytes, bytearray)):
        data = file_input
    elif isinstance(file_input, str):
        with open(file_input, "rb") as f:
            data = f.read()
    else:
        raise TypeError("decrypt_file() expects bytes or a valid file path string")

    return decrypt_bytes(
        ciphertext=data,
        key_hex=key_hex,
        algorithm=algorithm,
        mode=mode
    )