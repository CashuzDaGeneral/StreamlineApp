// Main application logic

document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
    setupComponentLibrary();
    setupAIAssistant();
    setupProjectManagement();
    setupCodeGeneration();
    setupOptimization();
    setupVersionControl();
    setupCollaboration();
});

function initializeDragAndDrop() {
    interact('.component')
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: {
                move: dragMoveListener,
                end: function (event) {
                    var target = event.target;
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    updateComponentPosition(target.id, x, y);
                }
            }
        });
}

function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function setupComponentLibrary() {
    const componentLibrary = document.querySelector('.component-library');
    if (!componentLibrary) return;

    const components = [
        { type: 'button', label: 'Button' },
        { type: 'input', label: 'Input' },
        { type: 'image', label: 'Image' },
        { type: 'text', label: 'Text' },
        { type: 'container', label: 'Container' }
    ];

    components.forEach(component => {
        const element = document.createElement('div');
        element.className = 'component-item';
        element.draggable = true;
        element.textContent = component.label;
        element.dataset.type = component.type;

        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', component.type);
        });

        componentLibrary.appendChild(element);
    });
}

function setupAIAssistant() {
    const aiSuggestButton = document.getElementById('ai-suggest');
    if (!aiSuggestButton) return;

    aiSuggestButton.addEventListener('click', () => {
        const userDescription = prompt('Describe the component you need:');
        if (userDescription) {
            fetch('/api/suggest_component', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: userDescription }),
            })
            .then(response => response.json())
            .then(data => {
                const suggestions = data.suggestions.map(s => s.type).join(', ');
                const detailedRecommendations = data.detailed_recommendations;
                alert(`AI Suggestions:\n${suggestions}\n\nDetailed Recommendations:\n${detailedRecommendations}`);
            })
            .catch(error => console.error('Error:', error));
        }
    });
}

function setupProjectManagement() {
    const createProjectButton = document.getElementById('create-project');
    if (!createProjectButton) return;

    createProjectButton.addEventListener('click', () => {
        const projectName = prompt('Enter project name:');
        if (projectName) {
            fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: projectName }),
            })
            .then(response => response.json())
            .then(project => {
                alert(`Project "${project.name}" created successfully!`);
                location.reload();
            })
            .catch(error => console.error('Error:', error));
        }
    });
}

function updateComponentPosition(componentId, x, y) {
    fetch(`/api/components/${componentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position_x: x, position_y: y }),
    })
    .then(response => response.json())
    .then(data => console.log('Component position updated'))
    .catch(error => console.error('Error:', error));
}

function setupCodeGeneration() {
    const generateCodeButton = document.getElementById('generate-code');
    if (!generateCodeButton) return;

    generateCodeButton.addEventListener('click', () => {
        const components = getComponentsFromCanvas();
        fetch('/api/generate_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ components: components }),
        })
        .then(response => response.json())
        .then(data => {
            const generatedCode = data.generated_code;
            displayGeneratedCode(generatedCode);
        })
        .catch(error => console.error('Error:', error));
    });
}

function setupOptimization() {
    const optimizeButton = document.getElementById('optimize-components');
    if (!optimizeButton) return;

    optimizeButton.addEventListener('click', () => {
        const components = getComponentsFromCanvas();
        fetch('/api/optimize_components', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ components: components }),
        })
        .then(response => response.json())
        .then(data => {
            const optimizationSuggestions = data.optimization_suggestions;
            displayOptimizationSuggestions(optimizationSuggestions);
        })
        .catch(error => console.error('Error:', error));
    });
}

function getComponentsFromCanvas() {
    return [
        { type: 'button', properties: { label: 'Click me' } },
        { type: 'input', properties: { placeholder: 'Enter text' } },
        { type: 'text', properties: { content: 'Hello, World!' } }
    ];
}

function displayGeneratedCode(generatedCode) {
    const codeDisplay = document.getElementById('generated-code-display');
    if (codeDisplay) {
        codeDisplay.textContent = generatedCode;
        codeDisplay.style.display = 'block';
    } else {
        alert('Generated Code:\n\n' + generatedCode);
    }
}

function displayOptimizationSuggestions(suggestions) {
    const suggestionsDisplay = document.getElementById('optimization-suggestions-display');
    if (suggestionsDisplay) {
        suggestionsDisplay.textContent = suggestions;
        suggestionsDisplay.style.display = 'block';
    } else {
        alert('Optimization Suggestions:\n\n' + suggestions);
    }
}

function setupVersionControl() {
    const createVersionButton = document.getElementById('create-version');
    const viewVersionsButton = document.getElementById('view-versions');

    if (createVersionButton) {
        createVersionButton.addEventListener('click', createVersion);
    }

    if (viewVersionsButton) {
        viewVersionsButton.addEventListener('click', viewVersions);
    }
}

function createVersion() {
    const versionNumber = prompt('Enter version number:');
    if (versionNumber) {
        const projectId = getProjectId();
        fetch(`/api/projects/${projectId}/versions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ version_number: versionNumber }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Version created successfully');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function viewVersions() {
    const projectId = getProjectId();
    fetch(`/api/projects/${projectId}/versions`)
        .then(response => response.json())
        .then(versions => {
            const versionsModal = document.getElementById('versions-modal');
            const versionsList = document.getElementById('versions-list');
            versionsList.innerHTML = '';
            versions.forEach(version => {
                const li = document.createElement('li');
                li.textContent = `Version ${version.version_number} (${new Date(version.created_at).toLocaleString()})`;
                versionsList.appendChild(li);
            });
            versionsModal.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

function setupCollaboration() {
    const addCollaboratorButton = document.getElementById('add-collaborator');
    if (addCollaboratorButton) {
        addCollaboratorButton.addEventListener('click', addCollaborator);
    }
}

function addCollaborator() {
    const collaboratorUsername = prompt('Enter collaborator username:');
    if (collaboratorUsername) {
        const projectId = getProjectId();
        fetch(`/api/projects/${projectId}/collaborators`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: collaboratorUsername }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('Collaborator added successfully');
                updateCollaboratorsList();
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function updateCollaboratorsList() {
    const projectId = getProjectId();
    fetch(`/api/projects/${projectId}/collaborators`)
        .then(response => response.json())
        .then(collaborators => {
            const collaboratorsList = document.getElementById('collaborators-list');
            collaboratorsList.innerHTML = '';
            collaborators.forEach(collaborator => {
                const li = document.createElement('li');
                li.textContent = collaborator.username;
                collaboratorsList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}

function getProjectId() {
    return document.querySelector('.editor-container').dataset.projectId;
}