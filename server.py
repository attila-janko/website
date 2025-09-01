from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)

# Load events from the JSON file once at startup
with open(os.path.join(os.path.dirname(__file__), 'events.json')) as f:
    EVENTS = json.load(f)

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
    """Collect email subscriptions in memory."""
    data = request.get_json(force=True) or {}
    email = data.get('email', '').strip()
    if not email:
        return jsonify({'status': 'error', 'message': 'Email required'}), 400
    SUBSCRIBERS.append(email)
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True)
