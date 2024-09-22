from flask import Flask, send_from_directory, abort
from flask_cors import CORS
import os
import logging

app = Flask(__name__, static_folder='static/react', static_url_path='')
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/<path:path>')
def api(path):
    # Handle API routes here
    app.logger.info(f"API request received: {path}")
    return f"API endpoint: {path}"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    app.logger.info(f"Requested path: {path}")
    if path.startswith("api/"):
        return api(path[4:])
    elif path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        app.logger.info(f"Serving file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        app.logger.info(f"Serving index.html for path: {path}")
        try:
            return send_from_directory(app.static_folder, 'index.html')
        except FileNotFoundError:
            app.logger.error(f"index.html not found in {app.static_folder}")
            abort(404)

@app.errorhandler(404)
def not_found(e):
    app.logger.error(f"404 error: {e}")
    return "404 Not Found", 404

if __name__ == '__main__':
    app.logger.info(f"Starting Flask server. Static folder: {app.static_folder}")
    app.logger.info(f"Current working directory: {os.getcwd()}")
    app.logger.info(f"Files in static folder: {os.listdir(app.static_folder)}")
    print("Flask server is starting on port 3000...")
    app.run(host='0.0.0.0', port=3000, debug=True)
