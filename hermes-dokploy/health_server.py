#!/usr/bin/env python3
"""Lightweight HTTP health server for Docker HEALTHCHECK."""
import http.server, socketserver, threading, os

PORT = int(os.environ.get("HEALTH_PORT", 8080))

class HealthHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/health", "/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
        else:
            self.send_response(404)
            self.end_headers()
    def log_message(self, *_): pass

def run():
    with socketserver.TCPServer(("", PORT), HealthHandler) as s:
        s.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=run, daemon=True)
    t.start()
    t.join()