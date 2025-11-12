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
  LinearProgress,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout,
  Settings,
  TrendingUp,
  People,
  Assessment,
  Create,
  PlayArrow,
  EmojiEvents,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Mock user role - In production, this would come from authentication context
  // Options: 'user', 'creator', 'admin'
  const [userRole, setUserRole] = useState('admin'); // Change this to test different views

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

  // Stats for different roles
  const userStats = [
    { title: 'Quizzes Taken', value: '12', color: '#6366f1', icon: <QuizIcon /> },
    { title: 'Highest Score', value: '1850', color: '#10b981', icon: <EmojiEvents /> },
    { title: 'Average Score', value: '1420', color: '#ec4899', icon: <TrendingUp /> },
    { title: 'Global Rank', value: '#24', color: '#f59e0b', icon: <LeaderboardIcon /> },
  ];

  const creatorStats = [
    { title: 'Quizzes Created', value: '8', color: '#6366f1', icon: <Create /> },
    { title: 'Total Attempts', value: '342', color: '#10b981', icon: <PlayArrow /> },
    { title: 'Avg Rating', value: '4.6', color: '#ec4899', icon: <Assessment /> },
    { title: 'Active Users', value: '156', color: '#f59e0b', icon: <People /> },
  ];

  const adminStats = [
    { title: 'Total Users', value: '1,247', color: '#6366f1', icon: <People /> },
    { title: 'Total Quizzes', value: '156', color: '#10b981', icon: <QuizIcon /> },
    { title: 'Active Today', value: '342', color: '#ec4899', icon: <DashboardIcon /> },
    { title: 'Completion Rate', value: '87%', color: '#f59e0b', icon: <Assessment /> },
  ];

  // Select stats based on role
  const stats = userRole === 'admin' ? adminStats : userRole === 'creator' ? creatorStats : userStats;

  const quizzes = [
    {
      title: 'General Knowledge',
      questions: 10,
      difficulty: 'Easy',
      status: 'Available',
      category: 'Trivia',
      timeLimit: '10 min',
    },
    {
      title: 'React Basics',
      questions: 15,
      difficulty: 'Medium',
      status: 'Available',
      category: 'Programming',
      timeLimit: '15 min',
    },
    {
      title: 'World History',
      questions: 20,
      difficulty: 'Hard',
      status: 'Available',
      category: 'History',
      timeLimit: '20 min',
    },
    {
      title: 'JavaScript Advanced',
      questions: 25,
      difficulty: 'Hard',
      status: 'Available',
      category: 'Programming',
      timeLimit: '30 min',
    },
  ];

  // Recent activity for users
  const recentActivity = [
    { quiz: 'React Basics', score: 1850, date: '2 days ago', status: 'completed' },
    { quiz: 'General Knowledge', score: 1420, date: '5 days ago', status: 'completed' },
    { quiz: 'JavaScript Pro', score: 1650, date: '1 week ago', status: 'completed' },
  ];

  // Creator's quiz performance
  const creatorQuizzes = [
    { title: 'React Basics', attempts: 89, avgScore: 1650, rating: 4.8 },
    { title: 'JavaScript Pro', attempts: 145, avgScore: 1420, rating: 4.5 },
    { title: 'CSS Mastery', attempts: 108, avgScore: 1580, rating: 4.7 },
  ];

  // Get welcome message based on role
  const getWelcomeMessage = () => {
    if (userRole === 'admin') return 'Welcome back, Admin! 👨‍💼';
    if (userRole === 'creator') return 'Welcome back, Creator! 🎨';
    return 'Welcome back, User! 👋';
  };

  const getRoleColor = () => {
    if (userRole === 'admin') return 'error';
    if (userRole === 'creator') return 'warning';
    return 'primary';
  };

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
          <Chip 
            label={userRole.toUpperCase()} 
            size="small" 
            color={getRoleColor()}
            sx={{ mr: 2, fontWeight: 600 }}
          />
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
            {(userRole === 'creator' || userRole === 'admin') && (
              <MenuItem onClick={() => { handleMenuClose(); navigate('/quiz-management'); }}>
                <Settings sx={{ mr: 1 }} /> Quiz Management
              </MenuItem>
            )}
            <MenuItem onClick={() => { handleMenuClose(); navigate('/leaderboard'); }}>
              <LeaderboardIcon sx={{ mr: 1 }} /> Leaderboard
            </MenuItem>
            {userRole === 'admin' && (
              <MenuItem onClick={() => { handleMenuClose(); navigate('/user-management'); }}>
                <PersonIcon sx={{ mr: 1 }} /> User Management
              </MenuItem>
            )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Demo Role Switcher - Remove in production */}
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="info.dark">
              <strong>Demo Mode:</strong> Switch between different user roles to see different dashboard views
            </Typography>
            <ToggleButtonGroup
              value={userRole}
              exclusive
              onChange={(e, newRole) => newRole && setUserRole(newRole)}
              size="small"
            >
              <ToggleButton value="user" color="primary">
                User
              </ToggleButton>
              <ToggleButton value="creator" color="warning">
                Creator
              </ToggleButton>
              <ToggleButton value="admin" color="error">
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {userRole === 'admin' && 'Manage your platform and monitor performance'}
          {userRole === 'creator' && 'Track your quiz performance and create new content'}
          {userRole === 'user' && 'Continue your learning journey and compete with others'}
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

        {/* USER VIEW - Available Quizzes */}
        {userRole === 'user' && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Available Quizzes
            </Typography>
            <Grid container spacing={3}>
              {quizzes.map((quiz, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {quiz.title}
                        </Typography>
                        <Chip label={quiz.category} size="small" variant="outlined" />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip label={`${quiz.questions} Questions`} size="small" icon={<QuizIcon />} />
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
                        <Chip label={quiz.timeLimit} size="small" icon={<Schedule />} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Test your knowledge and compete for the top spot on the leaderboard!
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<PlayArrow />}
                        onClick={() => navigate('/quiz/1')}
                      >
                        Start Quiz
                      </Button>
                      <Button size="small">View Details</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <Grid container spacing={3}>
              {recentActivity.map((activity, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {activity.quiz}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Score
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activity.score} pts
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(activity.score / 2000) * 100} 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {activity.date}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* CREATOR VIEW - Quiz Performance */}
        {userRole === 'creator' && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Your Quiz Performance
            </Typography>
            <Grid container spacing={3}>
              {creatorQuizzes.map((quiz, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {quiz.title}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Attempts
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {quiz.attempts}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Avg Score
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {quiz.avgScore}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Rating
                          </Typography>
                          <Chip 
                            label={`⭐ ${quiz.rating}`} 
                            size="small" 
                            color="warning"
                          />
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Assessment />}>View Analytics</Button>
                      <Button size="small" startIcon={<Settings />}>Edit</Button>
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
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba205 100%)',
                    border: '1px solid #667eea30',
                  }}
                  onClick={() => navigate('/quiz-management')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Create />
                      </Avatar>
                      <Typography variant="h6">Create New Quiz</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Design engaging quizzes for your audience
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
                    background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
                    border: '1px solid #10b98130',
                  }}
                  onClick={() => navigate('/quiz-management')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                        <Assessment />
                      </Avatar>
                      <Typography variant="h6">View Analytics</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Track quiz performance and insights
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
                    background: 'linear-gradient(135deg, #ec489915 0%, #ec489905 100%)',
                    border: '1px solid #ec489930',
                  }}
                  onClick={() => navigate('/leaderboard')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <People />
                      </Avatar>
                      <Typography variant="h6">Community</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      See how users engage with your content
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* ADMIN VIEW - Platform Management */}
        {userRole === 'admin' && (
          <>
            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Available Quizzes
            </Typography>

            <Grid container spacing={3}>
              {quizzes.slice(0, 2).map((quiz, index) => (
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
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => navigate('/quiz/1')}
                      >
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
          </>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Dashboard;
