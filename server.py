from flask import Flask, jsonify, request
import json
import os
import re
import tempfile
import threading

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024

BASE_DIR = os.path.dirname(__file__)
EVENTS_FILE = os.path.join(BASE_DIR, "events.json")
SUBSCRIBERS_FILE = os.path.join(BASE_DIR, "subscribers.json")
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
SUBSCRIBERS_LOCK = threading.Lock()


def load_json_list(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as source:
        value = json.load(source)
    return value if isinstance(value, list) else []


def write_json_atomically(path, value):
    descriptor, temporary_path = tempfile.mkstemp(
        dir=BASE_DIR, prefix=".subscribers-", suffix=".tmp", text=True
    )
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as destination:
            json.dump(value, destination)
        os.chmod(temporary_path, 0o600)
        os.replace(temporary_path, path)
    finally:
        if os.path.exists(temporary_path):
            os.unlink(temporary_path)


EVENTS = load_json_list(EVENTS_FILE)
SUBSCRIBERS = [
    value for value in load_json_list(SUBSCRIBERS_FILE) if isinstance(value, str)
]


@app.after_request
def security_headers(response):
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; base-uri 'none'; form-action 'self'; "
        "frame-ancestors 'none'; object-src 'none'"
    )
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response


@app.get("/api/events")
def api_events():
    """Return events filtered by an optional search query."""
    term = request.args.get("q", "")[:100].casefold()
    filtered = [
        event
        for event in EVENTS
        if not term or term in str(event.get("title", "")).casefold()
    ]
    return jsonify(filtered)


@app.post("/api/subscribe")
def api_subscribe():
    """Collect validated email subscriptions without exposing stored addresses."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"status": "error", "message": "JSON body required"}), 400

    email = str(data.get("email", "")).strip()
    if len(email) > 254 or not EMAIL_PATTERN.fullmatch(email):
        return jsonify({"status": "error", "message": "Valid email required"}), 400

    with SUBSCRIBERS_LOCK:
        if not any(existing.casefold() == email.casefold() for existing in SUBSCRIBERS):
            SUBSCRIBERS.append(email)
            write_json_atomically(SUBSCRIBERS_FILE, SUBSCRIBERS)

    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", debug=False)
