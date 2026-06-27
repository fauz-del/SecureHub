from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import auth, records, behavior

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecureHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(records.router)
app.include_router(behavior.router)


@app.get("/health")
def health():
    return {"status": "ok"}
