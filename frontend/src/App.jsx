import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StreamlineAppHomepage from './StreamlineAppHomepage';
import Login from './Login';
import ComponentLibrary from './ComponentLibrary';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userId) => {
    setUser({ id: userId });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StreamlineAppHomepage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={user ? <div>Dashboard (TODO: Implement dashboard)</div> : <Navigate to="/login" />}
          />
          <Route
            path="/component-library"
            element={user ? <ComponentLibrary /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
