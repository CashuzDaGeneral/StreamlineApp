from flask import Flask, send_from_directory, abort, request
from flask_cors import CORS
import os
import logging

app = Flask(__name__, static_folder='static/react', static_url_path='')
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route('/api/<path:path>')
def api(path):
    # Handle API routes here
    logger.info(f"API request received: {path}")
    return f"API endpoint: {path}"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logger.info(f"Requested path: {path}")
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        logger.info(f"Serving file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logger.info(f"Serving index.html for path: {path}")
        return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(404)
def not_found(e):
    logger.error(f"404 error: {e}")
    return send_from_directory(app.static_folder, 'index.html')

@app.before_request
def log_request_info():
    logger.debug('Headers: %s', request.headers)
    logger.debug('Body: %s', request.get_data())

if __name__ == '__main__':
    logger.info(f"Starting Flask server. Static folder: {app.static_folder}")
    logger.info(f"Current working directory: {os.getcwd()}")
    logger.info(f"Files in static folder: {os.listdir(app.static_folder)}")
    print("Flask server is starting on port 80...")
    app.run(host='0.0.0.0', port=80, debug=True)
