from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from App.routes import router
from App.middleware import RateLimitMiddleware
from App.utils import check_environment_variables
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Verify environment setup
check_environment_variables()

app = FastAPI()

# Get allowed origins from environment or use a default for development
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting (10 requests per minute)
app.add_middleware(RateLimitMiddleware, max_requests=10, window_seconds=60)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "StudyMe API running 🚀"}

