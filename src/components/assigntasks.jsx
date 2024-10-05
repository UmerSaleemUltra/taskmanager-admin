import React, { useEffect, useState } from 'react';
import { db } from '../Config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'; // Import dayjs for date manipulation

const YourComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Pending'); // Status field
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const items = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(items);
        setFilteredUsers(items); // Initialize filtered users
      } catch (error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedUser || !task.trim()) {
      alert('Please select a user and enter a valid task');
      return;
    }

    try {
      const userRef = doc(db, 'users', selectedUser);
      await updateDoc(userRef, {
        task: task.trim(),
        status, // Adding status field
      });

      // Update the local state for the user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser
            ? { ...user, task: task.trim(), status }
            : user
        )
      );

      alert('Task assigned successfully!');
      resetForm();
    } catch (error) {
      console.error('Error assigning task: ', error);
    }
  };

  const handleCompleteTask = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        task: '', // Clear the task field
        status: 'Completed', // Set status to Completed
      });

      // Update the local state to remove the completed task
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, task: '', status: 'Completed' } : user
        )
      );

      alert('Task marked as complete successfully!');
    } catch (error) {
      console.error('Error completing task: ', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.names.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const resetForm = () => {
    setTask(''); // Reset task input
    setStatus('Pending'); // Reset status
    setSelectedUser(''); // Reset selected user
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md">
        <Box my={4}>
          <Paper elevation={3} sx={{ padding: '20px' }}>
            <form onSubmit={handleAssignTask}>
              <Box mb={3}>
                <Typography variant="h6">Select User:</Typography>
                <Select
                  fullWidth
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  displayEmpty
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="">
                    <em>-- Select a User --</em>
                  </MenuItem>
                  {filteredUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.names} {/* Adjusted to match Firestore field */}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Task:</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter a task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </Box>

              <Box mb={3}>
                <Typography variant="h6">Status:</Typography>
                <Select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </Box>

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Assign Task
              </Button>
            </form>
          </Paper>

          <Box mt={5}>
            <Typography variant="h5" gutterBottom>
              User List
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Users"
              value={searchTerm}
              onChange={handleSearch}
              sx={{ mb: 2 }}
            />

            <List>
              {filteredUsers.map((user) => (
                <ListItem key={user.id} component={Paper} elevation={1} sx={{ mb: 2 }}>
                  <ListItemText
                    primary={`Name: ${user.names}`}
                    secondary={
                      user.status === 'Completed'
                        ? 'Task Completed' // Indicate that the task is completed
                        : `Task: ${user.task || 'No task assigned'} - Status: ${user.status || 'N/A'}`
                    }
                  />
                  {user.task && user.status !== 'Completed' && ( // Only show the complete button if there's a task
                    <Button onClick={() => handleCompleteTask(user.id)} color="success" size="small">
                      Complete
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default YourComponent;
