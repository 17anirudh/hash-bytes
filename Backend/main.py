from definitions import Table, BASE, EncryptRequest, DecryptRequest
from fastapi import FastAPI, HTTPException, Depends, UploadFile, Form, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from pathlib import Path
from logic import encrypt_text, encrypt_file, decrypt_file, decrypt_text
import os
import tempfile
import base64

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
    mode: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    temp_file = None
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

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext, dir=tempfile.gettempdir()) as tmp:
            tmp.write(base64.b64decode(cipher_b64))
            temp_file = tmp.name
            
        background_tasks.add_task(cleanup_temp_file, temp_file)
        return FileResponse(
            path=temp_file,
            filename=disguised_filename,
            media_type="application/octet-stream"
        )

    except Exception as e:
        db.rollback()
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)
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
    file: UploadFile = File(...),
    mode: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    if not file:
        raise HTTPException(status_code=400, detail="File is required")

    temp_file = None
    try:
        content = await file.read()
        ext = Path(file.filename).suffix 
        original_name = Path(file.filename).stem  

        decrypted_data = decrypt_file(
            ciphertext_b64=base64.b64encode(content).decode(),
            key_hex="",  # Key should be provided by client
            output_path="",
            algorithm=algorithm,
            mode=mode
        )

        db_record = Table(
            cipher_key="",
            algorithm=algorithm, 
            mode=mode, 
            operation="decryption", 
            file_extension=ext
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        original_filename = original_name if ext == ".enc" else f"{original_name}_decrypted{ext}"

        with tempfile.NamedTemporaryFile(delete=False, suffix=ext, dir=tempfile.gettempdir()) as tmp:
            tmp.write(decrypted_data.getvalue())
            temp_file = tmp.name
            
        background_tasks.add_task(cleanup_temp_file, temp_file)
        return FileResponse(
            path=temp_file,
            filename=original_filename,
            media_type="application/octet-stream"
        )

    except Exception as e:
        db.rollback()
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        await file.close()

async def cleanup_temp_file(file_path: str):
    """Background task to delete temporary file after response is sent"""
    try:
        os.remove(file_path)
    except Exception as e:
        print(f"Error deleting temp file: {e}")

@app.get("/favicon.ico")
async def favicon():
    return {
        "message": "Yet to configure"
    }