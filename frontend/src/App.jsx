import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './StreamlineAppHomepage';
import Login from './Login';
import ComponentLibrary from './ComponentLibrary';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userId) => {
    setUser({ id: userId });
  };

  useEffect(() => {
    // Check for user in local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    // Save user to local storage
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
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