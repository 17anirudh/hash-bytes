from sqlalchemy import Column, Integer, Enum, DateTime, String
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field

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

class Table(BASE):
    __tablename__ = "operations"
    
    id = Column(Integer, autoincrement="auto")
    cipher_key = Column(String, primary_key=True, index=True)
    file_extension = Column(String, default=None)
    algorithm = Column(Enum(AlgorithmEnum))
    mode = Column(String)
    operation = Column(String, nullable=False)
    performed_at = Column(DateTime, default=datetime.now())

class EncryptRequest(BaseModel):
    text: str = Field(None, description="Text to encrypt")
    algorithm: str = Field(None, description="Algorithm used")
    mode: str = Field(None, description="Cipher mode used")

class DecryptRequest(BaseModel):
    cipher: str
    key: str
    algorithm: str = Field(None, description="Algorithm used")