import hashlib
import hmac
import json
import os
import sqlite3
import time

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

SECRET = os.environ.get("WTM_SECRET", "")
HOOKKEY = os.environ.get("WTM_HOOKKEY", "")
DB_PATH = os.environ.get("WTM_DB", "/data/wtm.db")
ORIGINS = [
    "https://whattoeatinmalaysia.com",
    "https://www.whattoeatinmalaysia.com",
    "https://whattoeatinmalaysia.pages.dev",
    "http://localhost:4324",
]

app = FastAPI(title="wtm-access")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def db():
    c = sqlite3.connect(DB_PATH)
    c.execute(
        "CREATE TABLE IF NOT EXISTS purchases ("
        " email TEXT, product_id TEXT, order_id TEXT, event TEXT, ts INTEGER,"
        " PRIMARY KEY (email, product_id))"
    )
    c.execute(
        "CREATE TABLE IF NOT EXISTS events ("
        " id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT, payload TEXT, ts INTEGER)"
    )
    return c


def sign(email: str, exp: int, products: list[str]) -> str:
    msg = f"{email}|{exp}|{','.join(products)}"
    mac = hmac.new(SECRET.encode(), msg.encode(), hashlib.sha256).hexdigest()
    return f"{mac}|{msg}"


def unsign(token: str):
    try:
        mac, email, exp, prods = token.split("|", 3)
    except ValueError:
        return None
    if not SECRET:
        return None
    expect = hmac.new(SECRET.encode(), f"{email}|{exp}|{prods}".encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(mac, expect):
        return None
    try:
        exp_i = int(exp)
    except ValueError:
        return None
    if exp_i < int(time.time()):
        return None
    return email, exp_i, [p for p in prods.split(",") if p]


def extract_product_ids(body: dict) -> list[str]:
    """ThriveCart sends purchase_map as list of 'product-12'/'bump-3'/'upsell-2'
    strings (dict in legacy variants) plus base_product int for the front-end."""
    ids: set[str] = set()
    raw = body.get("purchase_map")
    keys: list[str] = []
    if isinstance(raw, dict):
        keys = [str(k) for k in raw.keys()]
    elif isinstance(raw, list):
        keys = [str(x) for x in raw]
    for it in keys:
        it = it.strip()
        if it.startswith("product-") and it[len("product-"):].isdigit():
            ids.add(it[len("product-"):])
        elif it.isdigit():
            ids.add(it)
    bp = str(body.get("base_product") or "")
    if bp.isdigit():
        ids.add(bp)
    return sorted(ids)


@app.get("/health")
def health():
    return {"ok": True, "service": "wtm-access"}


@app.post("/webhooks/thrivecart")
async def thrivecart_hook(request: Request, k: str = Query(default="")):
    if not HOOKKEY or not hmac.compare_digest(k, HOOKKEY):
        return JSONResponse({"error": "forbidden"}, status_code=403)
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"error": "bad-json"}, status_code=400)
    event = str(body.get("event", "unknown"))
    tc_meta = body.get("thrivecart") or {}
    if tc_meta and str(tc_meta.get("account", "")) != "uiy":
        return JSONResponse({"error": "wrong-account"}, status_code=403)
    con = db()
    con.execute(
        "INSERT INTO events (event, payload, ts) VALUES (?,?,?)",
        (event, json.dumps(body)[:4000], int(time.time())),
    )

    customer = body.get("customer") or {}
    email = str(customer.get("email") or customer.get("identifier") or body.get("customer_identifier") or "")
    email = email.strip().lower()
    product_ids = extract_product_ids(body)

    if email and event in ("order.success", "order.rebill", "order.subscription_payment"):
        for pid in product_ids:
            con.execute(
                "INSERT OR REPLACE INTO purchases (email, product_id, order_id, event, ts)"
                " VALUES (?,?,?,?,?)",
                (email, pid, str(body.get("order_id", "")), event, int(time.time())),
            )
    elif email and event in ("order.refund", "order.cancelled", "order.subscription_cancelled"):
        for pid in product_ids:
            con.execute("DELETE FROM purchases WHERE email=? AND product_id=?", (email, pid))

    con.commit()
    con.close()
    return {"ok": True, "event": event, "email_recorded": bool(email)}


@app.post("/redeem")
async def redeem(request: Request):
    try:
        body = await request.json()
    except Exception:
        return JSONResponse({"error": "bad-json"}, status_code=400)
    email = str(body.get("email") or "").strip().lower()
    if "@" not in email or len(email) > 254:
        return JSONResponse({"error": "invalid-email"}, status_code=400)
    con = db()
    rows = con.execute("SELECT product_id FROM purchases WHERE email=?", (email,)).fetchall()
    con.close()
    if not rows:
        return JSONResponse({"ok": False, "error": "no-purchase-found"}, status_code=404)
    products = sorted({r[0] for r in rows})
    exp = int(time.time()) + 30 * 24 * 3600
    return {
        "ok": True,
        "email": email,
        "products": products,
        "expires": exp,
        "token": sign(email, exp, products),
    }


@app.get("/verify")
def verify(request: Request):
    auth = request.headers.get("authorization", "")
    token = auth.replace("Bearer", "").strip() or request.query_params.get("t", "")
    parsed = unsign(token)
    if not parsed:
        return JSONResponse({"ok": False, "error": "invalid-token"}, status_code=401)
    email, exp, products = parsed
    return {"ok": True, "email": email, "products": products, "expires": exp}
