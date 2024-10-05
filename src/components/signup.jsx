// src/components/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/Firebase';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error on new attempt
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optionally handle success or redirect
      navigate('/login'); // Redirect to tasks page or wherever you want
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message); // Set error message for display
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
        Sign Up
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <form onSubmit={handleSignup}>
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
          {loading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
      </form>
    </Box>
  );
};

export default Signup;
