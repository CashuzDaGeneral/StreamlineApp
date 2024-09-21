from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static/react')
CORS(app)

@app.route('/api/<path:path>')
def api(path):
    # Handle API routes here
    return f"API endpoint: {path}"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return api(path[4:])
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
