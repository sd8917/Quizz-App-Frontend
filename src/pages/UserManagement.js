import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  MoreVert,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Person,
  AdminPanelSettings,
  Group,
  SupervisorAccount,
  CheckCircleOutline,
  BlockOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { userService } from '../services';
import { getRoleColor, getStatusColor,getActiveColor } from '../utils/helpers';
import useFetch from '../hooks/useFetch';

const UserManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: '',
  });

  // Add User Form State
  const [addUserFormData, setAddUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [formError, setFormError] = useState('');

  // Use useFetch hook for registering new users
  const { 
    loading: addUserLoading, 
    error: addUserError, 
    execute: registerNewUser 
  } = useFetch(null, { immediate: false });

  const [data, setData] = useState(null);

   useEffect(() => {
      let isMounted = true;
  
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await userService.getAllUsers();  
          if (isMounted && response?.data) {
            // Transform API data to match UI structure
            const transformedUsers = response.data.map((user) => ({
              id: user._id,
              username: user.username || 'N/A',
              email: user.email || 'N/A',
              role: user.roles?.[0] ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : 'N/A',
              isActive: user.isActive || 'N/A',
              quizzesTaken: user.quizzesTaken || 'N/A',
              score: user.score || 'N/A',
              joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A',
              lastActive: user.activeStatus || 'N/A',
              isOnline: user.isOnline || false,
            }));
            setData(transformedUsers);
          }
        } catch (err) {
          console.error('User fetch error:', err);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
  
      fetchUsers();
  
      return () => {
        isMounted = false;
      };
    }, []); // Only run once on mount
   
  const users = data || [];

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: <Group />,
      color: '#6366f1',
    },
    {
      title: 'Active Users',
      value: users.filter((u) => u.isActive === true).length,
      icon: <CheckCircle />,
      color: '#10b981',
    },
    {
      title: 'Admins',
      value: users.filter((u) => u.role === 'Admin').length,
      icon: <AdminPanelSettings />,
      color: '#ec4899',
    },
    {
      title: 'Creators',
      value: users.filter((u) => u.role === 'Creator').length,
      icon: <SupervisorAccount />,
      color: '#f59e0b',
    },
  ];

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedUser(null);
  };

  const handleDialogOpen = (type) => {
    setDialogType(type);
    if (type === 'edit' && selectedUser) {
      setEditFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
    if (type === 'add') {
      // Reset add user form when opening
      setAddUserFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
      setFormError('');
    }
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType('');
    setEditFormData({ username: '', email: '', role: '' });
    setAddUserFormData({ username: '', email: '', password: '', role: 'user' });
    setFormError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add User Form Changes
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setAddUserFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formError) setFormError('');
  };

  // Add User Submit Handler using useFetch
  const handleAddUser = async () => {
    // Validation
    if (!addUserFormData.username || !addUserFormData.email || !addUserFormData.password) {
      setFormError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addUserFormData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (addUserFormData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    try {
      setFormError('');

      // Prepare user data for registration
      const userData = {
        username: addUserFormData.username,
        email: addUserFormData.email,
        password: addUserFormData.password,
        roles: [addUserFormData.role], // Backend expects roles as array
      };

      // Use useFetch's execute method to register the new user
      const result = await registerNewUser('/register', {
        method: 'POST',
        body: userData,
      });

      if (!result && addUserError) {
        // If execute returns null, there was an error
        setFormError(addUserError);
        return;
      }
      
      console.log('User created successfully:', result);

      // Refresh user list after successful addition
      const usersResponse = await userService.getAllUsers();
      if (usersResponse?.data) {
        const transformedUsers = usersResponse.data.map((user) => ({
          id: user._id,
          username: user.username || 'N/A',
          email: user.email || 'N/A',
          role: user.roles?.[0] ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : 'N/A',
          isActive: user.isActive || 'N/A',
          quizzesTaken: user.quizzesTaken || 'N/A',
          score: user.score || 'N/A',
          joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A',
          lastActive: user.activeStatus || 'N/A',
          isOnline: user.isOnline || false,
        }));
        setData(transformedUsers);
      }

      // Close dialog and reset form
      handleDialogClose();
    } catch (err) {
      console.error('Error adding user:', err);
      setFormError(err.message || err.error || 'Failed to create user. Please try again.');
    }
  };

  const handleSaveRole = async () => {
    if (!selectedUser || !editFormData.role) return;

    try {
      setLoading(true);
      await userService.updateUserRole(selectedUser.id, editFormData.role.toLowerCase());
      // Update local state
      setData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, role: editFormData.role }
            : user
        )
      );
      
      handleDialogClose();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      const newStatus = !(selectedUser.isActive === true && selectedUser.isActive !== "N/A");
      
      await userService.updateUserStatus(selectedUser.id, newStatus);
      
      // Update local state
      setData((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, isActive: newStatus }
            : user
        )
      );
      
      handleDialogClose();
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredByTab = () => {
    if (tabValue === 1) return filteredUsers.filter((u) => u.isActive === true);
    if (tabValue === 2) return filteredUsers.filter((u) => (u.isActive === false || u.isActive === 'N/A'));
    
    return filteredUsers;
  };

  
  
    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleDialogOpen('add')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: `${stat.color}20`,
                        color: stat.color,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Users Table */}
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {/* Search and Tabs */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              placeholder="Search users..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, width: { xs: '100%', sm: '400px' } }}
            />
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="All Users" />
              <Tab label="Active" />
              <Tab label="Suspended" />
            </Tabs>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Quizzes</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Last Active</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredByTab().map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: `${stats.find((s) => s.title.includes(user.role))?.color || '#6366f1'}20`,
                            color: stats.find((s) => s.title.includes(user.role))?.color || '#6366f1',
                          }}
                        >
                          {user.username[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {user.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Joined {user.joinedDate}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role)}
                        icon={
                          user.role === 'Admin' ? (
                            <AdminPanelSettings sx={{ fontSize: 16 }} />
                          ) : user.role === 'Creator' ? (
                            <SupervisorAccount sx={{ fontSize: 16 }} />
                          ) : (
                            <Person sx={{ fontSize: 16 }} />
                          )
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.isActive && user.isActive !== "N/A" ? 'Active' : 'Suspended'}
                        size="small"
                        color={getStatusColor(user.isActive)}
                        sx={{color: "white"}}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{user.quizzesTaken}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.score.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="text.secondary">

                          <TableCell align="center">
                          <Chip
                            label={user.lastActive}
                            size="small"
                            color={getActiveColor(user.lastActive)}
                          />
                          </TableCell>

                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* No Results */}
          {getFilteredByTab().length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleDialogOpen('edit')}>
          <Edit sx={{ mr: 1, fontSize: 20 }} /> Update Role
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('suspend')}>
          {selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? (
            <BlockOutlined sx={{ mr: 1, fontSize: 20 }} />
          ) : (
            <CheckCircleOutline sx={{ mr: 1, fontSize: 20 }} />
          )}
          {selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'Suspend' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={() => handleDialogOpen('delete')} disabled={true}>
          <Delete sx={{ mr: 1, fontSize: 20 }} color="error" /> Delete User
        </MenuItem>
      </Menu>

      {/* Edit User Dialog */}
      <Dialog open={openDialog && dialogType === 'edit'} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            value={editFormData.username}
            onChange={handleEditChange}
            sx={{ mb: 2, mt: 1 }}
            disabled={true}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={editFormData.email}
            onChange={handleEditChange}
            sx={{ mb: 2 }}
            disabled={true}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={editFormData.role}
              onChange={handleEditChange}
              label="Role"
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Creator">Creator</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => setOpenConfirmDialog(true)}
            disabled={loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Role Update */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change the role of user "{selectedUser?.username}" to "{editFormData.role}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              await handleSaveRole();
              setOpenConfirmDialog(false);
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openDialog && dialogType === 'add'} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {formError}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            value={addUserFormData.username}
            onChange={handleAddUserChange}
            sx={{ mb: 2, mt: 1 }}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={addUserFormData.email}
            onChange={handleAddUserChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={addUserFormData.password}
            onChange={handleAddUserChange}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 6 characters"
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select 
              name="role"
              label="Role" 
              value={addUserFormData.role}
              onChange={handleAddUserChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="creator">Creator</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={addUserLoading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={addUserLoading}
          >
            {addUserLoading ? <CircularProgress size={20} /> : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog && dialogType === 'delete'} onClose={handleDialogClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.username}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDialogClose}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend/Activate Dialog */}
      <Dialog open={openDialog && dialogType === 'suspend'} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'Suspend' : 'Activate'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'suspend' : 'activate'} user "{selectedUser?.username}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>Cancel</Button>
          <Button
            variant="contained"
            color={selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'warning' : 'success'}
            onClick={handleStatusChange}
            disabled={loading}
            sx={{color: "white"}}
          >
            {loading ? <CircularProgress size={20} sx={{color: 'white'}} /> : (selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'Suspend' : 'Activate')}
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
};

export default UserManagement;
