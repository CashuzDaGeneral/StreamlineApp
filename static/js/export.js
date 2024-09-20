// Export functionality

function exportProject(projectId) {
    fetch(`/api/projects/${projectId}/export`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'exported_project.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('export-project');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const projectId = exportButton.dataset.projectId;
            exportProject(projectId);
        });
    }
});
