from flask import Flask, render_template, jsonify, request, redirect, url_for
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

app = Flask(__name__)
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
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    projects = Project.query.filter_by(user_id=current_user.id).all()
    collaborating_projects = current_user.collaborating_projects
    return render_template('dashboard.html', projects=projects, collaborating_projects=collaborating_projects)

@app.route('/editor/<int:project_id>')
@login_required
def editor(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id and current_user not in project.collaborators:
        return jsonify({'error': 'Unauthorized'}), 403
    components = Component.query.filter_by(project_id=project_id).all()
    return render_template('editor.html', project=project, components=components)

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

@app.route('/api/custom_component', methods=['POST'])
@login_required
def create_custom_component():
    data = request.json
    name = data.get('name')
    properties = data.get('properties', [])
    
    if not name:
        return jsonify({'error': 'Component name is required'}), 400
    
    # Create a new custom component
    custom_component = Component(
        type='custom',
        properties={
            'name': name,
            'custom_properties': properties
        },
        project_id=None  # This will be set when the component is added to a project
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
    app.run(host='0.0.0.0', port=5000, debug=True)
