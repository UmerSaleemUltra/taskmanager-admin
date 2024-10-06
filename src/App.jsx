import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';  // Note the corrected spelling of "Componenets"
import Signup from './components/signup';
import YourComponent from './components/assigntasks';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={<YourComponent />} /> {/* Direct access to UserTasks */}
      </Routes>
    </Router>
  );
};

export default App;
