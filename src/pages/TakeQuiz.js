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

  // Sample quiz data - Replace with API call in production
  useEffect(() => {
    // Simulating API call to fetch quiz
    const sampleQuiz = {
      id: quizId,
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics',
      duration: 30, // minutes
      totalQuestions: 15,
      passingScore: 70,
      questions: [
        {
          id: 1,
          question: 'What is the output of: console.log(typeof null)?',
          options: ['null', 'undefined', 'object', 'number'],
          correctAnswer: 2, // index of correct option
        },
        {
          id: 2,
          question: 'Which method is used to add elements to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 0,
        },
        {
          id: 3,
          question: 'What does "===" operator check?',
          options: ['Value only', 'Type only', 'Both value and type', 'Reference only'],
          correctAnswer: 2,
        },
        {
          id: 4,
          question: 'Which keyword is used to declare a constant in JavaScript?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 2,
        },
        {
          id: 5,
          question: 'What is a closure in JavaScript?',
          options: [
            'A function that has access to variables in its outer scope',
            'A closed loop',
            'A private class',
            'An error handling mechanism'
          ],
          correctAnswer: 0,
        },
        {
          id: 6,
          question: 'Which method converts JSON string to JavaScript object?',
          options: ['JSON.parse()', 'JSON.stringify()', 'JSON.convert()', 'JSON.object()'],
          correctAnswer: 0,
        },
        {
          id: 7,
          question: 'What is the purpose of "use strict" directive?',
          options: [
            'To enforce stricter parsing and error handling',
            'To make code run faster',
            'To enable ES6 features',
            'To prevent memory leaks'
          ],
          correctAnswer: 0,
        },
        {
          id: 8,
          question: 'Which array method creates a new array with results of calling a function?',
          options: ['forEach()', 'map()', 'filter()', 'reduce()'],
          correctAnswer: 1,
        },
        {
          id: 9,
          question: 'What does NaN stand for?',
          options: ['Null and Null', 'Not a Number', 'New Array Number', 'Negative Number'],
          correctAnswer: 1,
        },
        {
          id: 10,
          question: 'How do you create a promise in JavaScript?',
          options: [
            'new Promise()',
            'Promise.create()',
            'createPromise()',
            'Promise.new()'
          ],
          correctAnswer: 0,
        },
        {
          id: 11,
          question: 'What is the DOM?',
          options: [
            'Document Object Model',
            'Data Object Manager',
            'Dynamic Output Module',
            'Document Oriented Markup'
          ],
          correctAnswer: 0,
        },
        {
          id: 12,
          question: 'Which event occurs when a user clicks on an HTML element?',
          options: ['onmouseclick', 'onclick', 'onpress', 'onhover'],
          correctAnswer: 1,
        },
        {
          id: 13,
          question: 'What is the difference between "let" and "var"?',
          options: [
            'let is block-scoped, var is function-scoped',
            'No difference',
            'var is newer than let',
            'let can be redeclared'
          ],
          correctAnswer: 0,
        },
        {
          id: 14,
          question: 'What does the "this" keyword refer to?',
          options: [
            'The current object',
            'The parent object',
            'The window object',
            'The previous object'
          ],
          correctAnswer: 0,
        },
        {
          id: 15,
          question: 'Which company developed JavaScript?',
          options: ['Microsoft', 'Netscape', 'Oracle', 'Mozilla'],
          correctAnswer: 1,
        },
      ],
    };

    setQuiz(sampleQuiz);
    setTimeRemaining(sampleQuiz.duration * 60); // Convert to seconds
  }, [quizId]);

  // Calculate results
  const calculateResults = useCallback(() => {
    let correctCount = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.totalQuestions) * 100);
    const passed = score >= quiz.passingScore;

    // Navigate to results page with data
    setTimeout(() => {
      navigate('/dashboard', {
        state: {
          quizCompleted: true,
          quizTitle: quiz.title,
          score,
          totalQuestions: quiz.totalQuestions,
          correctAnswers: correctCount,
          passed,
        },
      });
    }, 500);
  }, [quiz, answers, navigate]);

  const handleAutoSubmit = useCallback(() => {
    setQuizSubmitted(true);
    calculateResults();
  }, [calculateResults]);

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

  // Start quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    setShowSubmitDialog(false);
    setQuizSubmitted(true);
    calculateResults();
  };

  // Exit confirmation
  const handleExitQuiz = () => {
    setShowExitDialog(false);
    navigate('/dashboard');
  };

  if (!quiz) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading quiz...</Typography>
      </Box>
    );
  }

  // Quiz instructions screen
  if (!quizStarted) {
    return (
      <>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              {quiz.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {quiz.description}
            </Typography>

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
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleStartQuiz}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  px: 4,
                }}
              >
                Start Quiz
              </Button>
            </Box>
          </Paper>
        </Container>
        <Footer />
      </>
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
                <Typography variant="h6" sx={{ mb: 4, lineHeight: 1.6 }}>
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
      <Footer />
    </>
  );
};

export default TakeQuiz;
