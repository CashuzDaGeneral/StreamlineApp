from flask import Flask, send_from_directory
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
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        app.logger.info(f"Serving file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        app.logger.info(f"File not found, serving index.html for path: {path}")
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.logger.info(f"Starting Flask server. Static folder: {app.static_folder}")
    app.logger.info(f"Current working directory: {os.getcwd()}")
    app.logger.info(f"Files in static folder: {os.listdir(app.static_folder)}")
    app.run(host='0.0.0.0', port=8080, debug=True)
