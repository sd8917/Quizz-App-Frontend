import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import { ArrowBack, Edit, Email as EmailIcon, CalendarMonth, EmojiEvents, Quiz, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUser } from '../store/slices/authSlice';
import { userService } from '../services';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      // If we already have user data in Redux, use it immediately
      if (authUser && !profile) {
        setProfile(authUser);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await dispatch(fetchUserProfile()).unwrap();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (isMounted) {
          setError('Failed to load profile. Using cached data.');
          // Fallback to Redux user
          if (authUser) {
            setProfile(authUser);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line
  }, [dispatch]); // Only run once on mount

  const displayUser = profile?.data || authUser;

  // Handle modal open
  const handleOpenModal = () => {
    setFormData({
      username: displayUser?.username || '',
      email: displayUser?.email || '',
    });
    setUpdateError('');
    setOpenModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpenModal(false);
    setUpdateError('');
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    // Validation
    if (!formData.username.trim()) {
      setUpdateError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      setUpdateError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setUpdateError('Please enter a valid email');
      return;
    }

    setUpdating(true);
    setUpdateError('');

    try {
      const response = await userService.updateProfile({
        username: formData.username,
        email: formData.email,
      });

      // Update Redux store
      dispatch(updateUser(response.data || response));
      
      // Update local state
      setProfile(response);
      
      // Show success message
      setUpdateSuccess(true);
      
      // Close modal
      handleCloseModal();
    } catch (err) {
      console.error('Profile update error:', err);
      setUpdateError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !displayUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static"
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
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {/* Profile Header Card */}
        <Paper 
          elevation={3}
          sx={{ 
            p: 4, 
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3 }}>
            <Avatar
              src={displayUser?.avatar}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                border: '4px solid white',
              }}
            >
              {displayUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {displayUser?.username || 'User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {displayUser?.email || 'No email'}
                </Typography>
              </Box>
              <Chip 
                label={displayUser?.roles?.[0]?.toUpperCase() || displayUser?.role?.toUpperCase() || 'USER'}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  color: 'white',
                  mt: 1,
                }}
              />
            </Box>
            
            <Button 
              variant="contained" 
              startIcon={<Edit />}
              onClick={handleOpenModal}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                },
                transition: 'all 0.2s',
              }}
            >
              Edit Profile
            </Button>
          </Box>
        </Paper>

        {/* Statistics Section */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Quiz sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                  {displayUser?.quizzesTaken || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Total Quizzes Taken
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 32, color: 'success.main' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
                  {displayUser?.highestScore || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Highest Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card 
              elevation={2}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: 'rgba(236, 72, 153, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 32, color: 'secondary.main' }} />
                </Box>

                <Typography variant="body1" sx={{ fontWeight: 700, mb: 1, color: 'secondary.main' }}>
                  {profile?.timestamp || profile?.data?.createdAt ? new Date(profile?.timestamp || profile?.data?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Member Since
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Profile Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
        }}>
          Edit Profile
          <IconButton 
            onClick={handleCloseModal}
            sx={{ color: 'white' }}
            disabled={updating}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 3 }}>
          {updateError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updateError}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            margin="normal"
            disabled={updating}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            disabled={true}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 }
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Note: Changing your email may require verification
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseModal}
            disabled={updating}
            sx={{ 
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            variant="contained"
            disabled={updating}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
            }}
          >
            {updating ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={updateSuccess}
        autoHideDuration={4000}
        onClose={() => setUpdateSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setUpdateSuccess(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default Profile;
