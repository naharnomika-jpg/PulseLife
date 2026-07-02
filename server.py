# PulseLife Custom Python HTTP Server & CORS API Proxy
import http.server
import socketserver
import urllib.request
import urllib.error
import sys

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/groq':
            # 1. Read request headers and body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            # 2. Get API key from Authorization header
            auth_header = self.headers.get('Authorization')
            
            try:
                # 3. Proxy request to Groq API server-side (bypasses browser CORS checks)
                req = urllib.request.Request(
                    'https://api.groq.com/openai/v1/chat/completions',
                    data=body,
                    headers={
                        'Content-Type': 'application/json',
                        'Authorization': auth_header,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    },
                    method='POST'
                )
                
                with urllib.request.urlopen(req) as response:
                    res_body = response.read()
                    self.send_response(response.status)
                    self.send_header('Content-Type', 'application/json')
                    # Enable CORS for local testing just in case
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(res_body)
                    
            except urllib.error.HTTPError as e:
                err_body = e.read()
                print(f"Proxy HTTP Error {e.code}: {err_body.decode('utf-8', errors='ignore')}")
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(err_body)
            except Exception as e:
                print(f"Proxy Generic Exception: {str(e)}")
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            # Fallback for standard POST requests
            super().do_POST()

    # Handle OPTIONS preflight requests if needed
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

handler = CustomHandler

# Allow port reuse on restart
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print(f"Serving PulseLife at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        sys.exit(0)
