from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from App.routes import router  # or from .routes if inside a package

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "StudyMe API running 🚀"}
