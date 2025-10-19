from sqlalchemy import Column, Integer, Enum, DateTime, String
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, Field

BASE = declarative_base()

class Table(BASE):
    __tablename__ = "operations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    cipher_key = Column(String, nullable=False, index=True)
    file_extension = Column(String, nullable=True)
    algorithm = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    operation = Column(String, nullable=False)
    performed_at = Column(DateTime, default=datetime.now())

class EncryptRequest(BaseModel):
    text: str = Field(None, description="Text to encrypt")
    algorithm: str = Field(None, description="Algorithm used")
    mode: str = Field(None, description="Cipher mode used")

class DecryptRequest(BaseModel):
    cipher: str
    key: str
    mode: str
    algorithm: str = Field(None, description="Algorithm used")