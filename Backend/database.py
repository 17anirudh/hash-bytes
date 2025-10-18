from fastapi import FastAPI
from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime


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


class Table(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    algorithm = Column(String)
    file_type = Column(String)
    operation = Column(Enum(AlgorithmEnum), nullable=False)
    quantity = Column(Integer)
    created_at = Column(DateTime, default=datetime.now())

# Create table
Base.metadata.create_all(bind=engine)

# Insert sample data
def insert_data():
    db = SessionLocal()
    
    products = [
        Product(name="Laptop", price=999.99, quantity=5),
        Product(name="Mouse", price=29.99, quantity=50),
        Product(name="Keyboard", price=79.99, quantity=30),
        Product(name="Monitor", price=299.99, quantity=10),
    ]
    
    db.add_all(products)
    db.commit()
    db.close()

# FastAPI app
app = FastAPI()

# Insert data on startup
@app.on_event("startup")
def startup_event():
    insert_data()

@app.get("/")
def read_root():
    return {"message": "Database created and data inserted"}