import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/slices/authSlice';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={displayUser?.avatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                mr: 3,
              }}
            >
              {displayUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {displayUser?.username || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {displayUser?.email || 'No email'}
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {displayUser?.roles?.[0].toUpperCase() || displayUser?.role?.toUpperCase()  || 'User'}
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<Edit />}>
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Total Quizzes Taken"
                secondary={displayUser?.quizzesTaken || 0}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Highest Score"
                secondary={displayUser?.highestScore ? `${displayUser.highestScore} pts` : 'N/A'}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Joined" 
                secondary={profile?.timestamp ? new Date(profile?.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
              />
            </ListItem>
          </List>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
