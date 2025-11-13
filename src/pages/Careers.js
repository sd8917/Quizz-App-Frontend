import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Work as WorkIcon,
  CheckCircle as CheckIcon,
  TrendingUp as GrowthIcon,
  Favorite as HeartIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Careers = () => {
  const navigate = useNavigate();

  const benefits = [
    'Competitive salary and equity',
    'Flexible work hours',
    'Remote work options',
    'Health insurance',
    'Learning and development budget',
    'Unlimited PTO',
    'Modern tech stack',
    'Collaborative environment',
  ];

  const samplePositions = [
    {
      title: 'Senior Full Stack Developer',
      location: 'Remote',
      type: 'Full-time',
      department: 'Engineering',
    },
    {
      title: 'Product Designer',
      location: 'Hybrid',
      type: 'Full-time',
      department: 'Design',
    },
    {
      title: 'Marketing Manager',
      location: 'Remote',
      type: 'Full-time',
      department: 'Marketing',
    },
  ];

  return (
    <>
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Careers at QuizApp
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Join us in revolutionizing online learning
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Coming Soon Notice */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 4,
            mb: 6,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            🚀 Coming Soon!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're building our careers page with exciting opportunities. Check back soon for open positions 
            and to learn more about what it's like to work at QuizApp!
          </Typography>
          <Chip label="Under Development" color="primary" sx={{ fontWeight: 600 }} />
        </Paper>

        {/* Why Join Us */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Why Join QuizApp?
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <GrowthIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Grow Your Career
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Work on challenging projects and expand your skills with the latest technologies
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <HeartIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Make an Impact
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Help millions of learners achieve their goals and transform education
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <AwardIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Great Benefits
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Competitive compensation, flexible work, and amazing perks
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Benefits */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            What We Offer
          </Typography>
          <List>
            {benefits.map((benefit, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={benefit} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Sample Positions */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Open Positions (Preview)
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {samplePositions.map((position, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {position.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={position.location} size="small" />
                      <Chip label={position.type} size="small" color="primary" />
                      <Chip label={position.department} size="small" variant="outlined" />
                    </Box>
                  </Box>
                  <Button variant="contained" disabled>
                    Apply
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Don't see the right position?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Send us your resume at careers@quizapp.com
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ fontWeight: 700 }}
          >
            Contact Us
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default Careers;
