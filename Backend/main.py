from definitions import Table, BASE, EncryptRequest, DecryptRequest, EncryptResponse, DecryptResponse, PyAlgorithmEnum
from fastapi import FastAPI, HTTPException, Depends, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from io import BytesIO
from logic import text_handler, file_handler

DATABASE_URL = "sqlite:///../Database/audit.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

BASE.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/encrypt-text", response_model=EncryptResponse)
async def encrypt_text(field: EncryptRequest, db: Session = Depends(get_db)):
    db_record = Table(algorithm=field.algorithm, operation="Encryption")
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    



@app.post("/decrypt", response_model=DecryptResponse)
async def decrypt(field: DecryptRequest, db: Session = Depends(get_db)):
    db_record = Table(algorithm=field.algorithm, operation="Decryption")
    db.add(db_record)
    db.commit()
    db.refresh(db_record)