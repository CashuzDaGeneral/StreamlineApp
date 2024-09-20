from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    projects = db.relationship('Project', backref='author', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(256))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    components = db.relationship('Component', backref='project', lazy='dynamic')

class Component(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(32), nullable=False)
    properties = db.Column(db.JSON)
    position_x = db.Column(db.Float)
    position_y = db.Column(db.Float)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
