import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  AutoAwesome,
  Psychology,
  Speed,
  Lightbulb,
  TrendingUp,
  Support,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import CheckoutButton from '../components/CheckoutButton';
import apiClient from '../services/api';

const Subscription = () => {
  useSEO('subscription');
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get('/pricing');
        if (response.data?.success || response.data?.data) {
          setPlans(response.data.data || response.data);
        }
      } catch (error) {
        console.error('Failed to fetch pricing plans:', error);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // AI Features showcase
  const aiFeatures = [
    {
      icon: <Psychology />,
      title: 'AI Question Generation',
      description: 'Generate high-quality quiz questions instantly using advanced AI models trained on millions of educational datasets.',
    },
    {
      icon: <Lightbulb />,
      title: 'Smart Content Suggestions',
      description: 'Get intelligent recommendations for quiz topics, difficulty levels, and question types based on your audience.',
    },
    {
      icon: <TrendingUp />,
      title: 'Performance Analytics',
      description: 'Leverage AI-powered insights to understand learner patterns and optimize your quiz content for better engagement.',
    },
    {
      icon: <Speed />,
      title: 'Rapid Quiz Creation',
      description: 'Create comprehensive quizzes in minutes, not hours. AI handles the heavy lifting while you focus on creativity.',
    },
    {
      icon: <AutoAwesome />,
      title: 'Auto-grading & Feedback',
      description: 'Intelligent grading system with personalized feedback suggestions to enhance the learning experience.',
    },
    {
      icon: <Support />,
      title: 'Adaptive Learning Paths',
      description: 'AI analyzes performance data to create personalized learning pathways for each participant.',
    },
  ];

  const hasActiveSubscription = user?.isPremium && new Date(user?.premiumExpiresAt) > new Date();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            AI Features Subscription
          </Typography>
          <Chip
            label={`Logged in as ${user?.username || 'Creator'}`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Chip
              icon={<AutoAwesome />}
              label="AI-Powered Quiz Creation"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                mb: 3,
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            />
            <Typography variant="h2" gutterBottom fontWeight={800} sx={{ mb: 2 }}>
              Supercharge Your Quiz Creation with AI
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 700, mx: 'auto', mb: 4, opacity: 0.95 }}>
              Unlock powerful AI features to create engaging quizzes faster, analyze performance deeper,
              and deliver better learning experiences.
            </Typography>
          </Box>
        </Container>

        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(60px)',
          }}
        />
      </Box>

      {/* AI Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} gutterBottom sx={{ mb: 6 }}>
          AI Features at Your Fingertips
        </Typography>

        <Grid container spacing={4}>
          {aiFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: '1px solid #e5e7eb',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                    borderColor: '#6366f1',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: 32, color: 'white' },
                    })}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider sx={{ my: 6 }} />

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Choose Your AI Plan
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
          Select the perfect plan for your needs. All plans include a 14-day free trial with full access to features.
        </Typography>

        <Grid container spacing={4} alignItems="stretch">
          {plansLoading ? (
            <Grid item xs={12}>
              <Typography textAlign="center">Loading plans...</Typography>
            </Grid>
          ) : plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan._id || index}>
              <Card
                elevation={plan.popular ? 8 : 0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: plan.popular ? '2px solid #6366f1' : '1px solid #e5e7eb',
                  borderRadius: 4,
                  position: 'relative',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: plan.popular ? '0 20px 60px rgba(99,102,241,0.3)' : '0 12px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  />
                )}

                <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      background: plan.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 32, color: 'white' }} />
                  </Box>

                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {plan.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h3" fontWeight={800}>
                      ₹{plan.priceInr}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                      /{plan.durationDays} days
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {plan.description}
                  </Typography>

                  <List sx={{ mb: 3, flexGrow: 1 }}>
                    {plan.features?.map((feature, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {hasActiveSubscription ? (
                    <Button disabled fullWidth variant="contained" size="large" sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}>
                      Active Subscription
                    </Button>
                  ) : (
                    <CheckoutButton
                      amount={plan.priceInr}
                      planId={plan._id}
                      buttonText="Start Free Trial"
                      fullWidth
                      size="large"
                      variant={plan.popular ? 'contained' : 'outlined'}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 700,
                        ...(plan.popular && {
                          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                          },
                        }),
                      }}
                      onSuccess={() => {
                        alert('Subscription activated successfully!');
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ/Info Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            border: '1px solid rgba(102,126,234,0.2)',
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                💳 Flexible Payment Options
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Pay monthly or save with annual billing. All major credit cards accepted. Cancel anytime with no hidden fees.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                🔒 Secure & Private
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Your data is encrypted and secure. We never share your information with third parties. GDPR compliant.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                🎯 14-Day Free Trial
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try any plan risk-free for 14 days. No credit card required. Full access to all features during trial.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                📞 24/7 Support
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our support team is always here to help. Priority support for Pro and Enterprise customers.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>


      <Footer />
    </Box>
  );
};

export default Subscription;
