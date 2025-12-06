import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = React.useState(true);

  useEffect(() => {

    // Get all tokens and user data from URL
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const _id = searchParams.get('_id');
    const username = searchParams.get('username');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    // If NO tokens and NO error, backend didn't redirect properly
    if (!accessToken && !refreshToken && !error) {
      console.error('❌ CRITICAL: Backend redirected without tokens!');
      console.error('   Expected URL: http://localhost:3000/auth/google/callback?accessToken=...&refreshToken=...');
      console.error('   Actual URL:', window.location.href);
      
      // Check localStorage as fallback (backend might have set them there)
      const savedToken = localStorage.getItem('accessToken');
      const savedRefresh = localStorage.getItem('refreshToken');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedRefresh && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(
              { 
                type: 'GOOGLE_LOGIN_SUCCESS',
                accessToken: savedToken,
                refreshToken: savedRefresh,
                user: userData
              },
              '*'
            );
          }
        } catch (e) {
          console.error('Error parsing saved user:', e);
        }
      } else {
        console.error('❌ No tokens found in localStorage either - authentication incomplete');
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { 
              type: 'GOOGLE_LOGIN_ERROR', 
              error: 'Backend did not return authentication tokens. Please check backend logs.' 
            },
            '*'
          );
        }
      }
      
      // Close after 3 seconds
      setTimeout(() => {
        setIsProcessing(false);
        window.close();
      }, 3000);
      return;
    }

    if (error) {
      console.error('❌ Google auth error:', error);
      // Send error to parent window
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage(
            { 
              type: 'GOOGLE_LOGIN_ERROR', 
              error: error 
            },
            '*'
          );
        } catch (e) {
          console.error('❌ postMessage error:', e);
        }
        setTimeout(() => {
          setIsProcessing(false);
          window.close();
        }, 2000);
      }
      return;
    }

    if (!accessToken || !refreshToken) {
      console.error('❌ Missing tokens - accessToken:', !!accessToken, 'refreshToken:', !!refreshToken);
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage(
            { 
              type: 'GOOGLE_LOGIN_ERROR', 
              error: 'Missing authentication tokens' 
            },
            '*'
          );
        } catch (e) {
          console.error('❌ postMessage error:', e);
        }
        setTimeout(() => {
          setIsProcessing(false);
          window.close();
        }, 2000);
      }
      return;
    }

    // Save to localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const userData = {
      _id,
      username,
      email,
      role
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    // Check if this is a popup window
    if (window.opener && !window.opener.closed) {

      try {
        const payload = { 
          type: 'GOOGLE_LOGIN_SUCCESS',
          accessToken,
          refreshToken,
          user: userData
        };
        
        window.opener.postMessage(payload, '*');
      } catch (e) {
        console.error('❌ postMessage failed:', e);
      }
      
      window.close();

      // Close popup after delay to ensure message is received
      setTimeout(() => {
        setIsProcessing(false);
        window.close();
      }, 1000);
    } else {
      setIsProcessing(false);
    }
    
    // Safety timeout - close popup after 10 seconds if nothing happened
    const safetyTimeout = setTimeout(() => {
      console.warn('⚠️ Popup safety timeout reached - closing window');
      setIsProcessing(false);
      window.close();
    }, 1000);
    
    return () => clearTimeout(safetyTimeout);
  }, [searchParams]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Box
        sx={{
          background: 'white',
          borderRadius: 2,
          p: 4,
          maxWidth: 400,
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2, color: '#667eea' }} />
        <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 1 }}>
          {isProcessing ? 'Completing sign in...' : 'Sign in completed'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
          {isProcessing 
            ? 'This window will close automatically' 
            : 'You can close this window now'}
        </Typography>
        
        {!isProcessing && (
          <Button
            variant="contained"
            fullWidth
            onClick={() => window.close()}
            sx={{ mt: 2, background: '#667eea' }}
          >
            Close Window
          </Button>
        )}
        
        {isProcessing && (
          <Button
            variant="outlined"
            fullWidth
            onClick={() => window.close()}
            sx={{ mt: 2 }}
          >
            Close Manually
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default GoogleCallback;
