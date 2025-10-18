from definitions import AlgorithmEnum, Table, BASE, EncryptRequest, DecryptRequest, EncryptResponse, DecryptResponse
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = "sqlite:///../Database/audit.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

BASE.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/encrypt", response_model=EncryptResponse)
async def encrypt(field: EncryptRequest, db: Session = Depends(get_db)):
    db_record = Table(algorithm=field.algorithm, operation="Encryption")
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

@app.post("/decrypt", response_model=DecryptResponse)
async def encrypt(field: DecryptRequest, db: Session = Depends(get_db)):
    db_record = Table(algorithm=field.algorithm, operation="Decryption")
    db.add(db_record)
    db.commit()
    db.refresh(db_record)