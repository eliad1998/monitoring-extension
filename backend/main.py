import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.routers.monitoring import monitoring_router
from app.routers.user import user_router

app = FastAPI()
app.include_router(user_router)
app.include_router(monitoring_router)

# FIXME: Check security issues
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000)
