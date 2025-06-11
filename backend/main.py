from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import company_profile

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(company_profile.router, prefix="/api")
