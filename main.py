from flask import Flask, send_from_directory, abort, request, jsonify
from flask_cors import CORS
import os
import logging

# Initialize logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='app/static', static_url_path='')
CORS(app)

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors and log them."""
    logger.error(f"404 Error: {e}, Path: {request.path}")
    return jsonify({"error": "Not Found"}), 404

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """
    Serve the React app or static files depending on the request path.
    If the file exists, serve it; otherwise, serve bypass.html to test Flask server routing.
    """
    logger.debug(f'Requested path: {path}')
    
    full_path = os.path.join(app.static_folder, path)
    logger.debug(f'Full path: {full_path}')
    logger.debug(f'File exists: {os.path.exists(full_path)}')
    
    if path != "" and os.path.exists(full_path):
        logger.debug(f"Serving static file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        logger.debug(f'Serving bypass.html for testing: {path}')
        return send_from_directory(app.static_folder, 'bypass.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """
    Serve files from the assets directory.
    """
    asset_folder = os.path.join(app.static_folder, 'assets')
    file_path = os.path.join(asset_folder, filename)

    logger.debug(f'Requested asset: {filename}')
    logger.debug(f'Asset path: {file_path}')
    logger.debug(f'Asset exists: {os.path.exists(file_path)}')

    if os.path.exists(file_path):
        logger.debug(f'Serving asset: {filename}')
        return send_from_directory(asset_folder, filename)
    else:
        logger.error(f'Asset not found: {filename}')
        return abort(404, description="Resource not found")

if __name__ == '__main__':
    # Log available files on startup for better debugging
    logger.info(f"Static folder path: {app.static_folder}")
    if os.path.exists(app.static_folder):
        logger.info(f'Static folder contents: {os.listdir(app.static_folder)}')
    else:
        logger.warning(f'Static folder not found: {app.static_folder}')
    
    asset_path = os.path.join(app.static_folder, 'assets')
    if os.path.exists(asset_path):
        logger.info(f'Assets folder contents: {os.listdir(asset_path)}')
    else:
        logger.warning(f'Assets folder not found: {asset_path}')
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
