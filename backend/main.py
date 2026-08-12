import asyncio
import os
import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from aiogram import Bot

from backend.db.database import init_db
from backend.api.router import router as api_router
from backend.bot.bot import start_bot, BOT_TOKEN

from contextlib import asynccontextmanager

# Initialize DB
init_db()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if "AAFakeDemoToken" not in BOT_TOKEN:
        bot = Bot(token=BOT_TOKEN)
        asyncio.create_task(start_bot(bot))
    else:
        print("[AI SHOP] Demo Mode: WebApp API server is running at http://127.0.0.1:8000/app")
    yield

app = FastAPI(title="AI Subscription Store API & Mini App", version="1.0.0", lifespan=lifespan)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router)

# Mount WebApp Static Files
WEBAPP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "webapp"))
app.mount("/app", StaticFiles(directory=WEBAPP_DIR, html=True), name="webapp")

@app.get("/")
def read_root():
    return RedirectResponse(url="/app")

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

