import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
} from '@mui/material';
import {
  Help as HelpIcon,
  Search as SearchIcon,
  ExpandMore as ExpandIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  ContactSupport as SupportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import Footer from '../components/Footer';

const HelpCenter = () => {
  useSEO('help');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(false);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const categories = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Getting Started',
      description: 'Learn the basics of using QuizApp',
      color: '#667eea',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Account & Privacy',
      description: 'Manage your account and privacy settings',
      color: '#10b981',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      title: 'Billing & Plans',
      description: 'Information about pricing and payments',
      color: '#f59e0b',
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      title: 'Features & Settings',
      description: 'Explore features and customize settings',
      color: '#ec4899',
    },
  ];

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on the "Get Started" button on the homepage and fill in your details. You\'ll receive a confirmation email to verify your account.',
    },
    {
      question: 'Is TriviaVerse free to use?',
      answer: 'Yes! TriviaVerse offers a free plan with access to thousands of quizzes. We also have premium plans with additional features for power users.',
    },
    {
      question: 'How do I create my own quiz?',
      answer: 'After logging in, please drop an email to update your role to "Creator" then navigate to the Dashboard and click on "Create Quiz". Follow the step-by-step wizard to add questions, set time limits, and publish your quiz. More details will be available in the Tutorial footer menu!',
    },
    {
      question: 'Can I track my progress?',
      answer: 'Absolutely! Your Dashboard provides detailed analytics including scores, time spent, improvement trends, and areas for improvement.',
    },
    {
      question: 'How does the leaderboard work?',
      answer: 'The leaderboard ranks users based on their quiz performance, including accuracy, speed, and consistency. Points are calculated using our proprietary algorithm.',
    },
    {
      question: 'What if I encounter a technical issue?',
      answer: 'Please contact our support team through the Contact page or email us at triviaverse.contact@gmail.com. We typically respond within 24 hours.',
    },
  ];

  return (
    <>
      {/* Header with gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 8,
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HelpIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              Help Center
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', mb: 4 }}>
              How can we help you today?
            </Typography>
            
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: 600,
                mx: 'auto',
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Coming Soon Notice */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 4,
            mb: 6,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            🚀 Coming Soon!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We're building a comprehensive help center with detailed guides, video tutorials, and more. 
            Below is a preview of what's coming!
          </Typography>
          <Chip label="Under Development" color="primary" sx={{ fontWeight: 600 }} />
        </Paper>

        {/* Help Categories */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Browse by Category
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: category.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {category.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* FAQs */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ mb: 6 }}>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `panel${index}`}
              onChange={handleFaqChange(`panel${index}`)}
              sx={{
                mb: 2,
                '&:before': { display: 'none' },
                boxShadow: 1,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Contact Support */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          }}
        >
          <SupportIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Still Need Help?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Our support team is here to help you with any questions or issues
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 700,
              }}
            >
              Contact Support
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.location.href = 'mailto:support@quizapp.com'}
              sx={{ fontWeight: 700 }}
            >
              Email Us
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default HelpCenter;
