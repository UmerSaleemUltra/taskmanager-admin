// src/components/Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/firebase';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Store login state for 14 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 14);
      localStorage.setItem('expiry', expiryDate);
      navigate('/'); // Redirect to tasks page
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 4,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: '#f9f9f9',
        mt: 5
      }}
    >
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Login
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={loading} // Disable button when loading
        >
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </form>
    </Box>
  );
};

export default Login;
