import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Rating,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ArrowForward as ArrowIcon,
  AutoAwesome as SparkleIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandIcon,
  LocalFireDepartment as FireIcon,
  Menu as MenuIcon,
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';
import { GradientBackground, GradientButton, SectionHeader } from '../components/UI';
import {
  faqs,
  features,
  services,
  stats,
  steps,
  subjectTracks,
  testimonials,
} from '../utils/constant';

const SAMPLE_QUIZ = {
  topic: 'Computer Science • Daily Practice',
  question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
  options: ['Queue', 'Stack', 'Linked List', 'Hash Table'],
  correctIndex: 1,
  explanation: 'A Stack pushes and pops elements from the top, making the last item added the first one removed.',
};

const NAV_ITEMS = [
  { label: 'Subjects', href: '#subjects' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

const LandingPage = () => {
  useSEO('home');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();
  const theme = useTheme();
  const [expandedFaq, setExpandedFaq] = useState('panel0');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const handlePrimaryCta = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  const scrollToSection = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Sticky EdTech Navigation Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha('#ffffff', 0.92),
          backdropFilter: 'blur(14px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 70, justifyContent: 'space-between' }}>
            {/* Brand */}
            <Box
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}
            >
              <img
                src="/logo192.png"
                alt="TriviaVerse Logo"
                width="36"
                height="36"
                style={{ width: 36, height: 36, borderRadius: 10 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                TriviaVerse
              </Typography>
            </Box>

            {/* Desktop Nav Links */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    px: 2,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* Desktop CTA */}
            <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {isAuthenticated ? (
                <GradientButton
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/dashboard')}
                  sx={{ px: 3, py: 1 }}
                >
                  Go to Dashboard
                </GradientButton>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                  >
                    Sign In
                  </Button>
                  <GradientButton
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/register')}
                    sx={{ px: 2.75, py: 1 }}
                  >
                    Start Free
                  </GradientButton>
                </>
              )}
            </Stack>

            {/* Mobile Hamburger */}
            <IconButton
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 270, p: 2 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 1 }}>
          <img src="/logo192.png" alt="TriviaVerse" width="28" height="28" style={{ borderRadius: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            TriviaVerse
          </Typography>
        </Box>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton key={item.href} onClick={() => scrollToSection(item.href)} sx={{ borderRadius: 2 }}>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          ))}
        </List>
        <Stack spacing={1.5} sx={{ mt: 2, px: 1 }}>
          {!isAuthenticated && (
            <Button variant="outlined" fullWidth onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
          <GradientButton fullWidth onClick={handlePrimaryCta}>
            {isAuthenticated ? 'Go to Dashboard' : 'Start Learning Free'}
          </GradientButton>
        </Stack>
      </Drawer>

      {/* Hero Section */}
      <GradientBackground
        minHeight={{ xs: 'auto', md: '86vh' }}
        padding={{ xs: '48px 16px 64px', sm: '60px 24px 72px', md: '72px 24px 88px' }}
        sx={{ alignItems: 'center' }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white' }}>
                <Chip
                  icon={<SparkleIcon sx={{ fontSize: 16, color: '#fbbf24 !important' }} />}
                  label="Interactive Learning & Assessment Platform"
                  sx={{
                    bgcolor: alpha('#ffffff', 0.12),
                    color: '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.25rem', sm: '2.85rem', lg: '3.45rem' },
                    lineHeight: 1.12,
                    mb: 2.5,
                  }}
                >
                  Master Any Subject with{' '}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #fbbf24 0%, #2dd4bf 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Smart Interactive Quizzes
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    color: '#cbd5e1',
                    lineHeight: 1.65,
                    fontSize: { xs: '1.02rem', md: '1.15rem' },
                    maxWidth: 540,
                  }}
                >
                  Build lasting mastery through active recall, instant explanations,
                  adaptive practice tracks, and real-time classroom & global leaderboards.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
                  <GradientButton
                    size="large"
                    endIcon={<ArrowIcon />}
                    onClick={handlePrimaryCta}
                    bgcolor="#ffffff"
                    color="#1e1b4b"
                    sx={{
                      py: 1.6,
                      px: 3.75,
                      fontSize: '1.05rem',
                    }}
                  >
                    {isAuthenticated ? 'Open Dashboard' : 'Start Learning Free'}
                  </GradientButton>
                  <Button
                    size="large"
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    onClick={() => scrollToSection('#subjects')}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.35)',
                      color: 'white',
                      py: 1.6,
                      px: 3.25,
                      fontSize: '1.02rem',
                      bgcolor: alpha('#ffffff', 0.06),
                      '&:hover': {
                        borderColor: '#ffffff',
                        bgcolor: alpha('#ffffff', 0.14),
                      },
                    }}
                  >
                    Explore Subjects
                  </Button>
                </Box>

                {/* Trust Metrics */}
                <Grid container spacing={3} sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.14)' }}>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#ffffff' }}>
                      1M+
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      Active Learners
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#2dd4bf' }}>
                      50K+
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      Curated Quizzes
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fbbf24' }}>
                      98%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      Pass Confidence
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Column: Interactive EdTech Quiz Preview Card */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={12}
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  borderRadius: 4,
                  bgcolor: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 28px 65px rgba(2, 6, 23, 0.45)',
                  animation: 'floatGentle 6s ease-in-out infinite',
                }}
              >
                {/* Top Gamified EdTech Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    icon={<SchoolIcon sx={{ fontSize: 16 }} />}
                    label={SAMPLE_QUIZ.topic}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 700,
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<FireIcon sx={{ fontSize: 16, color: '#ea580c !important' }} />}
                      label="12-Day Streak"
                      size="small"
                      sx={{ bgcolor: '#fff7ed', color: '#c2410c', fontWeight: 700 }}
                    />
                    <Chip
                      label="+50 XP"
                      size="small"
                      sx={{ bgcolor: '#ecfdf5', color: '#047857', fontWeight: 700 }}
                    />
                  </Stack>
                </Box>

                {/* Mastery Progress */}
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Topic Mastery Progress
                    </Typography>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                      Question 3 of 4 • 75%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={selectedOption === SAMPLE_QUIZ.correctIndex ? 100 : 75}
                    sx={{
                      height: 8,
                      borderRadius: 99,
                      bgcolor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 99,
                        background: 'linear-gradient(90deg, #4f46e5 0%, #0d9488 100%)',
                      },
                    }}
                  />
                </Box>

                {/* Interactive Sample Question */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'text.primary', lineHeight: 1.4 }}>
                  {SAMPLE_QUIZ.question}
                </Typography>

                <Stack spacing={1.25}>
                  {SAMPLE_QUIZ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === SAMPLE_QUIZ.correctIndex;
                    const showFeedback = selectedOption !== null;

                    let borderColor = 'rgba(15, 23, 42, 0.12)';
                    let bgcolor = '#f8fafc';
                    let textColor = 'text.primary';

                    if (showFeedback && isCorrect) {
                      borderColor = '#10b981';
                      bgcolor = '#ecfdf5';
                      textColor = '#065f46';
                    } else if (showFeedback && isSelected && !isCorrect) {
                      borderColor = '#ef4444';
                      bgcolor = '#fef2f2';
                      textColor = '#991b1b';
                    }

                    return (
                      <Box
                        key={option}
                        onClick={() => setSelectedOption(idx)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedOption(idx);
                        }}
                        sx={{
                          p: 1.5,
                          px: 2,
                          borderRadius: 2.5,
                          border: '1.5px solid',
                          borderColor,
                          bgcolor,
                          color: textColor,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: showFeedback ? borderColor : theme.palette.primary.main,
                            bgcolor: showFeedback ? bgcolor : alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              bgcolor: showFeedback && isCorrect ? '#10b981' : '#e2e8f0',
                              color: showFeedback && isCorrect ? '#ffffff' : '#334155',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option}
                          </Typography>
                        </Box>
                        {showFeedback && isCorrect && (
                          <CheckIcon sx={{ fontSize: 20, color: '#10b981' }} />
                        )}
                      </Box>
                    );
                  })}
                </Stack>

                {/* Instant Explanation Bar */}
                <Box
                  sx={{
                    mt: 2.25,
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: selectedOption !== null ? '#eef2ff' : '#f1f5f9',
                    border: '1px solid',
                    borderColor: selectedOption !== null ? '#c7d2fe' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#334155', lineHeight: 1.5 }}>
                    {selectedOption !== null
                      ? SAMPLE_QUIZ.explanation
                      : 'Try clicking an answer above to preview instant active-recall feedback.'}
                  </Typography>
                  {selectedOption !== null && (
                    <Button
                      size="small"
                      onClick={() => setSelectedOption(null)}
                      sx={{ minWidth: 'auto', px: 1.5, py: 0.5, fontSize: '0.75rem' }}
                    >
                      Reset
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </GradientBackground>

      {/* Popular Subject Tracks Section */}
      <Box id="subjects" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="CURATED TRACKS"
            chipColor="secondary"
            title="Explore Popular Learning Tracks"
            subtitle="Structured topic channels designed for students, educators, and certification prep"
          />
          <Grid container spacing={3}>
            {subjectTracks.map((track) => (
              <Grid item xs={12} sm={6} md={4} key={track.title}>
                <Card
                  onClick={handlePrimaryCta}
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderLeft: `4px solid ${track.color}`,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      borderColor: alpha(track.color, 0.5),
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(track.color, 0.12),
                          color: track.color,
                          width: 46,
                          height: 46,
                        }}
                      >
                        {track.icon}
                      </Avatar>
                      <Chip
                        label={track.level}
                        size="small"
                        sx={{
                          bgcolor: alpha(track.color, 0.1),
                          color: track.color,
                          fontSize: '0.72rem',
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.75 }}>
                      {track.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {track.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: track.color }}>
                        {track.quizzes}
                      </Typography>
                      <ArrowIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="PLATFORM FEATURES"
            chipColor="primary"
            title="Why Learners & Educators Choose TriviaVerse"
            subtitle="Everything you need to create, take, and master assessments in one focused workspace"
          />
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 4,
                      borderColor: alpha(feature.color, 0.4),
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        bgcolor: alpha(feature.color, 0.12),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                        color: feature.color,
                        '& svg': { fontSize: 32 },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section (Streamlined EdTech Learning Journey) */}
      <Box id="how-it-works" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="LEARNING WORKFLOW"
            chipColor="secondary"
            title="From Sign-Up to Mastery in 5 Steps"
            subtitle="A frictionless loop built around active recall, instant feedback, and visible growth"
          />
          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={index < 3 ? 4 : 6} key={step.number}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.25,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha(step.color, 0.22),
                    background: `linear-gradient(145deg, ${alpha(step.color, 0.08)} 0%, #ffffff 70%)`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.25 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: step.color,
                        color: 'white',
                        boxShadow: `0 6px 14px ${alpha(step.color, 0.35)}`,
                      }}
                    >
                      {step.icon}
                    </Avatar>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: alpha(step.color, 0.28),
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services / Use Cases Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="WHO IT'S FOR"
            chipColor="secondary"
            title="Built for Classrooms, Teams & Self-Learners"
            subtitle="Whether preparing for finals, upskilling employees, or hosting live trivia"
          />
          <Grid container spacing={3.5}>
            {services.map((service, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="170"
                      image={service.image}
                      alt={service.title}
                      loading="lazy"
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 60%)',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                        mt: -6,
                        position: 'relative',
                        zIndex: 1,
                        border: '3px solid #ffffff',
                        boxShadow: 3,
                        '& svg': { fontSize: 28 },
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.65, flexGrow: 1 }}>
                      {service.description}
                    </Typography>
                    <Button
                      endIcon={<ArrowIcon />}
                      onClick={handlePrimaryCta}
                      sx={{ alignSelf: 'flex-start', px: 0, fontWeight: 700 }}
                    >
                      Explore Track
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box
        sx={{
          py: { xs: 7, md: 9 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f766e 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: alpha('#ffffff', 0.08),
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: 'white',
                    borderRadius: 3.5,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: alpha('#ffffff', 0.14),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 1.75,
                      color: '#2dd4bf',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <SectionHeader
            chipLabel="LEARNER STORIES"
            chipColor="primary"
            title="Trusted by Students & Trainers"
            subtitle="See how learners around the world use TriviaVerse to build confidence and mastery"
          />
          <Grid container spacing={3.5}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3.25,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box>
                    <Rating value={testimonial.rating} readOnly size="small" sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.7 }}>
                      "{testimonial.comment}"
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 46, height: 46 }}
                        alt={testimonial.name}
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                      label="Verified"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Walkthrough Video Section */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <SectionHeader
            chipLabel="PRODUCT TOUR"
            chipColor="secondary"
            title="See TriviaVerse in Action"
            subtitle="Take a quick walkthrough of creating channels, attempting timed quizzes, and reviewing analytics"
            sx={{ mb: 5 }}
          />
          <Paper
            elevation={6}
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 24px 50px rgba(15, 23, 42, 0.14)',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/4BPLeW3ptmE"
              title="TriviaVerse Platform Walkthrough"
              loading="lazy"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Paper>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box id="faq" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="md">
          <SectionHeader
            chipLabel="FAQ"
            chipColor="primary"
            title="Frequently Asked Questions"
            subtitle="Everything you need to know before starting your first quiz"
            sx={{ mb: 5 }}
          />
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `panel${index}`}
              onChange={handleFaqChange(`panel${index}`)}
              elevation={0}
              sx={{
                mb: 1.75,
                border: '1px solid',
                borderColor: expandedFaq === `panel${index}` ? 'primary.light' : 'divider',
                '&:before': { display: 'none' },
                borderRadius: '14px !important',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandIcon />}
                sx={{
                  px: 3,
                  py: 0.75,
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Final CTA Section */}
      <GradientBackground
        minHeight="auto"
        padding={{ xs: '64px 16px', md: '84px 24px' }}
        sx={{
          color: 'white',
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.65rem' },
            }}
          >
            Ready to Level Up Your Knowledge?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4.5, color: '#cbd5e1', fontWeight: 400, lineHeight: 1.65 }}>
            Join over 1 million learners and educators building mastery every day.
            Create your free account in under 60 seconds.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <GradientButton
              size="large"
              endIcon={<ArrowIcon />}
              onClick={handlePrimaryCta}
              bgcolor="#ffffff"
              color="#1e1b4b"
              sx={{
                py: 1.75,
                px: 4.5,
                fontSize: '1.08rem',
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free Now'}
            </GradientButton>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                py: 1.75,
                px: 4,
                fontSize: '1.08rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha('#ffffff', 0.1),
                },
              }}
            >
              Learn More
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 4 }, flexWrap: 'wrap', color: '#e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ fontSize: 18, color: '#2dd4bf' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>No Credit Card Required</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ fontSize: 18, color: '#2dd4bf' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Free Forever Plan</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckIcon sx={{ fontSize: 18, color: '#2dd4bf' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Instant Analytics</Typography>
            </Box>
          </Box>
        </Container>
      </GradientBackground>

      <Footer />
    </>
  );
};

export default LandingPage;
