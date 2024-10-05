// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AssignTask from './components/assigntasks'; // Admin component


const App = () => {
  return (
    <Router>
      <div className="app">
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Task Management System</h1>
       
        <Routes>
          <Route path="/" element={<AssignTask />} />
     ]
        </Routes>
      </div>
    </Router>
  );
};

export default App;
