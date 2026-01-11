import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Fade,
  Grow,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Policy,
  Email,
  AccessTime,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import GradientBackground from '../components/UI/GradientBackground';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';
import AppBarNav from '../components/UI/AppBarNav';

const Refund = () => {
  useSEO('refund-policy');

  const [policyVisible, setPolicyVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    // Sequence the animations
    const timer1 = setTimeout(() => setPolicyVisible(true), 100);
    const timer2 = setTimeout(() => setEmailVisible(true), 500);
    const timer3 = setTimeout(() => setDetailsVisible(true), 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const refundPolicy = [
    {
      icon: <AccessTime />,
      title: 'Processing Time',
      description: 'All refunds are processed within 7 business days from the date of approval.',
    },
    {
      icon: <CheckCircle />,
      title: 'Eligibility',
      description: 'Refunds are available for subscriptions canceled within 30 days of purchase.',
    },
    {
      icon: <Email />,
      title: 'Notification',
      description: 'You will receive an email confirmation once your refund has been processed.',
    },
    {
      icon: <Info />,
      title: 'Method',
      description: 'Refunds are credited back to the original payment method used.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBarNav title={"Refund policy"} />
      <GradientBackground
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
        minHeight="100vh"
      >

        
        <Container maxWidth="lg">

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip
              icon={<Policy />}
              label="Refund Policy"
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                mb: 3,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              We've our refund policy to better serve our users. Please review the details below.
            </Typography>
          </Box>

          {/* Animated Content */}
          <Grow in={policyVisible} timeout={1000}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mx: 'auto',
                maxWidth: 800,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Policy Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: '#6366f1',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    }}
                  >
                    <Policy sx={{ fontSize: 40, color: 'white' }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>
                    Our Refund Policy
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 600, mx: 'auto' }}>
                    We want you to be completely satisfied with your purchase. Here's what you need to know about our refund process.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Policy Details */}
                <List sx={{ mb: 4 }}>
                  {refundPolicy.map((item, index) => (
                    <Fade in={detailsVisible} timeout={1000 + index * 200} key={index}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemIcon sx={{ minWidth: 50 }}>
                          <Avatar
                            sx={{
                              bgcolor: '#e0e7ff',
                              color: '#6366f1',
                              width: 40,
                              height: 40,
                            }}
                          >
                            {item.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151' }}>
                              {item.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
                              {item.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Fade>
                  ))}
                </List>

                <Divider sx={{ my: 3 }} />

                {/* User Email Display */}
                <Fade in={emailVisible} timeout={1000}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                      Your Account Email registered
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <Email sx={{ mr: 1, color: '#6366f1' }} />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#1f2937',
                          fontFamily: 'monospace',
                          bgcolor: '#f3f4f6',
                          py: 1,
                          px: 2,
                          borderRadius: 2,
                          display: 'inline-block',
                        }}
                      >
                        {'user@example.com'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      This email will be used for all refund communications and confirmations.
                    </Typography>
                  </Box>
                </Fade>
              </CardContent>
            </Card>
          </Grow>

          {/* Additional Info */}
          <Fade in={detailsVisible} timeout={1000}>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 600, mx: 'auto' }}>
                If you have any questions about our refund policy or need assistance with a refund request,
                please contact our support team. We're here to help!
              </Typography>
            </Box>
          </Fade>
        </Container>
      </GradientBackground>
      <Footer />
    </Box>
  );
};

export default Refund;
