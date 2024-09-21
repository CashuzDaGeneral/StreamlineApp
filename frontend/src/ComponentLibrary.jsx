import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ComponentLibrary = () => {
  const [components, setComponents] = useState([]);
  const [customComponentName, setCustomComponentName] = useState('');
  const [customComponentProperties, setCustomComponentProperties] = useState('');

  useEffect(() => {
    fetchComponentLibrary();
  }, []);

  const fetchComponentLibrary = async () => {
    try {
      const response = await fetch('/api/component_library');
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      } else {
        console.error('Failed to fetch component library');
      }
    } catch (error) {
      console.error('Error fetching component library:', error);
    }
  };

  const handleCreateCustomComponent = async () => {
    try {
      const response = await fetch('/api/custom_component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customComponentName,
          properties: customComponentProperties.split(',').map(prop => prop.trim()),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Custom component "${data.name}" created successfully!`);
        setCustomComponentName('');
        setCustomComponentProperties('');
        fetchComponentLibrary();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating custom component:', error);
      alert('An error occurred while creating the custom component.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Component Library</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {components.map((component, index) => (
            <motion.div
              key={component.type}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-2">{component.label}</h2>
              <p className="text-gray-600 mb-4">Type: {component.type}</p>
              <h3 className="font-medium mb-2">Properties:</h3>
              <ul className="list-disc list-inside text-sm text-gray-500">
                {component.properties.map((prop, i) => (
                  <li key={i}>{prop}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Create Custom Component</h2>
          <input
            type="text"
            placeholder="Component Name"
            className="w-full p-2 mb-4 border rounded"
            value={customComponentName}
            onChange={(e) => setCustomComponentName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Properties (comma-separated)"
            className="w-full p-2 mb-4 border rounded"
            value={customComponentProperties}
            onChange={(e) => setCustomComponentProperties(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleCreateCustomComponent}
          >
            Create Custom Component
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
