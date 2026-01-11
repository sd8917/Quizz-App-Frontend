// In progress 
import React from 'react';

// Lazy loading for better performance
const LandingPage    = React.lazy(() => import('./pages/LandingPage'));
const Login          = React.lazy(() => import('./pages/Login'));
const Register       = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword  = React.lazy(() => import('./pages/ResetPassword'));
const Dashboard      = React.lazy(() => import('./pages/Dashboard'));
const QuizManagement = React.lazy(() => import('./pages/QuizManagement'));
const ChannelDetails = React.lazy(() => import('./pages/ChannelDetails'));
const Profile        = React.lazy(() => import('./pages/Profile'));
const Leaderboard    = React.lazy(() => import('./pages/Leaderboard'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ServerLogs     = React.lazy(() => import('./pages/ServerLogs'));
const About          = React.lazy(() => import('./pages/About'));
const Contact        = React.lazy(() => import('./pages/Contact'));
const TakeQuiz       = React.lazy(() => import('./pages/TakeQuiz'));
const QuizResults    = React.lazy(() => import('./pages/QuizResults'));
const OurTeam        = React.lazy(() => import('./pages/OurTeam'));
const Careers        = React.lazy(() => import('./pages/Careers'));
const HelpCenter     = React.lazy(() => import('./pages/HelpCenter'));
const Blog           = React.lazy(() => import('./pages/Blog'));
const PrivacyPolicy  = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const CookiePolicy   = React.lazy(() => import('./pages/CookiePolicy'));
const Disclaimer     = React.lazy(() => import('./pages/Disclaimer'));
const Tutorial       = React.lazy(() => import('./pages/Tutorial'));
const Feedback       = React.lazy(() => import('./pages/Feedback'));
const GoogleCallback = React.lazy(() => import('./pages/GoogleCallback'));
const Subscription   = React.lazy(() => import('./pages/Subscription'));

export const ROUTE_TYPES = {
    PUBLIC:     'public',
    PROTECTED:  'protected',
    CREATOR:    'creator',
};

export const routes = [
    {
        path:     '/',
        element:  <LandingPage />,
        type:     ROUTE_TYPES.PUBLIC,
    },
    {
        path:     '/login',
        element:  <Login />,
        type:     ROUTE_TYPES.PUBLIC,
    },
    {
        path:      '/register',
        element:   <Register />,
        type:      ROUTE_TYPES.PUBLIC,
    },
    {
        path:      '/auth/google/callback',
        element:   <GoogleCallback />,
        type:      ROUTE_TYPES.PUBLIC,
    },
    {
        path:     '/forgot-password',
        element:  <ForgotPassword />,
        type:     ROUTE_TYPES.PUBLIC,
    },
    {
        path:    '/reset-password',
        element: <ResetPassword />,
        type:    ROUTE_TYPES.PUBLIC,
    },
    {
        path:   '/about',
        element: <About />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:   '/contact',
        element: <Contact />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/team',
        element: <OurTeam />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/careers',
        element: <Careers />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/help',
        element: <HelpCenter />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/blogs',
        element:  <Blog />,
        type:     ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/privacy-policy',
        element: <PrivacyPolicy />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/terms-conditions',
        element: <TermsAndConditions />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/cookie-policy',
        element: <CookiePolicy />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/disclaimer',
        element: <Disclaimer />,
        type:    ROUTE_TYPES.CREATOR,
    },
    {
        path:    '/tutorial',
        element: <Tutorial />,
        type:    ROUTE_TYPES.CREATOR,
    },
    {
        path:    '/feedback',
        element: <Feedback />,
        type:    ROUTE_TYPES.PUBLIC,
    },

    //   Protected Routes 
    {
        path:    '/dashboard',
        element: <Dashboard />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/quiz-management',
        element: <QuizManagement />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/channel/:channelId',
        element: <ChannelDetails />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:     '/quiz/:quizId',
        element: <TakeQuiz />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:     '/quiz-results',
        element: <QuizResults />,
        type:    ROUTE_TYPES.PROTECTED,
    },

    {
        path:    '/profile',
        element: <Profile />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/leaderboard',
        element: <Leaderboard />,
        type:    ROUTE_TYPES.PROTECTED,
    },

    {
        path:    '/subscription',
        element: <Subscription />,
        type:    ROUTE_TYPES.PROTECTED,
    },
    {
        path:    '/refund',
        element: <Refund />,
        type:    ROUTE_TYPES.PUBLIC,
    },
    {
        path:    '/user-management',
        element:  <UserManagement />,
        type:     ROUTE_TYPES.PROTECTED,
    },
    {
        path:     '/server-logs',
        element:  <ServerLogs />,
        type:    ROUTE_TYPES.PROTECTED,
    },
];
