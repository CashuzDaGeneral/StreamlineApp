from flask import Blueprint, jsonify, request
from flask_login import login_required
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

ai_bp = Blueprint('ai', __name__)

# Simple component library for suggestions
component_library = [
    {'type': 'button', 'description': 'A clickable button element'},
    {'type': 'input', 'description': 'An input field for user text entry'},
    {'type': 'image', 'description': 'An image display element'},
    {'type': 'text', 'description': 'A text display element'},
    {'type': 'container', 'description': 'A container to group other elements'},
]

vectorizer = TfidfVectorizer()
component_descriptions = [comp['description'] for comp in component_library]
component_vectors = vectorizer.fit_transform(component_descriptions)

@ai_bp.route('/api/suggest_component', methods=['POST'])
@login_required
def suggest_component():
    data = request.json
    user_description = data.get('description', '')
    
    user_vector = vectorizer.transform([user_description])
    similarities = cosine_similarity(user_vector, component_vectors)
    
    top_indices = np.argsort(similarities[0])[::-1][:3]  # Get top 3 suggestions
    suggestions = [component_library[i] for i in top_indices]
    
    return jsonify(suggestions)
