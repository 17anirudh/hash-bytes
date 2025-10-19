from definitions import Table, BASE, EncryptRequest, DecryptRequest
from fastapi import FastAPI, HTTPException, Depends, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from io import BytesIO
from pathlib import Path
from logic import encrypt_text, encrypt_file, decrypt_file, decrypt_text

DATABASE_URL = "sqlite:///audit.db"
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

@app.get("/")
async def index():
    return {
        "message": "Hi bro",
        "description": "Root route, app ready for API signals"
    }

@app.post("/encrypt-text")
async def generate_cipher_text(field: EncryptRequest, db: Session = Depends(get_db)):
    cipher, key, algorithm, mode = encrypt_text(field.text, field.algorithm, field.mode)
    db_record = Table(
        cipher_key=key,
        algorithm=algorithm,
        mode=mode,
        operation="encryption",
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return {
        "cipher": cipher,
        "key": key,
    }

@app.post("/encrypt-file")
async def generate_cipher_file(
    db: Session = Depends(get_db),
    algorithm: str = Form(...),
    file: UploadFile = File(...),
    mode: str = Form(...)
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")
    
    try:
        ext = Path(file.filename).suffix
        content = await file.read()
        cipher, key, algorithm, mode = encrypt_file(
            content,
            algorithm=algorithm,
            mode=mode
        )
        
        db_record = Table(
            cipher_key=key,
            algorithm=algorithm,
            mode=mode,
            operation="encryption",
            file_extension=ext
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        return {
            "cipher": cipher,
            "key": key,
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await file.close()

@app.post("/decrypt-text")
async def generate_plain_text(field: DecryptRequest, db: Session = Depends(get_db)):
    text = decrypt_text(
        ciphertext_b64=field.cipher,
        key_hex=field.key,
        mode=field.mode,
        algorithm=field.algorithm
    )
    db_record = Table(
        cipher_key=field.key,
        algorithm=field.algorithm,
        mode=field.mode,
        operation="decryption",
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return {
        "plain-text": text,
    }