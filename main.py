from flask import Flask, render_template, jsonify, request, redirect, url_for, send_from_directory
from flask_login import LoginManager, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from models import db, User, Project, Component, ProjectVersion, VersionComponent
from auth import auth_bp
from projects import projects_bp
from ai_assistant import ai_bp
from collaboration import collaboration_bp
import os

app = Flask(__name__, static_folder='static')
app.config.from_object(Config)
CORS(app)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

app.register_blueprint(auth_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(collaboration_bp)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return send_from_directory(app.static_folder + '/react', 'index.html')

@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/react/' + path):
        return send_from_directory(app.static_folder + '/react', path)
    else:
        return send_from_directory(app.static_folder + '/react', 'index.html')

@app.route('/api/dashboard')
@login_required
def dashboard():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    collaborating_projects = current_user.collaborating_projects
    return jsonify({
        'projects': [{'id': p.id, 'name': p.name, 'description': p.description} for p in projects],
        'collaborating_projects': [{'id': p.id, 'name': p.name, 'description': p.description} for p in collaborating_projects]
    })

@app.route('/api/editor/<int:project_id>')
@login_required
def editor(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id and current_user not in project.collaborators:
        return jsonify({'error': 'Unauthorized'}), 403
    components = Component.query.filter_by(project_id=project_id).all()
    return jsonify({
        'project': {'id': project.id, 'name': project.name, 'description': project.description},
        'components': [{'id': c.id, 'type': c.type, 'properties': c.properties, 'position_x': c.position_x, 'position_y': c.position_y} for c in components]
    })

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({"success": True, "user_id": user.id}), 200
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/api/projects', methods=['GET'])
@login_required
def api_projects():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    collaborating_projects = current_user.collaborating_projects
    return jsonify([
        {"id": p.id, "name": p.name, "description": p.description, "is_owner": p.user_id == current_user.id}
        for p in projects + collaborating_projects
    ])

@app.route('/api/component_library', methods=['GET'])
@login_required
def get_component_library():
    components = [
        {"type": "button", "label": "Button", "properties": ["text", "color", "size"]},
        {"type": "input", "label": "Input", "properties": ["placeholder", "type", "required"]},
        {"type": "image", "label": "Image", "properties": ["src", "alt", "width", "height"]},
        {"type": "text", "label": "Text", "properties": ["content", "fontSize", "color"]},
        {"type": "container", "label": "Container", "properties": ["width", "height", "backgroundColor"]},
        {"type": "card", "label": "Card", "properties": ["title", "content", "image"]},
        {"type": "list", "label": "List", "properties": ["items", "ordered", "style"]},
        {"type": "table", "label": "Table", "properties": ["headers", "rows", "striped"]},
        {"type": "chart", "label": "Chart", "properties": ["type", "data", "options"]},
        {"type": "form", "label": "Form", "properties": ["fields", "submitText", "onSubmit"]},
        {"type": "navigation", "label": "Navigation", "properties": ["items", "orientation", "activeItem"]},
        {"type": "modal", "label": "Modal", "properties": ["title", "content", "isOpen", "onClose"]},
        {"type": "accordion", "label": "Accordion", "properties": ["items", "multiExpand", "defaultExpanded"]},
        {"type": "tabs", "label": "Tabs", "properties": ["items", "activeTab", "orientation"]},
        {"type": "carousel", "label": "Carousel", "properties": ["items", "autoPlay", "interval"]},
    ]
    return jsonify(components)

@app.route('/api/custom_component', methods=['POST'])
@login_required
def create_custom_component():
    data = request.json
    name = data.get('name')
    properties = data.get('properties', [])
    
    if not name:
        return jsonify({'error': 'Component name is required'}), 400
    
    custom_component = Component(
        type='custom',
        properties={
            'name': name,
            'custom_properties': properties
        },
        project_id=None
    )
    
    db.session.add(custom_component)
    db.session.commit()
    
    return jsonify({
        'id': custom_component.id,
        'name': name,
        'properties': properties
    }), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=8080, debug=True)
