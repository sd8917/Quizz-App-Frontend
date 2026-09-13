import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Chip,
  Button,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import quizService from '../services/quizService';

const SubmittedQuizzes = () => {
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const data = channelId 
          ? await quizService.getChannelSubmissions(channelId)
          : await quizService.getSubmittedQuizzes();
          
        // The API returns the array in data.data or data.attempts
        const attemptsList = data.data || data.attempts || (Array.isArray(data) ? data : []);
        setAttempts(attemptsList);
      } catch (err) {
        setError(err?.message || 'Failed to fetch submitted quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [channelId]);

  const handleViewDetails = async (attemptId) => {
    setDialogOpen(true);
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const data = await quizService.getAttemptById(attemptId);
      setSelectedAttempt(data.attempt || data);
    } catch (err) {
      setDetailsError(err?.message || 'Failed to fetch details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAttempt(null);
  };

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
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {channelId ? 'Channel Submissions' : 'Submitted Quizzes'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <AssignmentIcon color="primary" sx={{ fontSize: 32, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            {channelId ? 'Submissions by Users' : 'My Submissions'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : attempts.length === 0 && !error ? (
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                You haven't submitted any quizzes yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {Array.isArray(attempts) && attempts.map((attempt, index) => {
              const displayTitle = channelId 
                ? (attempt.user?.name || attempt.user?.username || attempt.user?.email || `User ${index + 1}`)
                : (attempt.channelId?.name || attempt.quiz?.title || attempt.title || `Quiz ${index + 1}`);

              return (
                <Grid item xs={12} sm={6} md={4} key={attempt._id || index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {displayTitle}
                        </Typography>
                        <Chip 
                          icon={<CheckCircleIcon />} 
                          label="Submitted" 
                          color="success" 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1.5 }}>
                        Score: {attempt.score !== undefined ? attempt.score : 'N/A'} 
                        {attempt.total || attempt.totalQuestions ? ` / ${attempt.total || attempt.totalQuestions}` : ''}
                      </Typography>
                      {(attempt.submittedAt || attempt.createdAt) && (
                        <Typography variant="caption" color="text.disabled" sx={{ mb: 2 }}>
                          Submitted on: {new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                      
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <Button 
                          variant="outlined" 
                          size="small" 
                          fullWidth 
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewDetails(attempt._id)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Attempt Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Submission Details</Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : selectedAttempt ? (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">User</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedAttempt.user?.name || selectedAttempt.user?.username || selectedAttempt.user?.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Score</Typography>
                  <Typography variant="body1" fontWeight="500">
                    {selectedAttempt.score !== undefined ? selectedAttempt.score : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Submitted At</Typography>
                  <Typography variant="body1">
                    {selectedAttempt.createdAt ? new Date(selectedAttempt.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" sx={{ mb: 2 }}>Answers</Typography>
              {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                <List disablePadding>
                  {selectedAttempt.answers.map((answer, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="500" sx={{ mb: 1 }}>
                        Q{index + 1}: {answer.question?.questionText || 'Unknown Question'}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Selected Option</Typography>
                          <Typography variant="body2" color={answer.isCorrect ? 'success.main' : 'error.main'} fontWeight="500">
                            {answer.selectedOption?.text || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Result</Typography>
                          <Chip 
                            size="small" 
                            label={answer.isCorrect ? 'Correct' : 'Incorrect'} 
                            color={answer.isCorrect ? 'success' : 'error'} 
                            variant="outlined" 
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No answers available.</Typography>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmittedQuizzes;
