from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import json
import sqlite3
import random
from datetime import datetime, timedelta
from backend.db.database import get_db

router = APIRouter(prefix="/api")

class PurchaseRequest(BaseModel):
    user_id: int
    product_id: str
    duration_months: int = 1
    access_type: str = "invite"
    pay_method: str = "demo"

class StockAddRequest(BaseModel):
    product_id: str
    stock_items: List[str]

@router.get("/products")
def get_products():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()

    products = []
    for r in rows:
        products.append({
            "id": r["id"],
            "name": r["name"],
            "category": r["category"],
            "icon": r["icon"],
            "bgClass": r["bgClass"],
            "badge": r["badge"],
            "badgeClass": r["badgeClass"],
            "subtitle": r["subtitle"],
            "price": r["price"],
            "instructions": json.loads(r["instructions"])
        })
    return {"products": products}

@router.get("/orders/{user_id}")
def get_user_orders(user_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    orders = []
    for r in rows:
        orders.append({
            "id": r["id"],
            "user_id": r["user_id"],
            "product_id": r["product_id"],
            "product_name": r["product_name"],
            "price": r["price"],
            "access_type": r["access_type"],
            "credentials": r["credentials"],
            "created_at": r["created_at"],
            "expiry_date": r["expiry_date"]
        })
    return {"orders": orders}

@router.post("/purchase")
def create_purchase(req: PurchaseRequest):
    conn = get_db()
    cursor = conn.cursor()

    # Find Product
    cursor.execute("SELECT * FROM products WHERE id = ?", (req.product_id,))
    product = cursor.fetchone()
    if not product:
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    # Check Stock
    cursor.execute("SELECT id, data FROM inventory WHERE product_id = ? AND is_sold = 0 LIMIT 1", (req.product_id,))
    stock_item = cursor.fetchone()

    if stock_item:
        inventory_id = stock_item["id"]
        credentials = stock_item["data"]
        # Mark as sold
        cursor.execute("UPDATE inventory SET is_sold = 1, sold_to_user_id = ? WHERE id = ?", (req.user_id, inventory_id))
    else:
        # Generated dynamic credential if stock is temporarily empty
        if req.access_type == "invite":
            credentials = f"https://{req.product_id}.ai/invite/auto_sub_{random.randint(100000, 999999)}"
        else:
            credentials = f"Логин: user_{req.user_id}@{req.product_id}.ru | Пароль: Pass_{random.randint(1000, 9999)}"

    # Calculate Price & Expiry
    base_price = product["price"]
    duration = req.duration_months
    discount = 1.0 if duration == 1 else (0.9 if duration == 3 else 0.75)
    type_mod = 0.7 if req.access_type == "shared" else (1.25 if req.access_type == "personal" else 1.0)
    final_price = int(base_price * duration * discount * type_mod)

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    expiry_date = (datetime.now() + timedelta(days=30 * duration)).strftime("%Y-%m-%d")
    order_id = f"ORD-{random.randint(100000, 999999)}"

    # Save Order
    cursor.execute("""
    INSERT INTO orders (id, user_id, product_id, product_name, price, access_type, credentials, created_at, expiry_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (order_id, req.user_id, req.product_id, product["name"], final_price, req.access_type, credentials, created_at, expiry_date))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "order_id": order_id,
        "product_name": product["name"],
        "price": final_price,
        "credentials": credentials,
        "expiry_date": expiry_date,
        "instructions": json.loads(product["instructions"])
    }

@router.post("/admin/add_stock")
def add_stock(req: StockAddRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    items = [(req.product_id, item.strip()) for item in req.stock_items if item.strip()]
    cursor.executemany("INSERT INTO inventory (product_id, data) VALUES (?, ?)", items)

    conn.commit()
    conn.close()
    return {"status": "success", "added_count": len(items)}
