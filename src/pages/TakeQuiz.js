import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  ExitToApp as ExitIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import quizService from '../services/quizService';
import { channelService } from '../services';
const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Fullscreen handling
  const enterFullscreen = () => {
    if (document.fullscreenElement) {
      // Already in fullscreen, no need to request again
      return;
    }

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        // If fullscreen fails, show a message or handle gracefully
        setError('Fullscreen mode is required for this quiz. Please allow fullscreen and try again.');
      });
    } else {
      console.warn('Fullscreen API not supported');
      setError('Your browser does not support fullscreen mode, which is required for this quiz.');
    }
  };

  const handleFullscreenChange = useCallback(async () => {
    if (!document.fullscreenElement) {
      const newCount = fullscreenExitCount + 1;
      setFullscreenExitCount(newCount);
      setShowFullscreenWarning(true);

      // Report to backend if exit count exceeds 3
      if (newCount > 3) {
        try {
          await quizService.reportFullscreenViolation(quizId, newCount);
          // redirect to /
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to report fullscreen violation:', error);
        }
      }
    }
    // eslint-disable-next-line
  }, [fullscreenExitCount, quizId]);

  // Add fullscreen event listener when quiz starts
  useEffect(() => {
    if (quizStarted && !quizSubmitted) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      enterFullscreen();
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  // eslint-disable-next-line
  }, [quizStarted, quizSubmitted, handleFullscreenChange]);

  // Prevent cheating actions when quiz is active
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const preventDefault = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventShortcuts = (e) => {
      // Prevent common copy/paste shortcuts and other potentially cheating keys
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (['c', 'v', 'x', 'a', 's', 'u', 'p', 'i', 'j', 'k'].includes(key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      // Prevent F12 (dev tools), F11 (fullscreen toggle), and other function keys
      if (e.key.startsWith('F') && ['F12', 'F11', 'F5', 'F3'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Add event listeners to prevent cheating
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('selectstart', preventDefault);
    document.addEventListener('keydown', preventShortcuts);

    return () => {
      // Remove event listeners when quiz ends
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('selectstart', preventDefault);
      document.removeEventListener('keydown', preventShortcuts);
    };
  }, [quizStarted, quizSubmitted]);

  // Fetch channel info and check submission status on component mount
  useEffect(() => {
    const fetchChannelInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, check if user has already submitted this quiz
        const attemptsResponse = await quizService.checkUserAttempts();
        const attempts = attemptsResponse.data || [];
        
        // Check if user has submitted for this channel
        const existingAttempt = attempts.find(attempt => 
          attempt.channelId?._id === quizId || attempt.channelId === quizId
        );
        
        if (existingAttempt) {
          setAlreadySubmitted(true);
          setSubmissionData(existingAttempt);
          
          // Set quiz metadata from submission
          const quizMetadata = {
            id: existingAttempt.channelId?._id || quizId,
            title: existingAttempt.channelId?.name || 'Quiz',
            description: 'Test your knowledge',
            duration: 30,
            totalQuestions: existingAttempt.total || 0,
            passingScore: 70,
            questions: [],
          };
          setQuiz(quizMetadata);
          setLoading(false);
          return;
        }
        
        // Fetch channel info from /channel/:id endpoint
        const response = await channelService.getChannelUsers(quizId);
       
        if (!response?.success) {
          throw new Error('Failed to fetch channel information');
        }

        const channelData = response.data;
      
        // Set quiz metadata without questions (will fetch questions on start)
        const quizMetadata = {
          id: channelData?.channel?._id || quizId,
          title: channelData?.channel?.name || 'Quiz',
          description: 'Test your knowledge',
          duration: channelData?.channel?.duration || 30, // Default duration
          totalQuestions: channelData?.channel?.totalQuestions || 0,
          passingScore: channelData?.channel?.passingScore || 70,
          pointPerQuestion: channelData?.channel?.pointsPerQuestion || 1,
          questions: [], // Will be fetched when quiz starts
        };

        setQuiz(quizMetadata);
        setTimeRemaining(quizMetadata.duration * 60);
      } catch (err) {
        console.error('Error fetching channel:', err);
        setError(err.message || 'Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchChannelInfo();
    }
  }, [quizId]);

  // Calculate results from API response
  const calculateResults = useCallback((apiResponse = null) => {
    let questionsWithResults;
    let score;
    let totalQuestions;
    let correctCount;
    
    if (apiResponse?.data) {
      // Use API response data
      const { total, score: apiScore, results } = apiResponse.data;
      
      questionsWithResults = results.map((result) => {
        const question = quiz.questions.find(q => q.id === result.questionId);
        
        return {
          id: result.questionId,
          question: question?.question || '',
          userAnswer: result.userAnswer,
          correctAnswer: result.correctAnswer,
          options: question?.options || [],
          isCorrect: result.isCorrect,
          explanation: question?.explanation || `The correct answer is "${result.correctAnswer}".`,
        };
      });
      
      score = apiScore;
      totalQuestions = total;
      correctCount = apiScore;
    } else {
      // Fallback: Calculate locally if API fails
      let count = 0;
      questionsWithResults = quiz.questions.map((question) => {
        const userAnswerIndex = answers[question.id];
        const isCorrect = userAnswerIndex === question.correctAnswer;
        
        if (isCorrect) {
          count++;
        }

        return {
          id: question.id,
          question: question.question,
          userAnswer: userAnswerIndex !== undefined ? question.options[userAnswerIndex] : null,
          correctAnswer: question.options[question.correctAnswer],
          options: question.options,
          isCorrect,
          explanation: question.explanation || `The correct answer is "${question.options[question.correctAnswer]}".`,
        };
      });
      
      score = count;
      totalQuestions = quiz.totalQuestions;
      correctCount = count;
    }

    const passed = Math.round((correctCount / totalQuestions) * 100) >= quiz.passingScore;

    // Navigate to results page with detailed data
    setTimeout(() => {
      navigate('/quiz-results', {
        state: {
          quizTitle: quiz.title,
          score,
          totalQuestions,
          correctAnswers: correctCount,
          passed,
          questions: questionsWithResults,
        },
      });
    }, 500);
  }, [quiz, answers, navigate]);

  const handleAutoSubmit = useCallback(async () => {
    setQuizSubmitted(true);
    
    try {
      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionId, answerIndex]) => {
        const question = quiz.questions.find(q => q.id === questionId);
        return {
          questionId: questionId,
          selectedOption: question?.options[answerIndex] || ''
        };
      });
      
      // Submit to API
      const response = await quizService.submitQuiz(quizId, formattedAnswers);
      calculateResults(response);
    } catch (error) {
      console.error('Error auto-submitting quiz:', error);
      // Show results with local calculation if API fails
      calculateResults();
    }
  }, [calculateResults, answers, quiz, quizId]);

  // Timer logic
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        
        // Show warning when 5 minutes remain
        if (prev === 300 && !showTimeWarning) {
          setShowTimeWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted, handleAutoSubmit, showTimeWarning]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.totalQuestions) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  // Handle answer selection
  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  // Toggle flag for review
  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  // Navigation
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < quiz.totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Start quiz - Fetch questions from API
  const handleStartQuiz = async () => {
    setFetchingQuestions(true);
    setError(null);
    
    try {
      // Fetch questions using getAllQuizzes from quizService
      const response = await quizService.getAllQuizzes(quizId);
      const questionsData = response.data || response;
      
      if (!questionsData || questionsData.length === 0) {
        throw new Error('No questions available for this quiz');
      }
      
      // Transform API questions to match the expected format
      const transformedQuestions = questionsData.map((q, index) => {
        // Extract text from options array (handle both {text: "...", _id: "..."} and plain string formats)
        const optionsArray = q.options?.map(opt => 
          typeof opt === 'string' ? opt : opt.text || opt
        ) || [];
        
        return {
          id: q._id || index + 1,
          question: q.questionText || q.question || '',
          options: optionsArray,
          correctAnswer: q.correctAnswer || q.correctAnswerIndex || 0,
          explanation: q.explanation || `The correct answer is "${optionsArray[q.correctAnswer || 0]}".`,
        };
      });
      
      // Update quiz with fetched questions
      setQuiz(prev => ({
        ...prev,
        questions: transformedQuestions,
        totalQuestions: transformedQuestions.length,
      }));
      
      setQuizStarted(true);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message || 'Failed to load quiz questions. Please try again.');
      setFetchingQuestions(false);
    } finally {
      setFetchingQuestions(false);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    setShowSubmitDialog(false);
    setQuizSubmitted(true);
    
    try {
      // Format answers for API: [{questionId, selectedOption}]
      const formattedAnswers = Object.entries(answers).map(([questionId, answerIndex]) => {
        const question = quiz.questions.find(q => q.id === questionId);
        return {
          questionId: questionId,
          selectedOption: question?.options[answerIndex] || ''
        };
      });
      
      // Submit to API and get results
      const response = await quizService.submitQuiz(quizId, formattedAnswers);
      
      // Show results with API response data
      calculateResults(response);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      
      // Check if error is due to already submitted
      const errorMessage = error?.message || error?.error || '';
      if (errorMessage.includes('already submitted') || errorMessage.includes('already attempted')) {
        setQuizSubmitted(false);
        setError('This quiz has already been submitted. Multiple submissions are not allowed.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // Still show results with local calculation if API fails for other reasons
        calculateResults();
      }
    }
  };

  // Exit confirmation
  const handleExitQuiz = () => {
    setShowExitDialog(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">Loading quiz information...</Typography>
      </Box>
    );
  }

  // Show already submitted screen
  if (alreadySubmitted && submissionData) {
    return (
      <>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Quiz Already Submitted
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You have already completed this quiz. View your submission details below.
              </Typography>
            </Box>

            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  {submissionData.channelId?.name || quiz.title}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Score
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {submissionData.score}/{submissionData.total}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Percentage
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {submissionData.percentage.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Status
                      </Typography>
                      <Chip 
                        label={submissionData.percentage >= 70 ? 'Passed' : 'Failed'} 
                        color={submissionData.percentage >= 70 ? 'success' : 'error'}
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Submitted
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                        {new Date(submissionData.submittedAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(submissionData.submittedAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Answer Details
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {submissionData.answers?.map((answer, index) => (
                    <Box 
                      key={answer._id || index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        p: 2, 
                        mb: 1,
                        bgcolor: answer.isCorrect ? 'success.lighter' : 'error.lighter',
                        borderRadius: 1,
                        border: 1,
                        borderColor: answer.isCorrect ? 'success.main' : 'error.main',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 80 }}>
                          Question {index + 1}
                        </Typography>
                        <Typography variant="body2">
                          Your Answer: <strong>{answer.selectedOption}</strong>
                        </Typography>
                      </Box>
                      <Chip 
                        label={answer.isCorrect ? 'Correct' : 'Incorrect'} 
                        color={answer.isCorrect ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mb: 3 }}>
              You can only submit this quiz once. Multiple submissions are not allowed.
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/leaderboard')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                View Leaderboard
              </Button>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  if (error && !quiz) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  // Quiz instructions screen
  if (!quizStarted) {
    return (
      <>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              {quiz.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {quiz.description}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ my: 4 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please read the instructions carefully before starting the quiz.
              </Alert>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon color="primary" />
                    Quiz Details
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Questions
                      </Typography>
                      <Typography variant="h6">{quiz.totalQuestions}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="h6">{quiz.duration} minutes</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Passing Score
                      </Typography>
                      <Typography variant="h6">{quiz.passingScore}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Points per Question
                      </Typography>
                      <Typography variant="h6">1 point</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Instructions
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>
                      <Typography variant="body2" paragraph>
                        You will have {quiz.duration} minutes to complete the quiz
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        Each question has only one correct answer
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        You can navigate between questions using the navigation buttons
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        Flag questions for review using the flag button
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        You can change your answers before submitting
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        The quiz will auto-submit when time expires
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        Once submitted, you cannot change your answers
                      </Typography>
                    </li>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                disabled={fetchingQuestions}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartQuiz}
                disabled={fetchingQuestions}
                startIcon={fetchingQuestions ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  px: 4,
                }}
              >
                {fetchingQuestions ? 'Loading Questions...' : 'Start Quiz'}
              </Button>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  // Check if questions are loaded
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No questions available for this quiz. Please try again later.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  // Quiz taking screen
  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 8 }}>
        {/* Header with timer and progress */}
        <Paper
          elevation={2}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            borderRadius: 0,
            py: 2,
            px: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {quiz.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {/* Timer */}
                <Chip
                  icon={<TimerIcon />}
                  label={formatTime(timeRemaining)}
                  color={timeRemaining < 300 ? 'error' : 'default'}
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '1rem', 
                    px: 1,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />

                {/* Progress */}
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    Question {currentQuestionIndex + 1} of {quiz.totalQuestions}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.95 }}>
                    Answered: {answeredCount}/{quiz.totalQuestions}
                  </Typography>
                </Box>

                {/* Exit button */}
                <Tooltip title="Exit Quiz">
                  <IconButton onClick={() => setShowExitDialog(true)} sx={{ color: 'white' }}>
                    <ExitIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Progress bar */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Container>
        </Paper>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Question area */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 4, minHeight: 400 }}>
                {/* Question header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Question {currentQuestionIndex + 1}
                  </Typography>
                  <Tooltip title={flaggedQuestions.has(currentQuestion.id) ? 'Unflag' : 'Flag for review'}>
                    <IconButton
                      onClick={() => toggleFlag(currentQuestion.id)}
                      color={flaggedQuestions.has(currentQuestion.id) ? 'warning' : 'default'}
                    >
                      <FlagIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Question text */}
                <Typography variant="h6" sx={{ bgcolor: 'grey.100', fontFamily: 'monospace', mb: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {currentQuestion.question}
                </Typography>

                {/* Answer options */}
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={answers[currentQuestion.id] ?? ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                  >
                    {currentQuestion.options.map((option, index) => (
                      <Paper
                        key={index}
                        elevation={answers[currentQuestion.id] === index ? 3 : 1}
                        sx={{
                          mb: 2,
                          p: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: answers[currentQuestion.id] === index ? 2 : 1,
                          borderColor: answers[currentQuestion.id] === index ? 'primary.main' : 'divider',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                          },
                        }}
                        onClick={() => handleAnswerChange(currentQuestion.id, index)}
                      >
                        <FormControlLabel
                          value={index}
                          control={<Radio />}
                          label={
                            <Typography variant="body1" sx={{ ml: 1 }}>
                              {option}
                            </Typography>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </Paper>
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* Navigation buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PrevIcon />}
                    onClick={goToPrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </Button>

                  {currentQuestionIndex === quiz.totalQuestions - 1 ? (
                    <Button
                      variant="contained"
                      onClick={() => setShowSubmitDialog(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      }}
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      endIcon={<NextIcon />}
                      onClick={goToNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Question palette */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 120 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Question Palette
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: 'success.main',
                      }}
                    />
                    <Typography variant="caption">Answered</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        border: 2,
                        borderColor: 'divider',
                      }}
                    />
                    <Typography variant="caption">Not Answered</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlagIcon color="warning" fontSize="small" />
                    <Typography variant="caption">Flagged</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 1,
                  }}
                >
                  {quiz.questions.map((question, index) => (
                    <Tooltip
                      key={question.id}
                      title={`Question ${index + 1}${flaggedQuestions.has(question.id) ? ' (Flagged)' : ''}`}
                    >
                      <Box
                        onClick={() => goToQuestion(index)}
                        sx={{
                          position: 'relative',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          cursor: 'pointer',
                          fontWeight: 600,
                          bgcolor: answers[question.id] !== undefined ? 'success.main' : 'background.paper',
                          color: answers[question.id] !== undefined ? 'white' : 'text.primary',
                          border: currentQuestionIndex === index ? 3 : 2,
                          borderColor: currentQuestionIndex === index ? 'primary.main' : 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        {index + 1}
                        {flaggedQuestions.has(question.id) && (
                          <FlagIcon
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              fontSize: 16,
                              color: 'warning.main',
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  ))}
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Tips:</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    • Click on any question number to navigate directly
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Use flag to mark questions for review
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Time warning dialog */}
        <Dialog open={showTimeWarning} onClose={() => setShowTimeWarning(false)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Time Warning
          </DialogTitle>
          <DialogContent>
            <Typography>
              You have only 5 minutes remaining! Please make sure to complete and submit your quiz before time expires.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTimeWarning(false)} variant="contained">
              Okay
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submit confirmation dialog */}
        <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
          <DialogTitle>Submit Quiz?</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Are you sure you want to submit your quiz?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You have answered <strong>{answeredCount}</strong> out of <strong>{quiz.totalQuestions}</strong> questions.
            </Typography>
            {answeredCount < quiz.totalQuestions && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                You have {quiz.totalQuestions - answeredCount} unanswered question(s). Unanswered questions will be marked as incorrect.
              </Alert>
            )}
            {flaggedQuestions.size > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You have {flaggedQuestions.size} flagged question(s). Would you like to review them before submitting?
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowSubmitDialog(false)}>
              Review Answers
            </Button>
            <Button onClick={handleSubmitQuiz} variant="contained" color="success">
              Submit Quiz
            </Button>
          </DialogActions>
        </Dialog>

        {/* Exit confirmation dialog */}
        <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            Exit Quiz?
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Are you sure you want to exit? Your progress will be lost and the quiz will not be submitted.
            </Typography>
            <Alert severity="error">
              This action cannot be undone!
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowExitDialog(false)}>
              Continue Quiz
            </Button>
            <Button onClick={handleExitQuiz} variant="contained" color="error">
              Exit Without Saving
            </Button>
          </DialogActions>
        </Dialog>

        {/* Fullscreen warning dialog */}
        <Dialog open={showFullscreenWarning} disableEscapeKeyDown={true}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="warning" />
            Fullscreen Required
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              Please stay in fullscreen mode to continue the quiz. Exiting fullscreen is not allowed during the quiz.It may cause end your test session.
            </Typography>
            {fullscreenExitCount > 1 && (
              <>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  You have attempted to exit fullscreen {fullscreenExitCount} times. Please remain in fullscreen mode to continue the quiz.
                </Alert>
              </>
              
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              // Request fullscreen immediately as part of the user gesture
              enterFullscreen();
              setShowFullscreenWarning(false);
            }} variant="contained">
              Okay
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submitting overlay */}
        {quizSubmitted && (
          <Dialog open={quizSubmitted}>
            <DialogContent sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Quiz Submitted Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calculating your results...
              </Typography>
              <LinearProgress sx={{ mt: 3 }} />
            </DialogContent>
          </Dialog>
        )}
      </Box>
      
    </>
  );
};

export default TakeQuiz;
