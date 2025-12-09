import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Container, Paper, Typography, Button } from '@mui/material';
import { Lock } from '@mui/icons-material';

// Creator-only Protected Route Component
const CreatorRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is a creator or admin
  const userRole = user?.role?.toLowerCase() || user?.roles?.[0]?.toLowerCase() || '';
  const isCreator = userRole === 'creator' || userRole === 'admin';

  if (!isCreator) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Lock
              sx={{
                fontSize: 80,
                color: '#ef4444',
                mb: 3,
              }}
            />
            <Typography variant="h4" gutterBottom fontWeight={700} color="text.primary">
              Creator Access Only
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              This page is exclusively available for creator accounts. Upgrade your account to access
              advanced AI-powered features and tools.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => window.location.href = '/dashboard'}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/contact'}
                sx={{
                  borderColor: '#6366f1',
                  color: '#6366f1',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(99, 102, 241, 0.04)',
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return children;
};

export default CreatorRoute;
