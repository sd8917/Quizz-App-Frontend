import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Paper,
  Rating,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';
import { GradientBackground, GradientButton, SectionHeader } from '../components/UI';
import { faqs, features, services, stats, steps, testimonials } from '../utils/constant';

const LandingPage = () => {
  useSEO('home');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedFaq, setExpandedFaq] = useState(false);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  return (
    <>
      {/* Hero Section */}
      <GradientBackground
        minHeight={{ xs: 'auto', md: '80vh' }}
        padding={{ xs: '20px 16px', sm: '30px 24px', md: '50px' }}
        sx={{ 
          paddingTop: { xs: '20px', md: '0px' },
          alignItems: 'center' 
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white' }}>
                <Chip
                  label="🎉 Join 1M+ Users Worldwide"
                  sx={{
                    bgcolor: alpha('#ffffff', 0.2),
                    color: 'white',
                    mb: 3,
                    mt: 3,
                    backdropFilter: 'blur(10px)',
                    fontWeight: 500,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '2.5rem', lg: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 3,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Master Any Topic 
                  <Box component="span" sx={{ display: 'block', color: '#fbbf24' }}>
                   with  Interactive Quizzes
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    opacity: 0.95,
                    lineHeight: 1.6,
                  }}
                >
                  Test your knowledge, track your progress, and compete with millions of learners worldwide. 
                  Start your journey to excellence today!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <GradientButton
                    size="large"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/register')}
                    // bgcolor="white"
                    // color="#667eea"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                    }}
                  >
                    Get Started Free
                  </GradientButton>
                 {!isAuthenticated && <GradientButton
                    size="large"
                    onClick={() => navigate('/login')}
                     bgcolor="white"
                    color="#667eea"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: alpha('#ffffff', 0.1),
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Sign In
                  </GradientButton>}
                </Box>
                <Box sx={{ display: 'flex', gap: 4, mt: 5, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      1M+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Users
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      50K+
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Quizzes
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      98%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Satisfaction
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: -20,
                    bottom: -20,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    borderRadius: 4,
                    opacity: 0.2,
                    transform: 'rotate(-3deg)',
                  },
                }}
              >
                <Paper
                  elevation={24}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    transform: 'rotate(2deg)',
                    transition: 'transform 0.3s',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    '&:hover': {
                      transform: 'rotate(0deg) scale(1.02)',
                    },
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop"
                    alt="Students learning with interactive quizzes on TriviaVerse"
                    fetchpriority="high"
                    width="400"
                    height="400"
                    style={{ width: '100%', display: 'block' }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </GradientBackground>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="FEATURES"
            chipColor="primary"
            title="Why Choose TriviaVerse?"
            subtitle="Everything you need to create, take, and master quizzes in one powerful platform"
          />
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: alpha(feature.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
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
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="HOW IT WORKS"
            chipColor="secondary"
            title="Get Started in 5 Simple Steps"
            subtitle="Join millions of users and start your learning journey today"
          />
          <Box sx={{ position: 'relative' }}>
            {steps.map((step, index) => (
              <Box key={index} sx={{ mb: 6 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={6} order={{ xs: 2, md: index % 2 === 0 ? 1 : 2 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(step.color, 0.1)} 0%, ${alpha(step.color, 0.05)} 100%)`,
                        border: `2px solid ${alpha(step.color, 0.2)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography
                          variant="h2"
                          sx={{
                            fontWeight: 800,
                            color: step.color,
                            mr: 2,
                            fontSize: '3rem',
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: step.color,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {step.icon}
                        </Box>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6} order={{ xs: 1, md: index % 2 === 0 ? 2 : 1 }}>
                    <Box
                      sx={{
                        textAlign: index % 2 === 0 ? 'right' : 'left',
                        px: 2,
                      }}
                    >
                      <img
                        src={`https://images.unsplash.com/photo-${
                          index === 0 ? '1488190211105-8b0e65b80b4e' :
                          index === 1 ? '1516321318423-f06f85e504b3' :
                          index === 2 ? '1434030216411-0b793f4b4173' :
                          index === 3 ? '1460925895917-afdab827c52f' :
                          '1762427354251-f008b64dbc32'
                        }?w=400&h=200&fit=crop`}
                        alt={step.title}
                        loading="lazy"
                        width="400"
                        height="220"
                        style={{
                          width: '100%',
                          maxWidth: 400,
                          borderRadius: 16,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 10, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="OUR SERVICES"
            chipColor="primary"
            chipSx={{ bgcolor: '#10b981', color: 'white' }}
            title="Perfect for Every Need"
            subtitle="Whether you're a student, professional, or just curious, we've got you covered"
          />
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: 12,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mt: -5,
                        boxShadow: 3,
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {service.description}
                    </Typography>
                    <Button
                      endIcon={<ArrowIcon />}
                      sx={{ fontWeight: 600 }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      fontSize: 48,
                      mb: 2,
                      opacity: 0.9,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="TESTIMONIALS"
            chipColor="primary"
            chipSx={{ bgcolor: '#ec4899', color: 'white' }}
            title="What Our Users Say"
            subtitle="Join thousands of satisfied learners"
          />
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 8,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 60, height: 60, mr: 2 }}
                      alt='Profile avatar'
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    "{testimonial.comment}"
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <VerifiedIcon color="primary" fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                      Verified User
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="FAQ"
            chipColor="primary"
            title="Frequently Asked Questions"
            subtitle="Got questions? We've got answers!"
            sx={{ mb: 6 }}
          />
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `panel${index}`}
              onChange={handleFaqChange(`panel${index}`)}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 1,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* CTA Section */}
      <GradientBackground
        sx={{
          py: 10,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 3 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.95 }}>
            Join over 1 million users and start your learning journey today. 
            It's free, fun, and takes less than a minute!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <GradientButton
              size="large"
              endIcon={<ArrowIcon />}
              onClick={() => navigate('/register')}
              bgcolor="white"
              color="#667eea"
              sx={{
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                fontWeight: 700,
              }}
            >
              Start Free Now
            </GradientButton>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 2,
                px: 5,
                fontSize: '1.2rem',
                fontWeight: 700,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha('#ffffff', 0.1),
                  borderWidth: 2,
                },
              }}
            >
              Learn More
            </Button>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon />
              <Typography>No Credit Card Required</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon />
              <Typography>Free Forever</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon />
              <Typography>Cancel Anytime</Typography>
            </Box>
          </Box>
        </Container>
      </GradientBackground>

      <Footer />
    </>
  );
};

export default LandingPage;
