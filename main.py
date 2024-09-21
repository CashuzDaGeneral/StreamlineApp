from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static/react')
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    print(f"Requested path: {path}")
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        print(f"Serving file: {app.static_folder}/{path}")
        return send_from_directory(app.static_folder, path)
    else:
        print(f"Serving index.html")
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print(f"Static folder path: {app.static_folder}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Contents of static folder:")
    for root, dirs, files in os.walk(app.static_folder):
        level = root.replace(app.static_folder, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print(f"{subindent}{f}")
    app.run(host='0.0.0.0', port=8080, debug=True)
