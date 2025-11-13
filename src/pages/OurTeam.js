import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const OurTeam = () => {
  const navigate = useNavigate();

  // Sample team members - you can update these later
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: 'https://i.pravatar.cc/150?img=10',
      bio: 'Passionate about revolutionizing online learning',
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      image: 'https://i.pravatar.cc/150?img=5',
      bio: 'Tech enthusiast building scalable platforms',
    },
    {
      name: 'Mike Johnson',
      role: 'Head of Product',
      image: 'https://i.pravatar.cc/150?img=12',
      bio: 'Creating delightful user experiences',
    },
    {
      name: 'Sarah Williams',
      role: 'Lead Designer',
      image: 'https://i.pravatar.cc/150?img=9',
      bio: 'Crafting beautiful and intuitive designs',
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
            <PeopleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Our Team
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Meet the passionate people behind QuizApp
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
            We're working on building an amazing team page to introduce you to the wonderful people behind QuizApp. 
            Stay tuned for updates!
          </Typography>
          <Chip label="Under Development" color="primary" sx={{ fontWeight: 600 }} />
        </Paper>

        {/* Sample Team Grid */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Meet Our Team (Preview)
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {member.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <LinkedInIcon sx={{ color: 'text.secondary', fontSize: 20, cursor: 'pointer' }} />
                    <TwitterIcon sx={{ color: 'text.secondary', fontSize: 20, cursor: 'pointer' }} />
                    <EmailIcon sx={{ color: 'text.secondary', fontSize: 20, cursor: 'pointer' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Want to Join Our Team?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/careers')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            View Open Positions
          </Button>
        </Box>
      </Container>

      <Footer />
    </>
  );
};

export default OurTeam;
