"""Codex-authored isolated acceptance service. No database or payment access."""
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/health":
            self.send_error(404)
            return
        payload = json.dumps({"service": "artemy-coding-acceptance", "head_sha": os.environ["ARTEMY_DEMO_SHA"], "mode": "isolated_acceptance"}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

if __name__ == "__main__":
    HTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
