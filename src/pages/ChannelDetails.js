import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Tabs,
  Tab,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  Quiz as QuizIcon,
  PersonAdd,
  People,
  Email,
  AutoAwesome,
  ContentCopy,
  EmojiEvents,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import { quizService, channelService } from '../services';
import leaderboardService from '../services/leaderboardService';

const ChannelDetails = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  
  // Get user role from Redux state
  const userRole = authUser?.data?.roles?.[0] || authUser?.role || 'user';
  
  // Check if user has access (only admin and creator)
  const hasAccess = userRole === 'admin' || userRole === 'creator';
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentTab, setCurrentTab] = useState(0);
  const [users, setUsers] = useState([]);

  const [usersLoading, setUsersLoading] = useState(false);
  
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  
  // AI Generator state
  const [quizTopic, setQuizTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [marks, setMarks] = useState(1);
  const [generatedQuizData, setGeneratedQuizData] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (!hasAccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasAccess, navigate]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (channelId && hasAccess) {
      fetchQuestions();
    }
    // eslint-disable-next-line 
  }, [channelId]);

  useEffect(() => {
    if (currentTab === 1 && channelId) {
      fetchUsers();
    }
    if (currentTab === 2 && channelId) {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, channelId]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await quizService.getAllQuizzes(channelId);

      // Handle different response structures
      const questionsData = response?.data
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message || 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await channelService.getChannelUsers(channelId);
      const usersData = (response?.data?.channel?.members.filter(user=>{
        return response?.data?.channel.owner._id !== user.user._id;
      })) || [];

      setChannelInfo({
        name: response?.data?.channel?.name,
        description: response?.data?.channel?.description,
        createdAt: response?.data?.channel?.createdAt,
      });
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setSnackbar({ open: true, message: 'Failed to load users', severity: 'error' });
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const response = await leaderboardService.getChannelLeaderboard(channelId);
      const leaderboardData = response?.data?.leaderboard || [];
      setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLeaderboardError(err.message || 'Failed to load leaderboard');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAddUser = async () => {
    if (!userEmail.trim()) {
      setSnackbar({ open: true, message: 'Please enter an email address', severity: 'warning' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'warning' });
      return;
    }

    setAddingUser(true);
    try {
      await channelService.addUserToChannel(channelId, { email: userEmail });
      
      setSnackbar({ 
        open: true, 
        message: `User ${userEmail} has been added to the channel!`, 
        severity: 'success' 
      });
      setOpenAddUserDialog(false);
      setUserEmail('');
      
      // Refresh users list if on Users tab
      if (currentTab === 1) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to add user to channel', 
        severity: 'error' 
      });
    } finally {
      setAddingUser(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) {
      setSnackbar({ open: true, message: 'Please enter a quiz topic', severity: 'warning' });
      return;
    }

    if (numQuestions < 1 || numQuestions > 50) {
      setSnackbar({ open: true, message: 'Number of questions must be between 1 and 50', severity: 'warning' });
      return;
    }

    setGenerating(true);
    try {
      // Call backend AI generation endpoint
      const payload = {
        topic: quizTopic.trim(),
        difficulty: difficulty, // 'easy' | 'medium' | 'hard'
        numberOfQuestions: Number(numQuestions),
        marks: Number(marks),
      };

      const response = await quizService.generateAIQuestions(payload);
      // Response may be an array or an object containing a `questions` array
      const data = response?.data ?? response;
      const generatedQuestions = Array.isArray(data) ? data : (data?.questions || []);

      if (generatedQuestions.length === 0) {
        setSnackbar({ open: true, message: 'No questions were generated. Please try again.', severity: 'warning' });
        return;
      }

      const quizData = {
        id: `q_${Date.now()}`,
        title: `AI Generated: ${quizTopic}`,
        category: 'AI Generated',
        questions: generatedQuestions,
      };

      setGeneratedQuizData(quizData);
      setSnackbar({ open: true, message: `Successfully generated ${generatedQuestions.length} questions!`, severity: 'success' });
    } catch (err) {
      console.error('Error generating quiz:', err);
      setSnackbar({ 
        open: true, 
        message: err?.message || 'Failed to generate quiz. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyJSON = () => {
    if (generatedQuizData) {
      navigator.clipboard.writeText(JSON.stringify(generatedQuizData, null, 2));
      setSnackbar({ 
        open: true, 
        message: 'Quiz JSON copied to clipboard!', 
        severity: 'success' 
      });
    }
  };

  const handleAddToChannel = async () => {
    // This would integrate with your bulk upload functionality
    setSnackbar({ 
      open: true, 
      message: 'Feature coming soon! Use the copy button to paste into bulk upload.', 
      severity: 'info' 
    });
  };

  // Access control - redirect if user doesn't have permission
  if (!hasAccess) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>Access Denied</Typography>
          <Typography variant="body2">
            You don't have permission to access this page. Only admins and creators can view channel details.
          </Typography>
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/quiz-management')}
          >
            <ArrowBack />
          </IconButton>
          <QuizIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {channelInfo?.name || 'Channel Questions'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={() => setOpenAddUserDialog(true)}
            sx={{ 
              mr: 2,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Add User
          </Button>
          {questions.length > 0 && (
            <Chip
              label={`${questions.length} Questions`}
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* AI Quiz Generator Section */}
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AutoAwesome sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
              AI Quiz Generator
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Quiz Topic"
                placeholder="e.g., React Hooks, Python Basics, World History"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                disabled={generating}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="# of Questions"
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                disabled={generating}
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  label="Difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  disabled={generating}
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Marks per Question"
                type="number"
                value={marks}
                onChange={(e) => setMarks(parseInt(e.target.value) || 1)}
                disabled={generating}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleGenerateQuiz}
            disabled={generating}
            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
            sx={{
              mt: 3,
              py: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              },
              transition: 'all 0.2s',
            }}
          >
            {generating ? 'Generating with AI...' : 'Generate with AI'}
          </Button>

          {/* Generated Quiz Display */}
          {generatedQuizData && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.dark' }}>
                Generated Quiz Data:
              </Typography>
              
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  bgcolor: '#1e293b',
                  color: '#10b981',
                  maxHeight: 400,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={handleCopyJSON}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <ContentCopy />
                </IconButton>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(generatedQuizData, null, 2)}
                </pre>
              </Paper>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyJSON}
                  sx={{ flex: 1 }}
                >
                  Copy JSON
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAddToChannel}
                  sx={{ flex: 1 }}
                >
                  Add This Quiz to App
                </Button>
              </Box>
            </Box>
          )}
        </Paper>


        {channelInfo && (
          <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea15 0%, #764ba205 100%)' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {channelInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {channelInfo.description || 'No description available'}
            </Typography>
          </Paper>
        )}

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuizIcon />
                  Questions
                  <Chip label={questions.length} size="small" color="primary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <People />
                  Users
                  <Chip label={users.length} size="small" color="secondary" />
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiEvents />
                  Leaderboard
                  <Chip label={leaderboard.length} size="small" color="warning" />
                </Box>
              } 
            />
          </Tabs>
        </Paper>

        {/* Questions Tab */}
        {currentTab === 0 && (
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : questions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No questions found in this channel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add questions using the "Add Question" or "Add in Bulk" buttons
              </Typography>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2}>
                {questions.map((question, index) => (
                <Grid item xs={12} key={question._id || index}>
                  <Accordion
                    sx={{
                      '&:before': { display: 'none' },
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          gap: 2,
                        },
                      }}
                    >
                      <Chip
                        label={`Q${index + 1}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600, minWidth: 50 }}
                      />
                      <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
                        {question?.questionText}
                      </Typography>
                      <Chip
                        label={question.difficulty || 'Medium'}
                        size="small"
                        color={getDifficultyColor(question.difficulty)}
                      />
                      <Chip
                        label={`${question.marks || 0} pts`}
                        size="small"
                        variant="outlined"
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ pl: 2 }}>
                        {question.createdAt && (
                            
                          <Chip
                            label={question.createdAt}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        )}
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                          Options:
                        </Typography>
                        <List dense>
                          {question.options?.map((option, optIndex) => (
                            <ListItem
                              key={optIndex}
                              sx={{
                                bgcolor: option.isCorrect ? 'success.light' : 'transparent',
                                borderRadius: 1,
                                mb: 1,
                                border: option.isCorrect ? '2px solid' : '1px solid',
                                borderColor: option.isCorrect ? 'success.main' : 'divider',
                              }}
                            >
                              {option.isCorrect ? (
                                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                              ) : (
                                <RadioButtonUnchecked sx={{ mr: 2, color: 'text.secondary' }} />
                              )}
                              <ListItemText
                                primary={option.text}
                                secondary={option.isCorrect && option.explanation}
                                primaryTypographyProps={{
                                  fontWeight: option.isCorrect ? 600 : 400,
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Users Tab */}
        {currentTab === 1 && (
          usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No users added to this channel yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "Add User" button to invite users
              </Typography>
            </Box>
          ) : (
            <Paper>
              <List>
                {users.map((user, index) => (
                  <React.Fragment key={user._id || user.email || index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}12
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.user?.name || user.user?.username || 'User'}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email fontSize="small" />
                            {user?.user?.email}
                          </Box>
                        }
                      />
                      {user.role && (
                        <Chip label={user.role} size="small" color="primary" variant="outlined" />
                      )}
                    </ListItem>
                    {index < users.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          )
        )}

        {/* Leaderboard Tab */}
        {currentTab === 2 && (
          leaderboardLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : leaderboardError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {leaderboardError}
            </Alert>
          ) : leaderboard.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No leaderboard data available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Users will appear here once they complete the quiz
              </Typography>
            </Box>
          ) : (
            <Paper>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Top Performers
                </Typography>
                <List>
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const getRankColor = (r) => {
                      if (r === 1) return '#FFD700';
                      if (r === 2) return '#C0C0C0';
                      if (r === 3) return '#CD7F32';
                      return 'text.secondary';
                    };

                    return (
                      <React.Fragment key={entry._id || index}>
                        <ListItem
                          sx={{
                            py: 2,
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            {/* Rank */}
                            <Box sx={{ minWidth: 60, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: getRankColor(rank),
                                }}
                              >
                                #{rank}
                              </Typography>
                              {rank <= 3 && (
                                <EmojiEvents
                                  sx={{
                                    color: getRankColor(rank),
                                    fontSize: 20,
                                  }}
                                />
                              )}
                            </Box>

                            {/* User Info */}
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {entry.username?.charAt(0)?.toUpperCase() || 
                                 entry.email?.charAt(0)?.toUpperCase() || 'U'}
                              </Avatar>
                            </ListItemAvatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {entry.username || 'Anonymous User'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {entry.email || ''}
                              </Typography>
                            </Box>

                            {/* Best Percentage */}
                            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {entry.bestPercentage?.toFixed(2)}%
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                best score
                              </Typography>
                            </Box>

                            {/* Performance Badge */}
                            <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                              <Chip
                                label={
                                  entry.bestPercentage >= 90
                                    ? 'Excellent'
                                    : entry.bestPercentage >= 80
                                    ? 'Great'
                                    : entry.bestPercentage >= 70
                                    ? 'Good'
                                    : 'Needs Work'
                                }
                                size="small"
                                color={
                                  entry.bestPercentage >= 90
                                    ? 'success'
                                    : entry.bestPercentage >= 70
                                    ? 'warning'
                                    : 'error'
                                }
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>

                            {/* Pass/Fail Status */}
                            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                              <Chip
                                label={entry.bestPercentage >= 70 ? 'Passed' : 'Failed'}
                                size="small"
                                variant="outlined"
                                color={entry.bestPercentage >= 70 ? 'success' : 'error'}
                              />
                            </Box>
                          </Box>
                        </ListItem>
                        {index < leaderboard.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              </Box>
            </Paper>
          )
        )}
      </Container>

      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add User to Channel</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the email address of the user you want to add to this channel.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Email Address"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={addingUser}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddUser();
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} disabled={addingUser}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUser}
            disabled={addingUser}
            startIcon={addingUser ? <CircularProgress size={20} /> : <PersonAdd />}
          >
            {addingUser ? 'Adding...' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ChannelDetails;
