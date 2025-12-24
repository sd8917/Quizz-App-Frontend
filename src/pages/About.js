import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, EmojiEvents, People, Psychology } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';

const About = () => {
  useSEO('about');
  const navigate = useNavigate();

  const features = [
    {
      icon: <EmojiEvents />,
      title: 'Competitive Learning',
      description:
        'Challenge yourself and compete with learners worldwide on our leaderboard system.',
      color: '#f59e0b',
    },
    {
      icon: <People />,
      title: 'Community Driven',
      description:
        'Join a vibrant community of knowledge seekers and share your expertise.',
      color: '#6366f1',
    },
    {
      icon: <Psychology />,
      title: 'Diverse Topics',
      description:
        'Explore quizzes across various subjects and expand your knowledge horizon.',
      color: '#ec4899',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
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
            About Us
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Hero Section */}
        <Paper
          sx={{
            p: 5,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            About TriviaVerse
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '800px', opacity: 0.95 }}>
            Empowering learners worldwide through interactive quizzes and competitive
            knowledge sharing. Join thousands of users in their journey to continuous
            learning and improvement.
          </Typography>
        </Paper>

        {/* Mission Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Our Mission
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            At TriviaVerse, we believe that learning should be engaging, accessible, and fun.
            Our mission is to create a platform where anyone can test their knowledge,
            learn new things, and compete with others in a friendly and supportive
            environment.
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We strive to make education more interactive by providing a comprehensive
            quiz platform that covers diverse topics and difficulty levels. Whether
            you're a student preparing for exams, a professional looking to upskill, or
            simply someone who loves trivia, TriviaVerse has something for everyone.
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          What Makes Us Special
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`,
                  border: `1px solid ${feature.color}30`,
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: feature.color,
                      width: 56,
                      height: 56,
                      mb: 2,
                    }}
                    alt='Icon avatar'
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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

        {/* Stats Section */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Our Impact
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                  10K+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                  500+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quiz Topics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                  50K+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Questions
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main" sx={{ fontWeight: 700 }}>
                  100K+
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quizzes Taken
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default About;
