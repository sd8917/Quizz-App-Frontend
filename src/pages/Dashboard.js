import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Quiz as QuizIcon,
  Leaderboard as LeaderboardIcon,
  Person as PersonIcon,
  Logout,
  Settings,
  TrendingUp,
  People,
  Assessment,
  Create,
  PlayArrow,
  EmojiEvents,
  Schedule,
  Terminal,
  AutoAwesome,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, fetchUserProfile } from '../store/slices/authSlice';
import Footer from '../components/Footer';
import useFetch from '../hooks/useFetch';
import { userService } from '../services';
import {getWelcomeMessage } from '../utils/helpers';

const Dashboard = () => {
  useSEO('dashboard');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  
  // Get user role from Redux state
  const userRole = authUser?.data?.roles?.[0] || authUser?.role || 'user';

  // Fetch channels using custom hook
  const { 
    data: channels, 
    loading, 
    error 
  } = useFetch(
    userRole === 'user' ? '/channel' : null,
    { immediate: userRole === 'user' }
  );

  useEffect(() => {
    // Fetch user profile if not already loaded
    if (!authUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, authUser]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login even if logout fails
      navigate('/login', { replace: true });
    }
  };

  // Stats for different roles
  const userStats = [
    { title: 'Available Channels', value: (channels?.length || 0).toString(), color: '#6366f1', icon: <QuizIcon /> },
    { title: 'Quizzes Taken', value: '12', color: '#10b981', icon: <EmojiEvents /> },
    { title: 'Average Score', value: '1420', color: '#ec4899', icon: <TrendingUp /> },
    { title: 'Global Rank', value: '#24', color: '#f59e0b', icon: <LeaderboardIcon /> },
  ];

  const creatorStats = [
    { title: 'Quizzes Created', value: '8', color: '#6366f1', icon: <Create /> },
    { title: 'Total Attempts', value: '342', color: '#10b981', icon: <PlayArrow /> },
    { title: 'Avg Rating', value: '4.6', color: '#ec4899', icon: <Assessment /> },
    { title: 'Active Users', value: '156', color: '#f59e0b', icon: <People /> },
  ];

  // Palette for channel cards (used when channel.color not provided)
  const channelColors = ['#6366f1', '#10b981', '#ec4899', '#f59e0b', '#06b6d4', '#8b5cf6'];

  // Compute admin stat cards from fetched adminStats state
  const adminStatsCards = adminStats
    ? [
        { title: 'Total Users', value: (adminStats.totalUsers ?? 'N/A').toString(), color: '#6366f1', icon: <People /> },
        { title: 'Total Channels', value: (adminStats.totalChannels  ?? '0').toString(), color: '#10b981', icon: <DashboardIcon /> },
        { title: 'Total Quizzes', value: (adminStats.totalQuizzes ?? '0').toString(), color: '#10b981', icon: <QuizIcon /> },
        { title: 'Active Today', value: (adminStats.activeToday ?? 'N/A').toString(), color: '#ec4899', icon: <TrendingUp /> },
        { title: 'Completion Rate', value: typeof adminStats.completionRate === 'number' ? `${adminStats.completionRate}%` : (adminStats.completionRate ?? 'N/A'), color: '#f59e0b', icon: <Assessment /> },
      ]
    : [
        { title: 'Total Users', value: '-', color: '#6366f1', icon: <People /> },
        { title: 'Total Quizzes', value: '-', color: '#10b981', icon: <QuizIcon /> },
        { title: 'Active Today', value: '-', color: '#ec4899', icon: <TrendingUp /> },
        { title: 'Completion Rate', value: '-', color: '#f59e0b', icon: <Assessment /> },
      ];

  // Select stats based on role
  const stats = userRole === 'admin' ? adminStatsCards : userRole === 'creator' ? creatorStats : userStats;

  // Use real channels for user role, dummy data for others
  const quizzes = userRole === 'user' ? (channels || []) : [];

  // Creator's quiz performance
  const creatorQuizzes = [
    { title: 'React Basics', attempts: 89, avgScore: 1650, rating: 4.8 },
    { title: 'JavaScript Pro', attempts: 145, avgScore: 1420, rating: 4.5 },
    { title: 'CSS Mastery', attempts: 108, avgScore: 1580, rating: 4.7 },
  ];

  const getRoleColor = () => {
    if (userRole === 'admin') return 'error';
    if (userRole === 'creator') return 'warning';
    return 'primary';
  };

   const fetchAdminStats = async () => {
    setStatsLoading(true);
    try {
      const data = await userService.getAdminStats();
      setAdminStats(data?.data);
      setStatsError(null);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
      setStatsError(err.message || 'Failed to load admin stats');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAdminStats();
    }
  }, [userRole]);

  if(statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
     {statsError && <Box sx={{ mt: 1, mx: 2 }}>
       <Alert severity="error">{statsError}</Alert>
     </Box> }
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }} onClick={()=> navigate("/")}>
            TriviaVerse
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
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {authUser?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
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
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {getWelcomeMessage(userRole)}
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
              Available Channels
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : !channels || channels.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>No channels available at the moment.</Alert>
            ) : null}
            <Grid container spacing={3}>
              {quizzes?.map((channel, index) => (
                <Grid item xs={12} md={6} key={channel._id || index}>
                  {(() => {
                    const color = channel.color || channelColors[index % channelColors.length];
                    return (
                      <Card
                        sx={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ bgcolor: color, width: 44, height: 44 }}>
                                <QuizIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  {channel.name || channel.title || 'Untitled Channel'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {channel.category || 'General'}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip label={channel.category || 'General'} size="small" variant="outlined" />
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                            <Chip label={`${channel.totalQuestions || 0} Questions`} size="small" icon={<QuizIcon />} />
                            <Chip
                              label={channel.difficulty || 'Medium'}
                              size="small"
                              color={
                                channel.difficulty === 'Easy'
                                  ? 'success'
                                  : channel.difficulty === 'Medium'
                                  ? 'warning'
                                  : 'error'
                              }
                            />
                            {channel.duration && <Chip label={channel.duration + " min"} size="small" icon={<Schedule />} />}
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {channel.description || 'Test your knowledge and compete for the top spot on the leaderboard!'}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => navigate(`/quiz/${channel._id}`)}
                          >
                            Start Quiz
                          </Button>
                          <Button size="small" onClick={() => navigate(`/quiz/${channel._id}`)}>View Details</Button>
                        </CardActions>
                      </Card>
                    );
                  })()}
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 600 }}>
              Recent Activity
            </Typography>

            <Box>
              Comming soon
            </Box>
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
                      <Typography variant="h6">Create New Quiz Channel</Typography>
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

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c05 100%)',
                    border: '2px solid #f093fb50',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                  onClick={() => navigate('/subscription')}
                >
                  <Chip
                    icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                    label="New"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 16,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          mr: 2,
                        }}
                      >
                        <AutoAwesome />
                      </Avatar>
                      <Typography variant="h6">AI Features</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Unlock AI-powered quiz generation tools
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

            <Box>
              Coming soon public quizzes
            </Box>

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
              onClick={() => navigate('/server-logs')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <Terminal />
                  </Avatar>
                  <Typography variant="h6">Server Logs</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  View and manage server logs
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
     </>
  );
};

export default Dashboard;
