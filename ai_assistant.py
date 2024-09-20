from flask import Blueprint, jsonify, request
from flask_login import login_required
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import openai
import os

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

# Set up OpenAI API key
openai.api_key = os.environ.get('OPENAI_API_KEY')

@ai_bp.route('/api/suggest_component', methods=['POST'])
@login_required
def suggest_component():
    data = request.json
    user_description = data.get('description', '')
    
    user_vector = vectorizer.transform([user_description])
    similarities = cosine_similarity(user_vector, component_vectors)
    
    top_indices = np.argsort(similarities[0])[::-1][:3]  # Get top 3 suggestions
    suggestions = [component_library[i] for i in top_indices]
    
    # Get more detailed suggestions using OpenAI
    detailed_suggestions = get_detailed_suggestions(user_description, suggestions)
    
    return jsonify(detailed_suggestions)

def get_detailed_suggestions(user_description, suggestions):
    prompt = f"User wants to create: {user_description}\n\n"
    prompt += "Suggested components:\n"
    for suggestion in suggestions:
        prompt += f"- {suggestion['type']}: {suggestion['description']}\n"
    prompt += "\nProvide detailed recommendations for each component, including potential properties and styling suggestions."

    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.7,
    )

    return {
        'suggestions': suggestions,
        'detailed_recommendations': response.choices[0].text.strip()
    }

@ai_bp.route('/api/generate_code', methods=['POST'])
@login_required
def generate_code():
    data = request.json
    components = data.get('components', [])
    
    prompt = "Generate HTML and CSS code for the following components:\n\n"
    for component in components:
        prompt += f"- {component['type']}: {component.get('properties', {})}\n"
    prompt += "\nProvide the HTML structure and corresponding CSS styles."

    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=300,
        n=1,
        stop=None,
        temperature=0.7,
    )

    generated_code = response.choices[0].text.strip()
    return jsonify({'generated_code': generated_code})

@ai_bp.route('/api/optimize_components', methods=['POST'])
@login_required
def optimize_components():
    data = request.json
    components = data.get('components', [])
    
    prompt = "Suggest optimizations for the following components:\n\n"
    for component in components:
        prompt += f"- {component['type']}: {component.get('properties', {})}\n"
    prompt += "\nProvide suggestions for improving performance, accessibility, and user experience."

    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.7,
    )

    optimization_suggestions = response.choices[0].text.strip()
    return jsonify({'optimization_suggestions': optimization_suggestions})
