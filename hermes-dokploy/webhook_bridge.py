"""Webhook bridge from MyAlice → Twenty CRM"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, urllib.request, urllib.error

TWENTY_TOKEN = os.environ.get("TWENTY_TOKEN", "")
TWENTY_API = "https://twenty.system.simplyenak.com/rest"

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/healthz":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        length = int(self.headers.get("content-length", 0))
        body = self.rfile.read(length)
        try:
            data = json.loads(body)
            self.handle_webhook(data)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def handle_webhook(self, data):
        action = data.get("action", "")
        if action != "ticket.tagged":
            return
        tags = data.get("ticket", {}).get("tags", [])
        if not any(t.get("name") == "B2B Prospect" for t in tags):
            return
        customer = data.get("customer", {})
        person = {
            "name": {"firstName": customer.get("first_name") or "Unknown", "lastName": customer.get("last_name") or "Contact"},
            "phones": {"primaryPhoneNumber": customer.get("phone", "")} if customer.get("phone") else {},
        }
        if customer.get("email"):
            person["emails"] = {"primaryEmail": customer["email"]}
        headers = {"Authorization": f"Bearer {TWENTY_TOKEN}", "Content-Type": "application/json"}
        try:
            urllib.request.Request(f"{TWENTY_API}/people", data=json.dumps(person).encode(), headers=headers, method="POST")
            urllib.request.urlopen(req, timeout=10)
        except:
            pass

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"Listening on :{port}")
    server.serve_forever()
