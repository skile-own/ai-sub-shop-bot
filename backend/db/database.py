import sqlite3
import json
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "store.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Create Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        bgClass TEXT NOT NULL,
        badge TEXT NOT NULL,
        badgeClass TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        price INTEGER NOT NULL,
        instructions TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        data TEXT NOT NULL,
        is_sold INTEGER DEFAULT 0,
        sold_to_user_id INTEGER,
        FOREIGN KEY (product_id) REFERENCES products (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        price INTEGER NOT NULL,
        access_type TEXT NOT NULL,
        credentials TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expiry_date TEXT NOT NULL
    )
    """)

    # Seed Default Products if Table is Empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        default_products = [
            (
                "chatgpt",
                "ChatGPT 4o Plus",
                "chatgpt",
                "fa-robot",
                "bg-chatgpt",
                "🔥 TOP SELL",
                "badge-hot",
                "GPT-4o, DALL-E 3, Canvas, кастомные GPTs и загрузка файлов",
                1490,
                json.dumps([
                    "1. Перейдите по отправленной вам ссылке-приглашению или используйте логин/пароль.",
                    "2. Откройте сайт chatgpt.com и авторизуйтесь.",
                    "3. Пользуйтесь возможностями ChatGPT Plus без ограничений!"
                ], ensure_ascii=False)
            ),
            (
                "claude",
                "Claude 3.5 Sonnet Pro",
                "claude",
                "fa-brain",
                "bg-claude",
                "⭐ TOP CODE",
                "badge-pro",
                "Лучшая ИИ-модель для написания кода, текста и анализа файлов",
                1890,
                json.dumps([
                    "1. Зайдите на claude.ai с предоставленным логином и паролем.",
                    "2. Введите код подтверждения (при необходимости напишите поддержке).",
                    "3. Пользуйтесь профессиональным Claude 3.5 Pro."
                ], ensure_ascii=False)
            ),
            (
                "gemini",
                "Gemini Advanced 1.5",
                "gemini",
                "fa-sparkles",
                "bg-gemini",
                "⚡ FAST",
                "badge-fast",
                "Модель от Google с гигантским контекстным окном на 2 млн токенов",
                1290,
                json.dumps([
                    "1. Перейдите по ссылке активации подписки Google One 2TB + Gemini.",
                    "2. Примите приглашение в семейную группу.",
                    "3. Gemini Advanced сразу активируется на вашем Google аккаунте!"
                ], ensure_ascii=False)
            ),
            (
                "kimi",
                "Kimi AI k1.5 Pro",
                "kimi",
                "fa-moon",
                "bg-kimi",
                "🔥 NEW",
                "badge-hot",
                "Прорывной азиатский ИИ с глубоким рассуждением и анализом длинных веб-страниц",
                990,
                json.dumps([
                    "1. Зайдите на kimi.moonshot.cn.",
                    "2. Введите предоставленный токен доступа в настройки профиля.",
                    "3. Наслаждайтесь лимитами Kimi Pro!"
                ], ensure_ascii=False)
            ),
            (
                "midjourney",
                "Midjourney v6 Basic/Pro",
                "midjourney",
                "fa-palette",
                "bg-midjourney",
                "🎨 ART",
                "badge-pro",
                "Генерация гиперреалистичных изображений и артов через Discord",
                1590,
                json.dumps([
                    "1. Зайдите в Discord и перейдите в личный кабинет Midjourney Bot.",
                    "2. Используйте выданный Fast Time ключ или личный аккаунт.",
                    "3. Генерируйте шедевры командами /imagine!"
                ], ensure_ascii=False)
            ),
            (
                "perplexity",
                "Perplexity Pro",
                "perplexity",
                "fa-compass",
                "bg-perplexity",
                "🔍 SEARCH",
                "badge-fast",
                "ИИ-поисковик с доступом к GPT-4o, Claude 3.5 и мгновенными ссылками на источники",
                1390,
                json.dumps([
                    "1. Зайдите на perplexity.ai с выданными учетными данными.",
                    "2. Доступ к Pro Search с выбором любых нейросетей активен!"
                ], ensure_ascii=False)
            )
        ]
        cursor.executemany("""
        INSERT INTO products (id, name, category, icon, bgClass, badge, badgeClass, subtitle, price, instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, default_products)

        # Seed Initial Inventory Items
        sample_inventory = [
            ("chatgpt", "https://chatgpt.com/invite/sub_team_991823"),
            ("chatgpt", "Логин: chatgpt_pro12@aistore.ru | Пароль: Pass_881923"),
            ("claude", "Логин: claude_premium@aistore.ru | Пароль: Sonnet35_2026"),
            ("gemini", "https://one.google.com/family/invite/gemini_sub_441"),
            ("kimi", "Токен: kimi_k15_pro_token_889123847"),
            ("midjourney", "Ключ: MJ-6-FAST-9921-X821-KEY"),
            ("perplexity", "Логин: perp_pro@aistore.ru | Пароль: SearchAI_2026")
        ]
        cursor.executemany("""
        INSERT INTO inventory (product_id, data) VALUES (?, ?)
        """, sample_inventory)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
