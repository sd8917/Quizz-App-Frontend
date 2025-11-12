import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                mr: 3,
              }}
            >
              A
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                admin
              </Typography>
              <Typography variant="body1" color="text.secondary">
                admin@example.com
              </Typography>
              <Divider sx={{ mt: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Admin
              </Typography>
            </Box>
            <Button variant="outlined" startIcon={<Edit />}>
              Edit Profile
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Total Quizzes Taken"
                secondary="4"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Highest Score"
                secondary="1800 pts"
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Joined" secondary="October 26, 2024" />
            </ListItem>
          </List>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Profile;
