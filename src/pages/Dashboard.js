import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout,
  Settings,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/login');
  };

  const stats = [
    { title: 'Total Quizzes Taken', value: '4', color: '#6366f1', icon: <QuizIcon /> },
    { title: 'Highest Score', value: '1800', color: '#10b981', icon: <LeaderboardIcon /> },
    { title: 'Average Score', value: '1500', color: '#ec4899', icon: <DashboardIcon /> },
    { title: 'Rank', value: '#3', color: '#f59e0b', icon: <PersonIcon /> },
  ];

  const quizzes = [
    {
      title: 'General Knowledge',
      questions: 10,
      difficulty: 'Easy',
      status: 'Available',
    },
    {
      title: 'React Basics',
      questions: 15,
      difficulty: 'Medium',
      status: 'Available',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Triviaverse
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
              <PersonIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/quiz-management'); }}>
              <Settings sx={{ mr: 1 }} /> Quiz Management
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/leaderboard'); }}>
              <LeaderboardIcon sx={{ mr: 1 }} /> Leaderboard
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/user-management'); }}>
              <PersonIcon sx={{ mr: 1 }} /> User Management
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Welcome back, Admin! 👋
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Available Quizzes
        </Typography>

        <Grid container spacing={3}>
          {quizzes.map((quiz, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={`${quiz.questions} Questions`} size="small" />
                    <Chip
                      label={quiz.difficulty}
                      size="small"
                      color={
                        quiz.difficulty === 'Easy'
                          ? 'success'
                          : quiz.difficulty === 'Medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Test your knowledge and improve your skills
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained">
                    Start Quiz
                  </Button>
                  <Button size="small">View Details</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate('/leaderboard')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <LeaderboardIcon />
                  </Avatar>
                  <Typography variant="h6">Leaderboard</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Check your rank and compete with other players
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate('/user-management')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h6">User Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Manage users, roles, and permissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate('/quiz-management')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <QuizIcon />
                  </Avatar>
                  <Typography variant="h6">Quiz Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Create and manage quiz questions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Dashboard;
