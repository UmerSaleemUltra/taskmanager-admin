// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AssignTask from './components/assigntasks'; // Admin component
import Login from './components/login';
import Signup from './components/signup';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Task Management System</h1>
       
        <Routes>
          <Route path="/" element={<AssignTask />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
