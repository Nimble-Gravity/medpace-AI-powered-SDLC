#!/usr/bin/env python3
"""Static dev server with lightweight live reload for local authoring."""

from __future__ import annotations

import argparse
import html
import os
import posixpath
import socketserver
import sys
import threading
import time
import urllib.parse
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
WATCHED_SUFFIXES = {
    ".html",
    ".css",
    ".js",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
}
POLL_INTERVAL = 0.5

_reload_version = 0
_reload_lock = threading.Lock()
_stop_event = threading.Event()

LIVE_RELOAD_SNIPPET = """
<script>
(() => {
  if (!window.EventSource) return;
  const source = new EventSource("/__livereload");
  source.onmessage = (event) => {
    if (event.data === "reload") window.location.reload();
  };
  source.onerror = () => {
    source.close();
    setTimeout(() => window.location.reload(), 1000);
  };
})();
</script>
""".strip()


def build_snapshot() -> dict[str, int]:
    snapshot: dict[str, int] = {}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [name for name in dirnames if name not in {".git", "__pycache__"}]
        for filename in filenames:
            path = Path(dirpath, filename)
            if path.suffix.lower() not in WATCHED_SUFFIXES:
                continue
            try:
                snapshot[str(path.relative_to(ROOT))] = path.stat().st_mtime_ns
            except FileNotFoundError:
                continue
    return snapshot


def watch_for_changes() -> None:
    global _reload_version

    previous = build_snapshot()
    while not _stop_event.wait(POLL_INTERVAL):
        current = build_snapshot()
        if current != previous:
            previous = current
            with _reload_lock:
                _reload_version += 1


class LiveReloadHandler(SimpleHTTPRequestHandler):
    server_version = "MedpaceDevServer/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        if self.path == "/__livereload":
            self.handle_livereload()
            return

        html_path = self.resolve_html_path()
        if html_path is not None:
            self.serve_html(html_path)
            return

        super().do_GET()

    def handle_livereload(self) -> None:
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        with _reload_lock:
            last_seen = _reload_version

        try:
            while not _stop_event.is_set():
                with _reload_lock:
                    current_version = _reload_version

                if current_version != last_seen:
                    self.wfile.write(b"data: reload\n\n")
                    self.wfile.flush()
                    last_seen = current_version
                else:
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()

                time.sleep(1)
        except (BrokenPipeError, ConnectionResetError):
            return

    def resolve_html_path(self) -> Path | None:
        parsed = urllib.parse.urlsplit(self.path)
        path = posixpath.normpath(urllib.parse.unquote(parsed.path))
        candidate = ROOT / path.lstrip("/")

        if parsed.path == "/":
            candidate = ROOT / "index.html"
        elif candidate.is_dir():
            index_file = candidate / "index.html"
            if index_file.is_file():
                candidate = index_file
            else:
                return None

        if candidate.is_file() and candidate.suffix.lower() == ".html":
            return candidate
        return None

    def serve_html(self, file_path: Path) -> None:
        try:
            content = file_path.read_text(encoding="utf-8")
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return

        if "</body>" in content:
            content = content.replace("</body>", LIVE_RELOAD_SNIPPET + "\n</body>", 1)
        else:
            content += "\n" + LIVE_RELOAD_SNIPPET

        encoded = content.encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(encoded)

    def list_directory(self, path: str):
        try:
            entries = sorted(os.listdir(path))
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "No permission to list directory")
            return None

        display_path = html.escape(urllib.parse.unquote(self.path), quote=False)
        lines = [
            "<!DOCTYPE html>",
            "<html><head><meta charset='utf-8'><title>Directory listing</title></head><body>",
            f"<h1>Directory listing for {display_path}</h1>",
            "<hr><ul>",
        ]

        for name in entries:
            full = Path(path, name)
            suffix = "/" if full.is_dir() else ""
            href = urllib.parse.quote(name) + suffix
            lines.append(f"<li><a href='{href}'>{html.escape(name + suffix)}</a></li>")

        lines.extend(["</ul><hr>", LIVE_RELOAD_SNIPPET, "</body></html>"])
        encoded = "\n".join(lines).encode("utf-8")

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(encoded)
        return None


class ReusableThreadingHTTPServer(ThreadingHTTPServer):
    daemon_threads = True


def main() -> int:
    parser = argparse.ArgumentParser(description="Local static server with live reload.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind. Default: 127.0.0.1")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind. Default: 8000")
    args = parser.parse_args()

    socketserver.TCPServer.allow_reuse_address = True

    watcher = threading.Thread(target=watch_for_changes, daemon=True)
    watcher.start()

    server = ReusableThreadingHTTPServer((args.host, args.port), LiveReloadHandler)

    print(f"Serving {ROOT} at http://{args.host}:{args.port}")
    print("Live reload watches HTML, CSS, JS, and image assets.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        _stop_event.set()
        server.server_close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
