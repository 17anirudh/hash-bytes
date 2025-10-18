from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

BASE = declarative_base()

class AlgorithmEnum(Enum):
    AES = "AES"
    DES = "DES"
    TripleDES = "3DES"
    CAST128 = "CAST-128"
    RC2 = "RC2"
    CHACHA20 = "ChaCha20"
    XCHACHA20 = "XChaCha20"
    SALSA20 = "Salsa20"
    RC4 = "RC4"

class TypeOp(Enum):
    ENCRYPT: "Encryption"
    DECRYPT: "Decryption"

class PyAlgorithmEnum(str, Enum):
    AES = "AES"
    DES = "DES"
    TripleDES = "3DES"
    CAST128 = "CAST-128"
    RC2 = "RC2"
    CHACHA20 = "ChaCha20"
    XCHACHA20 = "XChaCha20"
    SALSA20 = "Salsa20"
    RC4 = "RC4"


class Table(BASE):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    algorithm = Column(Enum(AlgorithmEnum), nullable=False)
    operation = Column(Enum(TypeOp), nullable=False)
    created_at = Column(DateTime, default=datetime.now())

class EncryptRequest(BaseModel):
    text: str
    algorithm: PyAlgorithmEnum

class EncryptResponse(BaseModel):
    cipher: str
    key: str

class DecryptRequest(BaseModel):
    cipher: str
    key: str
    algorithm: PyAlgorithmEnum

class DecryptResponse(BaseModel):
    text: str