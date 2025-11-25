import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { Provider } from 'react-redux';
import store from './store';
import theme from './theme/theme';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading for better performance
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const QuizManagement = React.lazy(() => import('./pages/QuizManagement'));
const ChannelDetails = React.lazy(() => import('./pages/ChannelDetails'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ServerLogs = React.lazy(() => import('./pages/ServerLogs'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const TakeQuiz = React.lazy(() => import('./pages/TakeQuiz'));
const QuizResults = React.lazy(() => import('./pages/QuizResults'));
const OurTeam = React.lazy(() => import('./pages/OurTeam'));
const Careers = React.lazy(() => import('./pages/Careers'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const Blog = React.lazy(() => import('./pages/Blog'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}
  >
    <CircularProgress size={60} sx={{ color: 'white' }} />
  </Box>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/team" element={<OurTeam />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsAndConditions />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/quiz-management" element={<ProtectedRoute><QuizManagement /></ProtectedRoute>} />
              <Route path="/channel/:channelId" element={<ProtectedRoute><ChannelDetails /></ProtectedRoute>} />
              <Route path="/quiz/:quizId" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
              <Route path="/quiz-results" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute> } />
              <Route path="/server-logs" element={<ProtectedRoute><ServerLogs /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
