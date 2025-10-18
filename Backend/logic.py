from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64, hashlib


def encrypt(text, key=None):
    if key is None:
        key = get_random_bytes(32)
        key_b64 = key.hex()
    else:
        key = hashlib.sha256(key.encode()).digest()
        key_b64 = base64.b64encode(key).decode()
    
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(text.encode())    
    combined = cipher.nonce + tag + ciphertext   
    return {
        "ciphertext": base64.b64encode(combined).decode(),
        "key": key_b64
    }


def decrypt(enc_text, key):
    data = base64.b64decode(enc_text)
    key = base64.b64decode(key)    
    nonce, tag, ciphertext = data[:16], data[16:32], data[32:]    
    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)    
    return cipher.decrypt_and_verify(ciphertext, tag).decode()
