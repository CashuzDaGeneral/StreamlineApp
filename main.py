from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_login import LoginManager, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from config import Config
from models import db, User, Project, Component
from auth import auth_bp
from projects import projects_bp
from ai_assistant import ai_bp
import os

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

app.register_blueprint(auth_bp)
app.register_blueprint(projects_bp)
app.register_blueprint(ai_bp)

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
    return render_template('dashboard.html', projects=projects)

@app.route('/editor/<int:project_id>')
@login_required
def editor(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    components = Component.query.filter_by(project_id=project_id).all()
    return render_template('editor.html', project=project, components=components)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
