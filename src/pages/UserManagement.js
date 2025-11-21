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
} from '@mui/material';
import {
  ArrowBack,
  Search,
  MoreVert,
  Add,
  Edit,
  Delete,
  Block,
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
import { getRoleColor, getStatusColor } from '../utils/helpers';

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

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
          if (isMounted) {
            setError('Failed to load users.');
          }
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
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogType('');
    setEditFormData({ username: '', email: '', role: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
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
      setError('Failed to update user role');
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }

  if(error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': { bgcolor: 'grey.100' },
            }}
            onClick={() => handleDialogOpen('add')}
          >
            Add User
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Stats Cards */}
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
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main User Table */}
        <Paper sx={{ p: 3 }}>
          {/* Header with Search */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              All Users
            </Typography>
            <TextField
              size="small"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
          </Box>

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="All Users" />
            <Tab label="Active" />
            <Tab label="Suspended" />
          </Tabs>

          {/* Users Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Role
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Status
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Quizzes
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Score
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Last Active
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredByTab().map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              user.role === 'Admin'
                                ? 'error.main'
                                : user.role === 'Creator'
                                ? 'warning.main'
                                : 'primary.main',
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
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
                        {user.lastActive}
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

      {/* Edit/Add User Dialog */}
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
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select label="Role" defaultValue="User">
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Creator">Creator</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogClose}>
            Add User
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
            Are you sure you want to {selectedUser?.status === 'Active' ? 'suspend' : 'activate'} user "{selectedUser?.username}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            color={selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'warning' : 'success'}
            onClick={handleDialogClose}
            sx={{color: "white"}}
          >
            {selectedUser?.isActive === true && selectedUser?.isActive !== "N/A" ? 'Suspend' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </Box>
  );
};

export default UserManagement;
