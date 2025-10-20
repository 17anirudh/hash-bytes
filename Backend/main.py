from definitions import Table, BASE, EncryptRequest, DecryptRequest

from fastapi import FastAPI, HTTPException, Depends, UploadFile, Form, File, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pathlib import Path
from logic import encrypt_text, encrypt_file, decrypt_file, decrypt_text
import os
import tempfile
import base64
from io import BytesIO

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
templates = Jinja2Templates(directory="templates")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "message": "Hello, FastAPI!"})

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
    mode: str = Form(...),
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    try:
        content = await file.read()
        ext = Path(file.filename).suffix 
        original_name = Path(file.filename).stem  

        cipher_b64, key, used_algorithm, used_mode = encrypt_file(content, algorithm=algorithm, mode=mode)

        db_record = Table(
            cipher_key=key, 
            algorithm=used_algorithm, 
            mode=used_mode, 
            operation="encryption", 
            file_extension=ext
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        disguised_filename = f"{original_name}{ext}.enc"
        encrypted_bytes = base64.b64decode(cipher_b64)
        bio = BytesIO(encrypted_bytes)

        headers = {
            "Content-Disposition": f'attachment; filename="{disguised_filename}"',
            "X-Encryption-Key": key,
        }

        return StreamingResponse(
            bio,
            media_type="application/octet-stream",
            headers=headers,
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await file.close()

@app.post("/decrypt-text")
async def generate_plain_text(field: DecryptRequest, db: Session = Depends(get_db)):
    try:
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
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/decrypt-file")
async def generate_plain_file(
    db: Session = Depends(get_db),
    algorithm: str = Form(...),
    key: str = Form(...),
    file: UploadFile = File(...),
    mode: str = Form(...),
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    temp_file = None
    try:
        content = await file.read()
        ext = Path(file.filename).suffix 
        original_name = Path(file.filename).stem  

        ciphertext_b64 = base64.b64encode(content).decode()
        decrypted_bytes = decrypt_file(
            ciphertext_b64=ciphertext_b64,
            key_hex=key,
            output_path="",
            algorithm=algorithm,
            mode=mode
        )

        db_record = Table(
            cipher_key=key,
            algorithm=algorithm, 
            mode=mode, 
            operation="decryption", 
            file_extension=ext
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        original_filename = original_name if ext == ".enc" else f"{original_name}_decrypted{ext}"

        bio = BytesIO(decrypted_bytes)

        headers = {
            "Content-Disposition": f'attachment; filename="{original_filename}"',
        }

        return StreamingResponse(
            bio,
            media_type="application/octet-stream",
            headers=headers
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await file.close()

@app.get("/favicon.ico")
async def favicon():
    return {
        "message": "Yet to configure"
    }