from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(__file__)
EVENTS_FILE = os.path.join(BASE_DIR, 'events.json')
SUBSCRIBERS_FILE = os.path.join(BASE_DIR, 'subscribers.json')

# Load events from the JSON file once at startup
with open(EVENTS_FILE) as f:
    EVENTS = json.load(f)

if os.path.exists(SUBSCRIBERS_FILE):
    with open(SUBSCRIBERS_FILE) as f:
        SUBSCRIBERS = json.load(f)
else:
    SUBSCRIBERS = []

@app.get('/api/events')
def api_events():
    """Return events filtered by an optional search query."""
    term = request.args.get('q', '').lower()
    if term:
        filtered = [e for e in EVENTS if term in e['title'].lower()]
    else:
        filtered = EVENTS
    return jsonify(filtered)

@app.post('/api/subscribe')
def api_subscribe():
    """Collect email subscriptions and persist them to a JSON file."""
    data = request.get_json(force=True) or {}
    email = data.get('email', '').strip()
    if not email:
        return jsonify({'status': 'error', 'message': 'Email required'}), 400
    SUBSCRIBERS.append(email)
    with open(SUBSCRIBERS_FILE, 'w') as f:
        json.dump(SUBSCRIBERS, f)
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
