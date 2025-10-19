from definitions import Table, BASE, EncryptRequest, DecryptRequest, PyAlgorithmEnum
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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///audit.db'

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/encrypt-text")
async def generate_cipher_text(field: EncryptRequest, db: Session = Depends(get_db)):
    cipher, key, algorithm, mode = encrypt_text(field.text, field.algorithm, field.mode)
    db_record = Table(
        algorithm=algorithm,
        cipher_key=key,
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
    algorithm: PyAlgorithmEnum = Form(...),
    file: UploadFile = File(...),
    mode: str = Form(...)
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")
    
    try:
        ext = Path(file.filename).suffix
        content = await file.read()
        cipher, key, algorithm, mode = encrypt_file(
            data=content,
            algorithm=algorithm,
            mode=mode
        )
        
        db_record = Table(
            algorithm=algorithm,
            cipher_key=key,
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