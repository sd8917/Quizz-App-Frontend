import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EmojiEvents as TrophyIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const QuizResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExplanations, setShowExplanations] = useState(true);

  // Get quiz results from location state or use sample data
  const results = location.state || {
    quizTitle: 'General Knowledge Quiz',
    score: 2,
    totalQuestions: 3,
    correctAnswers: 2,
    passed: true,
    questions: [
      {
        id: 1,
        question: 'What is the capital of France?',
        userAnswer: 'Berlin',
        correctAnswer: 'Paris',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        isCorrect: false,
        explanation: 'Paris is the capital and most populous city of France. It has been the capital since 987 AD and is known for its art, fashion, gastronomy, and culture.',
      },
      {
        id: 2,
        question: 'What is 2 + 2?',
        userAnswer: '4',
        correctAnswer: '4',
        options: ['3', '4', '5', '6'],
        isCorrect: true,
        explanation: 'Basic arithmetic: 2 + 2 = 4. This is a fundamental addition operation.',
      },
      {
        id: 3,
        question: 'Which planet is known as the Red Planet?',
        userAnswer: 'Mars',
        correctAnswer: 'Mars',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        isCorrect: true,
        explanation: 'Mars is called the Red Planet because of iron oxide (rust) on its surface, giving it a reddish appearance when viewed from Earth.',
      },
    ],
  };

  const scorePercentage = Math.round((results.score / results.totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;

  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'success';
    if (scorePercentage >= 60) return 'warning';
    return 'error';
  };

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return 'Outstanding! 🌟';
    if (scorePercentage >= 80) return 'Excellent work! 🎉';
    if (scorePercentage >= 70) return 'Good job! 👍';
    if (scorePercentage >= 60) return 'Not bad! Keep practicing.';
    return 'Keep learning! You can do better.';
  };

  return (
    <>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          bgcolor: 'background.default',
          pb: 8,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Score Card */}
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              mb: 4,
              bgcolor: 'background.paper',
              borderRadius: 3,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid',
              borderColor: isPassed ? 'success.main' : 'error.main',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: isPassed 
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
              }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quiz Complete!
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                Your score:
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '4rem' },
                }}
              >
                {results.score} / {results.totalQuestions}
              </Typography>
              <Chip
                label={`${scorePercentage}%`}
                color={getScoreColor()}
                sx={{ 
                  mt: 2, 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  px: 2,
                  py: 3,
                }}
              />
            </Box>

            <Alert 
              severity={isPassed ? 'success' : 'warning'} 
              icon={isPassed ? <TrophyIcon /> : null}
              sx={{ 
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getScoreMessage()}
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="primary"
                onClick={() => setShowExplanations(!showExplanations)}
                startIcon={showExplanations ? null : <LightbulbIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {showExplanations ? 'Hide Explanations' : 'Show Explanations'}
              </Button>
            </Box>
          </Paper>

          {/* Question Results */}
          {results.questions && results.questions.length > 0 && (
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <SparkleIcon sx={{ color: 'primary.main' }} />
                Question Review
              </Typography>

              {results.questions.map((question, index) => (
                <Accordion
                  key={question.id}
                  defaultExpanded={!question.isCorrect}
                  sx={{
                    mb: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:before': {
                      display: 'none',
                    },
                    border: '2px solid',
                    borderColor: question.isCorrect ? 'success.light' : 'error.light',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      bgcolor: question.isCorrect 
                        ? 'rgba(16, 185, 129, 0.08)' 
                        : 'rgba(239, 68, 68, 0.08)',
                      '&:hover': {
                        bgcolor: question.isCorrect 
                          ? 'rgba(16, 185, 129, 0.12)' 
                          : 'rgba(239, 68, 68, 0.12)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                      {question.isCorrect ? (
                        <CheckCircleIcon sx={{ color: '#10b981', fontSize: 28 }} />
                      ) : (
                        <CancelIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                      )}
                      <Typography sx={{ fontWeight: 600, flex: 1 }}>
                        {question.question}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {/* User's Answer */}
                      <Grid item xs={12} md={6}>
                        <Card 
                          sx={{ 
                            bgcolor: question.isCorrect 
                              ? 'rgba(16, 185, 129, 0.08)' 
                              : 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid',
                            borderColor: question.isCorrect ? 'success.light' : 'error.light',
                          }}
                        >
                          <CardContent>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                mb: 1, 
                                opacity: 0.7,
                                fontWeight: 600,
                              }}
                            >
                              Your answer:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {question.isCorrect ? (
                                <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                              ) : (
                                <CancelIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                              )}
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: question.isCorrect ? '#10b981' : '#ef4444',
                                }}
                              >
                                {question.userAnswer || 'Not answered'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Correct Answer */}
                      <Grid item xs={12} md={6}>
                        <Card 
                          sx={{ 
                            bgcolor: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid',
                            borderColor: 'success.light',
                          }}
                        >
                          <CardContent>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                mb: 1, 
                                opacity: 0.7,
                                fontWeight: 600,
                              }}
                            >
                              Correct answer:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: '#10b981',
                                }}
                              >
                                {question.correctAnswer}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Explanation */}
                    {showExplanations && question.explanation && (
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                            p: 2,
                            bgcolor: 'rgba(99, 102, 241, 0.08)',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'primary.light',
                          }}
                        >
                          <LightbulbIcon sx={{ color: 'primary.main', mt: 0.5 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                mb: 1,
                                fontWeight: 700,
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <SparkleIcon sx={{ fontSize: 18 }} />
                              Explain Why
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                lineHeight: 1.7,
                                color: 'text.secondary',
                              }}
                            >
                              {question.explanation}
                            </Typography>
                          </Box>
                        </Box>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Summary Stats */}
          <Paper 
            elevation={4} 
            sx={{ 
              mt: 4, 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Performance Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {results.correctAnswers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Correct
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {results.totalQuestions - results.correctAnswers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Incorrect
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {scorePercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {results.totalQuestions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default QuizResults;
