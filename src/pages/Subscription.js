import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
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
  Close,
  CreditCard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';

const Subscription = () => {
  useSEO('subscription');
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Subscription plans
  const plans = [
    {
      id: 'basic',
      name: 'AI Basic',
      price: '$9.99',
      period: 'month',
      popular: false,
      features: [
        'AI-Generated Quiz Questions (50/month)',
        'Basic Content Suggestions',
        'Auto-grading with AI insights',
        'Email Support',
        'Access to AI Templates',
      ],
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'pro',
      name: 'AI Pro',
      price: '$24.99',
      period: 'month',
      popular: true,
      features: [
        'AI-Generated Quiz Questions (Unlimited)',
        'Advanced Content Recommendations',
        'AI-Powered Analytics Dashboard',
        'Smart Quiz Optimization',
        'Priority Support',
        'Custom AI Model Training',
        'Bulk Quiz Generation',
        'Multi-language AI Support',
      ],
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'enterprise',
      name: 'AI Enterprise',
      price: '$99.99',
      period: 'month',
      popular: false,
      features: [
        'Everything in Pro',
        'Dedicated AI Model',
        'White-label Solutions',
        'API Access',
        '24/7 Premium Support',
        'Custom Integrations',
        'Advanced Security Features',
        'Team Collaboration Tools',
        'On-premise Deployment Option',
      ],
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
  ];

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

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setPaymentError('');
    setOpenPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentError('');
    setSelectedPlan(null);
  };

  const handleSubscribe = async () => {
    setPaymentLoading(true);
    setPaymentError('');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentError('Payment processing is currently in demo mode. Feature coming soon!');
    }, 2000);
  };

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
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
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
                      background: plan.color,
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
                      {plan.price}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                      /{plan.period}
                    </Typography>
                  </Box>

                  <List sx={{ mb: 3, flexGrow: 1 }}>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
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

                  <Button
                    variant={plan.popular ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    onClick={() => handleSelectPlan(plan)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 700,
                      ...(plan.popular && {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        },
                      }),
                    }}
                  >
                    Start Free Trial
                  </Button>
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

      {/* Payment Modal */}
      <Dialog
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CreditCard />
            Subscribe to {selectedPlan?.name}
          </Box>
          <IconButton onClick={handleClosePaymentModal} sx={{ color: 'white' }} disabled={paymentLoading}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 3 }}>
          {paymentError && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {paymentError}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: '#f8fafc',
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Selected Plan
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {selectedPlan?.name}
            </Typography>
            <Typography variant="h6" color="primary" fontWeight={700}>
              {selectedPlan?.price}/{selectedPlan?.period}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              First 14 days free, cancel anytime
            </Typography>
          </Paper>

          <TextField
            fullWidth
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            margin="normal"
            disabled={paymentLoading}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                placeholder="MM/YY"
                disabled={paymentLoading}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                placeholder="123"
                disabled={paymentLoading}
                InputProps={{
                  sx: { borderRadius: 2 },
                }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Cardholder Name"
            placeholder="John Doe"
            margin="normal"
            disabled={paymentLoading}
            sx={{ mt: 2 }}
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            🔒 Your payment information is encrypted and secure
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClosePaymentModal} disabled={paymentLoading} sx={{ borderRadius: 2, px: 3 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubscribe}
            variant="contained"
            disabled={paymentLoading}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: 2,
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
            }}
          >
            {paymentLoading ? 'Processing...' : `Subscribe for ${selectedPlan?.price}`}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default Subscription;
