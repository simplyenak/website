import hashlib
import hmac
import json
import os
import re
import secrets
import smtplib
import sqlite3
import time
from email.message import EmailMessage

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

SECRET = os.environ.get("WTM_SECRET", "")
HOOKKEY = os.environ.get("WTM_HOOKKEY", "")
DB_PATH = os.environ.get("WTM_DB", "/data/wtm.db")
SITE_URL = os.environ.get("WTM_SITE_URL", "https://whattoeatinmalaysia.pages.dev")
SMTP_HOST = os.environ.get("WTM_SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("WTM_SMTP_PORT", "587"))
SMTP_USER = os.environ.get("WTM_SMTP_USER", "")
SMTP_PASS = os.environ.get("WTM_SMTP_PASS", "")
SMTP_FROM = os.environ.get("WTM_SMTP_FROM", SMTP_USER or "info@simplyenak.com")
ORIGINS = [
    "https://whattoeatinmalaysia.com",
    "https://www.whattoeatinmalaysia.com",
    "https://whattoeatinmalaysia.pages.dev",
    "http://localhost:4324",
]

TOKEN_DAYS = 30
MAGIC_MINUTES = 15
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

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
    c.execute(
        "CREATE TABLE IF NOT EXISTS waitlist ("
        " email TEXT PRIMARY KEY, source TEXT, ts INTEGER)"
    )
    c.execute(
        "CREATE TABLE IF NOT EXISTS magic ("
        " token_hash TEXT PRIMARY KEY, email TEXT, expires INTEGER, used INTEGER DEFAULT 0, ts INTEGER)"
    )
    c.execute(
        "CREATE TABLE IF NOT EXISTS outbox ("
        " id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, link TEXT, ts INTEGER)"
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
    return {"email": email, "exp": exp_i, "products": [p for p in prods.split(",") if p]}


def norm_email(e: str) -> str:
    return (e or "").strip().lower()


def products_for(c, email: str) -> list[str]:
    rows = c.execute("SELECT product_id FROM purchases WHERE email = ?", (email,)).fetchall()
    return sorted({r[0] for r in rows})


def send_mail(to: str, subject: str, body: str):
    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        msg = EmailMessage()
        msg["From"] = SMTP_FROM
        msg["To"] = to
        msg["Subject"] = subject
        msg.set_content(body)
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
            s.starttls()
            s.login(SMTP_USER, SMTP_PASS)
            s.send_message(msg)
        return "smtp"
    return "outbox"


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/webhooks/thrivecart")
async def thrivecart_hook(request: Request, k: str = Query(default="")):
    if not HOOKKEY or k != HOOKKEY:
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    payload = await request.json()
    event = payload.get("event", "")
    customer = (payload.get("thrivecart") or {}).get("customer", {}) or {}
    email = norm_email(customer.get("email", ""))
    order_id = str((payload.get("thrivecart") or {}).get("order_id", ""))
    purchase_map = payload.get("purchase_map") or []
    product_ids = []
    for item in purchase_map:
        pid = str(item).replace("product-", "").strip()
        if pid.isdigit():
            product_ids.append(pid)
    cid = str((payload.get("thrivecart") or {}).get("customer_identifier", "") or "")
    if not product_ids and cid.isdigit():
        product_ids = [cid]
    now = int(time.time())
    c = db()
    c.execute(
        "INSERT INTO events (event, payload, ts) VALUES (?, ?, ?)",
        (event, json.dumps(payload)[:8000], now),
    )
    if email and product_ids:
        for pid in product_ids:
            c.execute(
                "INSERT INTO purchases (email, product_id, order_id, event, ts)"
                " VALUES (?, ?, ?, ?, ?)"
                " ON CONFLICT(email, product_id) DO UPDATE SET order_id=excluded.order_id, event=excluded.event, ts=excluded.ts",
                (email, pid, order_id, event, now),
            )
    c.commit()
    c.close()
    return {"ok": True, "email": email, "products": product_ids}


@app.post("/redeem")
async def redeem(request: Request):
    body = await request.json()
    email = norm_email(body.get("email", ""))
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "invalid email"}, status_code=400)
    c = db()
    prods = products_for(c, email)
    c.close()
    if not prods:
        return JSONResponse({"error": "no purchases found"}, status_code=404)
    exp = int(time.time()) + TOKEN_DAYS * 86400
    return {"token": sign(email, exp, prods), "products": prods, "exp": exp}


@app.get("/verify")
def verify(t: str = Query(default="")):
    data = unsign(t)
    if not data:
        return JSONResponse({"error": "invalid token"}, status_code=401)
    return data


@app.post("/waitlist")
async def waitlist(request: Request):
    body = await request.json()
    email = norm_email(body.get("email", ""))
    source = (body.get("source") or "site")[:40]
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "invalid email"}, status_code=400)
    c = db()
    c.execute(
        "INSERT INTO waitlist (email, source, ts) VALUES (?, ?, ?)"
        " ON CONFLICT(email) DO UPDATE SET source=excluded.source",
        (email, source, int(time.time())),
    )
    c.commit()
    count = c.execute("SELECT COUNT(*) FROM waitlist").fetchone()[0]
    c.close()
    return {"ok": True, "count": count}


@app.get("/waitlist/count")
def waitlist_count():
    c = db()
    count = c.execute("SELECT COUNT(*) FROM waitlist").fetchone()[0]
    c.close()
    return {"count": count}


@app.post("/auth/request")
async def auth_request(request: Request):
    body = await request.json()
    email = norm_email(body.get("email", ""))
    if not EMAIL_RE.match(email):
        return JSONResponse({"error": "invalid email"}, status_code=400)
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    now = int(time.time())
    c = db()
    # invalidate older unused tokens for this email
    c.execute("UPDATE magic SET used = 1 WHERE email = ? AND used = 0", (email,))
    c.execute(
        "INSERT INTO magic (token_hash, email, expires, used, ts) VALUES (?, ?, ?, 0, ?)",
        (token_hash, email, now + MAGIC_MINUTES * 60, now),
    )
    c.commit()
    c.close()
    link = f"{SITE_URL}/login#t={token}"
    mode = send_mail(
        email,
        "Your What to Eat in Malaysia login link",
        f"Click to sign in (valid {MAGIC_MINUTES} minutes):\n\n{link}\n\n"
        "If you didn't request this, you can ignore this email.",
    )
    if mode == "outbox":
        c = db()
        c.execute("INSERT INTO outbox (email, link, ts) VALUES (?, ?, ?)", (email, link, now))
        c.commit()
        c.close()
    # never reveal whether the email has purchases; identical response either way
    return {"ok": True}


@app.get("/auth/verify")
def auth_verify(token: str = Query(default="")):
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    c = db()
    row = c.execute(
        "SELECT email, expires, used FROM magic WHERE token_hash = ?", (token_hash,)
    ).fetchone()
    if not row:
        c.close()
        return JSONResponse({"error": "invalid link"}, status_code=400)
    email, expires, used = row
    now = int(time.time())
    if used or expires < now:
        c.execute("UPDATE magic SET used = 1 WHERE token_hash = ?", (token_hash,))
        c.commit()
        c.close()
        return JSONResponse({"error": "link expired, request a new one"}, status_code=400)
    c.execute("UPDATE magic SET used = 1 WHERE token_hash = ?", (token_hash,))
    c.commit()
    prods = products_for(c, email)
    on_waitlist = c.execute("SELECT 1 FROM waitlist WHERE email = ?", (email,)).fetchone()
    c.close()
    exp = now + TOKEN_DAYS * 86400
    return {
        "token": sign(email, exp, prods),
        "email": email,
        "products": prods,
        "waitlist": bool(on_waitlist),
        "exp": exp,
    }


@app.get("/me")
def me(t: str = Query(default="")):
    data = unsign(t)
    if not data:
        return JSONResponse({"error": "invalid token"}, status_code=401)
    c = db()
    on_waitlist = c.execute("SELECT 1 FROM waitlist WHERE email = ?", (data["email"],)).fetchone()
    c.close()
    return {**data, "waitlist": bool(on_waitlist)}


@app.get("/admin/outbox")
def admin_outbox(k: str = Query(default=""), email: str = Query(default="")):
    if not HOOKKEY or k != HOOKKEY:
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    c = db()
    if email:
        rows = c.execute(
            "SELECT email, link, ts FROM outbox WHERE email = ? ORDER BY id DESC LIMIT 5", (norm_email(email),)
        ).fetchall()
    else:
        rows = c.execute("SELECT email, link, ts FROM outbox ORDER BY id DESC LIMIT 5").fetchall()
    c.close()
    return {"links": [{"email": r[0], "link": r[1], "ts": r[2]} for r in rows]}


@app.get("/admin/waitlist")
def admin_waitlist(k: str = Query(default="")):
    if not HOOKKEY or k != HOOKKEY:
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    c = db()
    rows = c.execute("SELECT email, source, ts FROM waitlist ORDER BY ts").fetchall()
    c.close()
    lines = ["email,source,signed_up_at"] + [f"{r[0]},{r[1]},{time.strftime('%Y-%m-%d %H:%M', time.gmtime(r[2]))}" for r in rows]
    return JSONResponse({"csv": "\n".join(lines), "count": len(rows)})
