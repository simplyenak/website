"""Lightweight health server for Hermes Agent container.

Runs on port 8080, responds to /health with JSON status.
"""

import http.server
import threading
import json


class HealthHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/health", "/health/", "/"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            data = json.dumps({"status": "ok", "service": "hermes-agent"})
            self.wfile.write(data.encode())
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    server = http.server.HTTPServer(("0.0.0.0", 8080), HealthHandler)
    print("Health server listening on :8080")
    server.serve_forever()