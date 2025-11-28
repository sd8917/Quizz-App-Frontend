import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Snackbar,
  Alert,
  Link,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  LockOpen,
  Public,
  Create,
  SupervisorAccount,
  Settings,
  BugReport,
  Send,
} from '@mui/icons-material';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import JourneyPath from '../components/JourneyPath';
import RegisterLoginIllustration from '../components/RegisterLoginIllustration';

const Tutorial = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleRequestCreator = () => {
    const targetEmail = 'triviaverse.contact@gmail.com';
    if (!email) {
      setSnackbarMsg('Please enter your email first.');
      setSnackbarOpen(true);
      return;
    }

    const subject = encodeURIComponent('Request: Upgrade to Creator Role');
    const body = encodeURIComponent(`Hello admin,\n\nI would like to request Creator access. My email: ${email}\n\nThanks.`);
    const mailto = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
    // open mail client in new tab/window
    window.open(mailto, '_blank', 'noopener,noreferrer');
    setSnackbarMsg('Mail client opened. You can also contact triviaverse.contact@gmail.com');
    setSnackbarOpen(true);
    setEmail('');
  };

  const handleCopyEmail = async () => {
    const targetEmail = 'triviaverse.contact@gmail.com';
    try {
      await navigator.clipboard.writeText(targetEmail);
      setSnackbarMsg('Email copied to clipboard.');
    } catch (e) {
      setSnackbarMsg(`Please copy: ${targetEmail}`);
    }
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Tutorial — How to use TriviaVerse
          </Typography>
          <Button color="inherit" onClick={() => navigate('/login')}>Sign in</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: { xs: 2, md: 4 } }} elevation={2}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
            Quick Start Guide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Learn the core features of TriviaVerse and how to get the most out of the platform.
          </Typography>

          <JourneyPath
            steps={[
              { label: 'Sign Up/Login In' },
              { label: 'Browse Quizzes/Manage Quizzes' },
              { label: 'Take Quiz/Create Quizzes' },
              { label: 'Submit & Review/Leaderboard management' },
              { label: '' },
              { label: 'Creator/admin/user role' },
            ]}
            duration={3800}
          />

          {/* Alternating steps layout */}
          {[
            {
              title: '1 — Register & Login',
              desc: 'Create an account to save progress, participate in quizzes, and access role-based features.',
              bullets: [
                { icon: <Person color="primary" />, text: 'Register with a valid email' },
                { icon: <LockOpen color="primary" />, text: 'Verify email (if required) and login' },
              ],
              image: <RegisterLoginIllustration />,
            },
            {
              title: '2 — Global Tests',
              desc: 'Some quizzes are public and can be attempted by anyone — look for the "Global" label on quiz cards.',
              bullets: [
                { icon: <Public color="primary" />, text: 'Search or browse global quizzes' },
                { icon: <Create color="primary" />, text: 'Take quizzes without joining a channel' },
              ],
              image: '/assets/quiz-cards.svg',
            },
            {
              title: '3 — Roles & Permissions',
              desc: 'There are three roles on the platform. Your role determines what you can do.',
              bullets: [],
              image: '/assets/roles-badges.svg',
            },
            {
              title: '4 — Creator Workflow',
              desc: 'Creators can build quizzes, group them into channels, and invite users to participate.',
              bullets: [
                { icon: <Create color="primary" />, text: 'Create questions with 4 options and correct answer' },
                { icon: <Person color="primary" />, text: 'Invite users to your channel via email' },
                { icon: <Settings color="primary" />, text: 'Manage quizzes, view participants, export results' },
              ],
              image: '/assets/creator-hero.svg',
            },
            {
              title: '5 — Admin Workflow',
              desc: 'Admins have full control: manage users, channels, quizzes, and check server logs.',
              bullets: [
                { icon: <SupervisorAccount color="primary" />, text: 'Full user management (roles, bans, invites)' },
                { icon: <BugReport color="primary" />, text: 'Access server logs to investigate issues' },
                { icon: <Settings color="primary" />, text: 'Site-wide settings and monitoring' },
              ],
              image: '/assets/server-logs.svg',
            },
          ].map((step, idx) => (
            <Grid
              key={step.title}
              container
              spacing={2}
              alignItems="center"
              direction={{ xs: 'column', md: idx % 2 === 0 ? 'row' : 'row-reverse' }}
              sx={{ my: 3 }}
            >
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{step.desc}</Typography>
                  {step.bullets && step.bullets.length > 0 && (
                    <List>
                      {step.bullets.map((b, i) => (
                        <ListItem key={i}>
                          <ListItemIcon>{b.icon}</ListItemIcon>
                          <ListItemText primary={b.text} />
                        </ListItem>
                      ))}
                    </List>
                  )}

                  {/* For roles step, show the role text if no bullets */}
                  {idx === 2 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}><strong>Admin</strong> — full access (manage users, channels, quizzes, server logs)</Typography>
                      <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}><strong>Creator</strong> — create quizzes, invite users to channels, manage quiz content</Typography>
                      <Typography variant="body2" color="text.primary"><strong>User</strong> — take quizzes, view results, track progress</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: 560 }}>
                    {React.isValidElement(step.image) ? (
                      <Box sx={{ width: '100%' }}>{step.image}</Box>
                    ) : (
                      <img src={step.image} alt={step.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                    )}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Paper>

                      <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Creator Access</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Want to become a Creator? You can request elevated access — send your email and our admins will review it.
              </Typography>

              <Paper sx={{ p: { xs: 2, md: 3 }, mt: 1 }} elevation={1}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      label="Your email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', md: 'row' } }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Send />}
                      onClick={handleRequestCreator}
                      sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                      Request Creator Role
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCopyEmail}
                      sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                      Copy Admin Email
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Or go to our <Link href="/contact" underline="hover">Contact page</Link> or email <strong>triviaverse.contact@gmail.com</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate('/register')}>Create an account</Button>
              </Box>
      </Container>

      <Footer />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
              {snackbarMsg}
            </Alert>
          </Snackbar>
    </Box>
  );
};

export default Tutorial;
