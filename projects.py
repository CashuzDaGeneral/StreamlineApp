from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from models import db, Project, Component

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('/api/projects', methods=['GET', 'POST'])
@login_required
def projects():
    if request.method == 'GET':
        user_projects = Project.query.filter_by(user_id=current_user.id).all()
        return jsonify([{'id': p.id, 'name': p.name, 'description': p.description} for p in user_projects])
    elif request.method == 'POST':
        data = request.json
        new_project = Project(name=data['name'], description=data.get('description', ''), user_id=current_user.id)
        db.session.add(new_project)
        db.session.commit()
        return jsonify({'id': new_project.id, 'name': new_project.name, 'description': new_project.description}), 201

@projects_bp.route('/api/projects/<int:project_id>', methods=['GET', 'PUT', 'DELETE'])
@login_required
def project(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        components = Component.query.filter_by(project_id=project_id).all()
        return jsonify({
            'id': project.id,
            'name': project.name,
            'description': project.description,
            'components': [{'id': c.id, 'type': c.type, 'properties': c.properties, 'position_x': c.position_x, 'position_y': c.position_y} for c in components]
        })
    elif request.method == 'PUT':
        data = request.json
        project.name = data.get('name', project.name)
        project.description = data.get('description', project.description)
        db.session.commit()
        return jsonify({'id': project.id, 'name': project.name, 'description': project.description})
    elif request.method == 'DELETE':
        db.session.delete(project)
        db.session.commit()
        return '', 204

@projects_bp.route('/api/projects/<int:project_id>/components', methods=['POST'])
@login_required
def add_component(project_id):
    project = Project.query.get_or_404(project_id)
    if project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.json
    new_component = Component(
        type=data['type'],
        properties=data.get('properties', {}),
        position_x=data.get('position_x', 0),
        position_y=data.get('position_y', 0),
        project_id=project_id
    )
    db.session.add(new_component)
    db.session.commit()
    return jsonify({
        'id': new_component.id,
        'type': new_component.type,
        'properties': new_component.properties,
        'position_x': new_component.position_x,
        'position_y': new_component.position_y
    }), 201

@projects_bp.route('/api/components/<int:component_id>', methods=['PUT', 'DELETE'])
@login_required
def update_delete_component(component_id):
    component = Component.query.get_or_404(component_id)
    if component.project.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'PUT':
        data = request.json
        component.type = data.get('type', component.type)
        component.properties = data.get('properties', component.properties)
        component.position_x = data.get('position_x', component.position_x)
        component.position_y = data.get('position_y', component.position_y)
        db.session.commit()
        return jsonify({
            'id': component.id,
            'type': component.type,
            'properties': component.properties,
            'position_x': component.position_x,
            'position_y': component.position_y
        })
    elif request.method == 'DELETE':
        db.session.delete(component)
        db.session.commit()
        return '', 204
