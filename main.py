from flask import Flask, send_from_directory, abort, request
from flask_cors import CORS
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static/react', static_url_path='/static')
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    logger.debug(f'Requested path: {path}')
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        logger.debug(f'Serving index.html for path: {path}')
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    logger.debug(f'Serving asset: {filename}')
    return send_from_directory(os.path.join(app.static_folder, 'assets'), filename)

if __name__ == '__main__':
    logger.info(f'Static folder: {app.static_folder}')
    logger.info(f'Contents of static folder: {os.listdir(app.static_folder)}')
    logger.info(f'Contents of assets folder: {os.listdir(os.path.join(app.static_folder, "assets"))}')
    app.run(host='0.0.0.0', port=5000, debug=True)
