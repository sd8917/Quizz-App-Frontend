import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import {
  Article as ArticleIcon,
  TrendingUp as TrendingIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Blog = () => {
  const navigate = useNavigate();

  // Sample blog posts - you can update these later
  const blogPosts = [
    {
      title: '10 Tips to Ace Your Next Quiz',
      excerpt: 'Master these proven strategies to improve your quiz performance and retention',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
      category: 'Study Tips',
      author: 'Sarah Johnson',
      date: 'Nov 10, 2025',
      readTime: '5 min read',
    },
    {
      title: 'The Science of Spaced Repetition',
      excerpt: 'Learn how spaced repetition can help you remember information longer',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      category: 'Learning',
      author: 'Dr. Michael Chen',
      date: 'Nov 8, 2025',
      readTime: '7 min read',
    },
    {
      title: 'How to Create Engaging Quizzes',
      excerpt: 'A guide for educators and content creators on building effective assessments',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      category: 'For Creators',
      author: 'Emily Rodriguez',
      date: 'Nov 5, 2025',
      readTime: '6 min read',
    },
    {
      title: 'The Future of Online Learning',
      excerpt: 'Exploring trends and innovations shaping the education technology landscape',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
      category: 'EdTech',
      author: 'John Doe',
      date: 'Nov 3, 2025',
      readTime: '8 min read',
    },
    {
      title: 'Gamification in Education',
      excerpt: 'How game mechanics are transforming learning experiences and outcomes',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
      category: 'Innovation',
      author: 'Lisa Park',
      date: 'Nov 1, 2025',
      readTime: '6 min read',
    },
    {
      title: 'Building a Study Routine That Works',
      excerpt: 'Practical advice for creating sustainable learning habits',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop',
      category: 'Productivity',
      author: 'David Kim',
      date: 'Oct 28, 2025',
      readTime: '5 min read',
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
          <Box sx={{ textAlign: 'center' }}>
            <ArticleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
              QuizApp Blog
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
              Tips, insights, and stories about learning and education
            </Typography>
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
            We're preparing amazing content about learning strategies, study tips, and education technology. 
            Check back soon for our first posts!
          </Typography>
          <Chip label="Under Development" color="primary" sx={{ fontWeight: 600 }} />
        </Paper>

        {/* Featured Post */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          <TrendingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Featured Post (Preview)
        </Typography>
        <Card sx={{ mb: 6, overflow: 'hidden' }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <CardMedia
                component="img"
                height="400"
                image={blogPosts[0].image}
                alt={blogPosts[0].title}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Chip label={blogPosts[0].category} color="primary" sx={{ mb: 2, width: 'fit-content', fontWeight: 600 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  {blogPosts[0].title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {blogPosts[0].excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {blogPosts[0].author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {blogPosts[0].date} • {blogPosts[0].readTime}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" disabled sx={{ width: 'fit-content' }}>
                  Read Article
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        {/* Recent Posts */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Recent Posts (Preview)
        </Typography>
        <Grid container spacing={4}>
          {blogPosts.slice(1).map((post, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Chip 
                    label={post.category} 
                    size="small" 
                    sx={{ mb: 2, width: 'fit-content', fontWeight: 600 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                        {post.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {post.date} • {post.readTime}
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" fullWidth disabled>
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Newsletter CTA */}
        <Paper
          sx={{
            p: 6,
            mt: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Subscribe to Our Newsletter
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Get the latest posts and learning tips delivered to your inbox
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#f3f4f6',
              },
            }}
            disabled
          >
            Subscribe (Coming Soon)
          </Button>
        </Paper>
      </Container>

      <Footer />
    </>
  );
};

export default Blog;
