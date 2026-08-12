import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

logger = logging.getLogger(__name__)

# Fallback token or set via environment variable
BOT_TOKEN = "777000111:AAFakeDemoTokenForTestingPurposes123"
WEBAPP_URL = "http://127.0.0.1:8000/app"  # Local served WebApp URL

dp = Dispatcher()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    user_name = message.from_user.first_name or "Пользователь"
    
    welcome_text = (
        f"👋 **Привет, {user_name}!**\n\n"
        f"🤖 Добро пожаловать в магазин подписок на лучшие ИИ-сервисы!\n\n"
        f"✨ **Что доступно внутри:**\n"
        f"• **ChatGPT 4o Plus** & Team\n"
        f"• **Claude 3.5 Sonnet Pro**\n"
        f"• **Gemini Advanced** (2 млн токенов)\n"
        f"• **Kimi AI k1.5**\n"
        f"• **Midjourney v6**\n"
        f"• **Perplexity Pro**\n\n"
        f"⚡ *Моментальная авто-выдача аккаунтов и инвайтов сразу после оплаты!*\n\n"
        f"Нажмите кнопку ниже, чтобы открыть витрину магазина:"
    )

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="⚡ Открыть Магазин Нейросетей",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ],
        [
            InlineKeyboardButton(text="💬 Служба поддержки", url="https://t.me/telegram"),
            InlineKeyboardButton(text="⭐ FAQ / Гарантии", callback_data="faq_info")
        ]
    ])

    await message.answer(welcome_text, parse_mode="Markdown", reply_markup=keyboard)

@dp.callback_query(lambda c: c.data == "faq_info")
async def process_faq(callback: types.CallbackQuery):
    faq_text = (
        "❓ **Часто задаваемые вопросы (FAQ)**\n\n"
        "1. **Как происходит выдача?**\n"
        "После оплаты в Telegram Mini App вам мгновенно высвечивается логин/пароль или ссылка-приглашение.\n\n"
        "2. **Есть ли гарантия на подписку?**\n"
        "Да, мы предоставляем гарантию 100% на весь срок действия купленной подписки!\n\n"
        "3. **Какие способы оплаты?**\n"
        "Telegram Stars, банковские карты (СБП), CryptoBot / TON."
    )
    await callback.message.answer(faq_text, parse_mode="Markdown")
    await callback.answer()

async def start_bot(bot_instance: Bot):
    try:
        logger.info("Telegram bot polling started...")
        await dp.start_polling(bot_instance)
    except Exception as e:
        logger.warning(f"Bot failed to start (expected if BOT_TOKEN is dummy): {e}")
