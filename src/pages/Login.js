import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, setAuthenticated, updateUser } from '../store/slices/authSlice';
import { BASE_URL } from '../services/api';
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  // Listen for messages from Google OAuth popup
  React.useEffect(() => {
    const handleMessage = (event) => {
      // Skip messages without a type or that aren't from our OAuth flow
      if (!event.data?.type) {
        // Silently ignore messages without type (MetaMask, webpack, etc)
        return;
      }
      
      // Only handle Google OAuth messages
      if (event.data.type !== 'GOOGLE_LOGIN_SUCCESS' && event.data.type !== 'GOOGLE_LOGIN_ERROR') {
        // Silently ignore other types
        return;
      }
      // Handle success
      if (event.data?.type === 'GOOGLE_LOGIN_SUCCESS') {
        const { accessToken, refreshToken, user } = event.data;
        
        if (!accessToken || !refreshToken || !user) {
          setAlertMessage({ 
            type: 'error', 
            text: 'Authentication failed: Invalid token data' 
          });
          return;
        }
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Update Redux state
        dispatch(setAuthenticated(true));
        dispatch(updateUser(user));
  
        setAlertMessage({ type: 'success', text: 'Google login successful! Redirecting to dashboard...' });
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } 
      // Handle error
      else if (event.data?.type === 'GOOGLE_LOGIN_ERROR') {
        const errorMsg = event.data.error || 'Google authentication failed';
        console.error('❌ Google login error:', errorMsg);
        setAlertMessage({ 
          type: 'error', 
          text: errorMsg
        });
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, dispatch]);

  // Fallback: Check localStorage for tokens (in case postMessage doesn't work or backend fails)
  React.useEffect(() => {

    const checkTokens = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      
      if (token && user && !isAuthenticated) {

        try {
          const userData = JSON.parse(user);
          
          // Update Redux state
          dispatch(setAuthenticated(true));
          dispatch(updateUser(userData));
   
          setAlertMessage({ type: 'success', text: 'Google login successful! Redirecting to dashboard...' });
          
          // Navigate to dashboard
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
          
          // Clear interval since we found tokens
          clearInterval(checkTokens);
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
        }
      }
    }, 200); // Check every 200ms for faster detection

    return () => {
      clearInterval(checkTokens);
    };
  }, [isAuthenticated, navigate, dispatch]);

  // Check for session expiry
  React.useEffect(() => {
    const sessionExpired = searchParams.get('session');
    if (sessionExpired === 'expired') {
      setAlertMessage({ 
        type: 'warning', 
        text: 'Your session has expired. Please login again.' 
      });
    }
  }, [searchParams]);

  // Clear Redux errors when component unmounts
  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: '',
        };
      }
      return prev;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(null);

    // Validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      })).unwrap();;
      
      setAlertMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      
      const from = location.state?.from?.pathname;
      
      let redirectPath = '/dashboard'; // Default to dashboard
      if (from && from !== '/login' && from !== '/register') {
        redirectPath = from; // Use previous location if available
      }
      
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setAlertMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // Use backend API URL - for development it's localhost:8000
    const backendUrl = BASE_URL;
    const googleAuthUrl = `${backendUrl}/auth/google`;

    const popup = window.open(
      googleAuthUrl,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.error('❌ Popup blocked by browser');
      setAlertMessage({ 
        type: 'error', 
        text: 'Popup blocked! Please allow popups for this site.' 
      });
    } else {
      setAlertMessage({ 
        type: 'info', 
        text: 'Complete the Google sign-in in the popup window...' 
      });
      
      // Monitor popup - close it after 5 minutes if still open
      // This helps catch cases where backend fails to redirect
      const popupMonitor = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupMonitor);
        }
      }, 1000);
      
      setTimeout(() => {
        if (!popup.closed) {
          console.warn('⚠️ Popup still open after 5 minutes, closing...');
          popup.close();
          clearInterval(popupMonitor);
          setAlertMessage({
            type: 'warning',
            text: 'Google sign-in popup closed (timeout). Please try again.'
          });
        }
      }, 5 * 60 * 1000);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.4,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', py: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={0} sx={{ minHeight: '600px' }}>
          {/* Left Side - Login Form */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper
              elevation={20}
              sx={{
                p: { xs: 4, md: 5 },
                width: '100%',
                maxWidth: 500,
                mx: 'auto',
                borderRadius: { xs: 3, md: '24px 0 0 24px' },
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              {/* Logo/Title */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to continue your learning journey
                </Typography>
              </Box>

              {/* Alert Message */}
              {alertMessage && (
                <Alert severity={alertMessage.type} sx={{ mb: 3 }}>
                  {alertMessage.text}
                </Alert>
              )}

              {/* Login Form */}
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  sx={{ mb: 2.5 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ textAlign: 'right', mb: 3 }}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    sx={{ 
                      textDecoration: 'none',
                      fontWeight: 600,
                      color: '#667eea',
                      '&:hover': { color: '#764ba2' }
                    }}
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mb: 2.5,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>

                <Divider sx={{ my: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderColor: '#ddd',
                    color: '#555',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: '#999',
                      backgroundColor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Continue with Google
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      href="#"
                      sx={{ 
                        textDecoration: 'none', 
                        fontWeight: 700,
                        color: '#667eea',
                        '&:hover': { color: '#764ba2' }
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>

              {/* Demo Credentials */}
              {/* <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#f0f9ff',
                  borderRadius: 2,
                  border: '1px solid #bae6fd',
                }}
              >
                <Typography variant="caption" sx={{ color: '#0369a1', display: 'block', fontWeight: 600 }}>
                  Demo Credentials:
                </Typography>
                <Typography variant="caption" sx={{ color: '#0369a1', display: 'block' }}>
                  Email: admin@example.com
                </Typography>
                <Typography variant="caption" sx={{ color: '#0369a1' }}>
                  Password: admin123
                </Typography>
              </Box> */}
            </Paper>
          </Grid>

          {/* Right Side - Image */}
          <Grid 
            item 
            xs={12} 
            md={6} 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Paper
              elevation={20}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 600,
                borderRadius: '0 24px 24px 0',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <Box
                role="img"
                aria-label="Students collaborating and learning together"
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.2,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                    TriviaVerse
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, opacity: 0.95, maxWidth: 400, mx: 'auto' }}>
                    Master any topic with interactive quizzes and compete with millions worldwide
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>1M+</Typography>
                      <Typography variant="body2">Active Users</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>50K+</Typography>
                      <Typography variant="body2">Quizzes</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>98%</Typography>
                      <Typography variant="body2">Satisfaction</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
