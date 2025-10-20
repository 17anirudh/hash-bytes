# HASH BYTES

## Description
NextJS, FastAPI and Sqlite based full stack web application to be as an educational tool to quickly encrypt and decrypt any content using different cryptographic algorithms and revelant cipher modes along with explanations

## Features
- Frontend: NextJS(Framework), Shad-cn(headless components), TailwindCSS(CSS-in-JS)
- Backend: FastAPI(Framework), Pydantic(Validation)
- Database: SQLite(Database), SQLAlchemy(ORM)
- Core logic: pycryptodome
- Communication: REST API (application/json, multipart/form-data and application/octect-stream)

## Local installation
### Frontend
- Requirements (any one):
    - bun: v1.2.21
    - node: v24.9.0
- Bun style installation
    ```
    cd Frontend
    bun install
    ```
- Running web server
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend
- Requirements:
    - Python: v3.13.7
    - Pip: v25.2

- Optional (recommended)
    ```cmd
    cd Backend
    python -m venv venv/venv
    venv\venv\Scripts\Activate.ps1 #Windows
    venv\venv\Scripts\Activate #Mac/Linux
    ```

- Installation
    ```cmd
    cd Backend
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
    Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.