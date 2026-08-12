# 🤖 AI Subscriptions Telegram Store (Mini App + Bot)

Полноценный магазин подписок на топовые нейросети (**ChatGPT 4o, Claude 3.5 Sonnet, Gemini Advanced, Kimi AI k1.5, Midjourney v6, Perplexity Pro**) с витриной в формате **Telegram Mini App (WebApp)** и бэкендом на **Python (FastAPI + Aiogram 3)**.

---

## 🌟 Основной функционал

- 🎨 **Современный тёмный витринный интерфейс (Mini App)**:
  - Фильтрация по категориям ИИ-сервисов и живой поиск.
  - Тарифы: 1 месяц, 3 месяца (-10%), 12 месяцев (-25%).
  - Варианты доступа: Инвайт в группу, Личный аккаунт, Общий доступ.
  - Выбор способов оплаты (Демо-режим, Telegram Stars, СБП / Карты, Крипта).
- 🔑 **Авто-выдача цифровых товаров**:
  - Мгновенный показ инвайт-ссылки или учетных данных после оплаты.
  - База данныхSQLite с учётом складских остатков (`inventory`).
- 👤 **Кабинет покупателя**:
  - Просмотр активных подписок, дат окончания и инструкций по активации.
- 🛡️ **Панель администратора**:
  - Быстрое пополнение склада (логины, пароли, ссылки-приглашения).
  - Статистика выручки и количество заказов.
- 🤖 **Telegram Бот (Aiogram 3)**:
  - Приветственное меню с кнопкой открывания Mini App.
  - Отправка купленных ключей прямо в диалог с пользователем.

---

## 🚀 Запуск проекта

### 1. Установка зависимостей Python
```bash
pip install -r backend/requirements.txt
```

### 2. Запуск локального сервера
```bash
python -m backend.main
```
После этого сервер будет доступен по адресу:  
👉 **http://127.0.0.1:8000/app**

---

## 📱 Настройка Telegram Бота (BotFather)

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. Создайте нового бота командой `/newbot` и скопируйте `BOT_TOKEN`.
3. Замените `BOT_TOKEN` в файле [`backend/bot/bot.py`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/backend/bot/bot.py).
4. Пробросьте локальный порт 8000 через `ngrok` или `localtunnel`:
   ```bash
   npx localtunnel --port 8000
   ```
5. В `@BotFather` задайте кнопку меню через команду `/setmenubutton` или создайте приложение через `/newapp`, указав ваш https адрес (например: `https://xxxx.loca.lt/app`).

---

## 📁 Структура файлов

- [`webapp/index.html`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/webapp/index.html) — Разметка Telegram Mini App
- [`webapp/style.css`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/webapp/style.css) — Стили в стиле Cyberpunk AI / Glassmorphism
- [`webapp/app.js`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/webapp/app.js) — Логика Telegram SDK, витрина, чекаут и аккаунт
- [`backend/main.py`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/backend/main.py) — Главный запуск FastAPI + Aiogram
- [`backend/db/database.py`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/backend/db/database.py) — База данных SQLite с инициализацией товаров
- [`backend/api/router.py`](file:///C:/Users/kiril/.gemini/antigravity/scratch/ai_sub_shop_bot/backend/api/router.py) — API эндпоинты покупок и склада
