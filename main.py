from flask import Flask, send_from_directory, abort, request, jsonify, redirect, url_for
from flask_cors import CORS
import os
import logging

# Initialize logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__, static_folder='static/react', static_url_path='/static')
CORS(app)

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors and log them."""
    logger.error(f"404 Error: {e}, Path: {request.path}")
    return jsonify({"error": "Not Found"}), 404

# URL route for accessing the front end home page
def index():
    return redirect(url_for('serve', path=''))
app.add_url_rule('/', 'index', index)

@app.route('/<path:path>')
def serve(path):
    """
    Serve the React app or static files depending on the request path.
    If the file exists, serve it; otherwise, serve index.html to allow React Router to handle routing.
    """
    logger.debug(f'Requested path: {path}')
    
    # Serve the index.html for all paths except for known static files
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        logger.debug(f"Serving static file: {path}")
        return send_from_directory(app.static_folder, path)
    else:
        # Fallback to React index.html for all unknown routes (React Router SPA)
        logger.debug(f'Serving index.html for React routing: {path}')
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """
    Serve files from the assets directory.
    """
    asset_folder = os.path.join(app.static_folder, 'assets')
    file_path = os.path.join(asset_folder, filename)

    # Check if asset exists
    if os.path.exists(file_path):
        logger.debug(f'Serving asset: {filename}')
        return send_from_directory(asset_folder, filename)
    else:
        logger.error(f'Asset not found: {filename}')
        return abort(404, description="Resource not found")

if __name__ == '__main__':
    # Log available files on startup for better debugging
    if os.path.exists(app.static_folder):
        logger.info(f'Static folder contents: {os.listdir(app.static_folder)}')
    
    asset_path = os.path.join(app.static_folder, 'assets')
    if os.path.exists(asset_path):
        logger.info(f'Assets folder contents: {os.listdir(asset_path)}')
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)