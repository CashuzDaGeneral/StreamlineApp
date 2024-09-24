from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import db, Project, ProjectVersion, Component, VersionComponent, User
from sqlalchemy.exc import IntegrityError

collaboration_bp = Blueprint('collaboration', __name__)

@collaboration_bp.route('/api/projects/<int:project_id>/versions', methods=['POST'])
@login_required
def create_version(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id and current_user not in project.collaborators:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    version_number = data.get('version_number')
    
    if not version_number:
        return jsonify({'error': 'Version number is required'}), 400

    new_version = ProjectVersion(version_number=version_number, project_id=project_id)
    db.session.add(new_version)

    # Copy current components to the new version
    for component in project.components:
        version_component = VersionComponent(
            type=component.type,
            properties=component.properties,
            position_x=component.position_x,
            position_y=component.position_y,
            project_version_id=new_version.id
        )
        db.session.add(version_component)

    try:
        db.session.commit()
        return jsonify({'message': 'Version created successfully', 'version_id': new_version.id}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Version number already exists'}), 400

@collaboration_bp.route('/api/projects/<int:project_id>/versions', methods=['GET'])
@login_required
def get_versions(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id and current_user not in project.collaborators:
        return jsonify({'error': 'Unauthorized'}), 403

    versions = ProjectVersion.query.filter_by(project_id=project_id).order_by(ProjectVersion.created_at.desc()).all()
    return jsonify([{'id': v.id, 'version_number': v.version_number, 'created_at': v.created_at} for v in versions])

@collaboration_bp.route('/api/projects/<int:project_id>/collaborators', methods=['POST'])
@login_required
def add_collaborator(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    collaborator_username = data.get('username')
    
    if not collaborator_username:
        return jsonify({'error': 'Username is required'}), 400

    collaborator = User.query.filter_by(username=collaborator_username).first()
    if not collaborator:
        return jsonify({'error': 'User not found'}), 404

    if collaborator in project.collaborators:
        return jsonify({'error': 'User is already a collaborator'}), 400

    project.collaborators.append(collaborator)
    db.session.commit()
    return jsonify({'message': 'Collaborator added successfully'}), 201

@collaboration_bp.route('/api/projects/<int:project_id>/collaborators', methods=['GET'])
@login_required
def get_collaborators(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id and current_user not in project.collaborators:
        return jsonify({'error': 'Unauthorized'}), 403

    collaborators = [{'id': user.id, 'username': user.username} for user in project.collaborators]
    return jsonify(collaborators)

@collaboration_bp.route('/api/projects/<int:project_id>/collaborators/<int:user_id>', methods=['DELETE'])
@login_required
def remove_collaborator(project_id, user_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    collaborator = User.query.get_or_404(user_id)
    if collaborator not in project.collaborators:
        return jsonify({'error': 'User is not a collaborator'}), 400

    project.collaborators.remove(collaborator)
    db.session.commit()
    return jsonify({'message': 'Collaborator removed successfully'}), 200