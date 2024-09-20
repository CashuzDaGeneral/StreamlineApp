// Real-time preview functionality

let previewEventSource;

function initializePreview(projectId) {
    const previewContainer = document.querySelector('.preview');
    if (!previewContainer) return;

    previewEventSource = new EventSource(`/api/projects/${projectId}/preview`);

    previewEventSource.onmessage = function(event) {
        const previewData = JSON.parse(event.data);
        updatePreview(previewData);
    };

    previewEventSource.onerror = function(error) {
        console.error('EventSource failed:', error);
        previewEventSource.close();
    };
}

function updatePreview(previewData) {
    const previewContainer = document.querySelector('.preview');
    previewContainer.innerHTML = '';

    previewData.components.forEach(component => {
        const componentElement = createComponentElement(component);
        previewContainer.appendChild(componentElement);
    });
}

function createComponentElement(component) {
    const element = document.createElement('div');
    element.className = `preview-component preview-${component.type}`;
    element.style.position = 'absolute';
    element.style.left = `${component.position_x}px`;
    element.style.top = `${component.position_y}px`;

    switch (component.type) {
        case 'button':
            element.innerHTML = `<button>${component.properties.label || 'Button'}</button>`;
            break;
        case 'input':
            element.innerHTML = `<input type="text" placeholder="${component.properties.placeholder || ''}">`;
            break;
        case 'image':
            element.innerHTML = `<img src="${component.properties.src || ''}" alt="${component.properties.alt || ''}">`;
            break;
        case 'text':
            element.innerHTML = `<p>${component.properties.content || 'Text'}</p>`;
            break;
        case 'container':
            element.innerHTML = `<div class="preview-container"></div>`;
            break;
    }

    return element;
}

function closePreview() {
    if (previewEventSource) {
        previewEventSource.close();
    }
}

// Call this function when leaving the editor page
document.addEventListener('beforeunload', closePreview);
