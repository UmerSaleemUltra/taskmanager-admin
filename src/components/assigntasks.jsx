import React, { useEffect, useState } from 'react';
import { db } from '../Config/firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
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

const YourComponent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // State for editing

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(items);
      setFilteredUsers(items);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
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
        status,
      });

      alert('Task assigned successfully!');
      resetForm();
    } catch (error) {
      console.error('Error assigning task: ', error);
    }
  };

  const handleEditTask = (user) => {
    // Set the editing user and fill form
    setEditingUser(user);
    setSelectedUser(user.id);
    setTask(user.task);
    setStatus(user.status);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!selectedUser || !task.trim()) {
      alert('Please select a user and enter a valid task');
      return;
    }

    try {
      const userRef = doc(db, 'users', selectedUser);
      await updateDoc(userRef, {
        task: task.trim(),
        status,
      });

      alert('Task updated successfully!');
      resetForm();
      setEditingUser(null); // Reset editing user
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDeleteTask = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          task: '', // Clear the task
          status: 'Deleted' // Optionally mark as deleted
        });

        alert('Task deleted successfully!');
      } catch (error) {
        console.error('Error deleting task: ', error);
      }
    }
  };

  const handleCompleteTask = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        task: '',
        status: 'Completed',
      });

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
    setTask('');
    setStatus('Pending');
    setSelectedUser('');
    setEditingUser(null); // Reset editing user
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
            <form onSubmit={editingUser ? handleUpdateTask : handleAssignTask}>
              <Box mb={3}>
                <Typography variant="h6">{editingUser ? 'Edit Task' : 'Select User:'}</Typography>
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
                      {user.names}
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
                {editingUser ? 'Update Task' : 'Assign Task'}
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
              {filteredUsers
                .filter(user => user.status !== 'Deleted') // Filter out deleted tasks
                .map((user) => (
                  // Render only if the task is not completed
                  user.status !== 'Completed' && (
                    <ListItem key={user.id} component={Paper} elevation={1} sx={{ mb: 2 }}>
                      <ListItemText
                        primary={`Name: ${user.names}`}
                        secondary={`Task: ${user.task || 'No task assigned'} - Status: ${user.status || 'N/A'}`}
                      />
                      <Box>
                        <Button onClick={() => handleEditTask(user)} color="primary" size="small">
                          Edit
                        </Button>
                        <Button onClick={() => handleCompleteTask(user.id)} color="success" size="small">
                          Complete
                        </Button>
                        <Button onClick={() => handleDeleteTask(user.id)} color="error" size="small">
                          Delete
                        </Button>
                      </Box>
                    </ListItem>
                  )
                ))}
            </List>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default YourComponent;