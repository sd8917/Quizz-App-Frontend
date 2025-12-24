import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, Rating, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, Snackbar, AppBar, Toolbar, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import feedbackService from '../services/feedbackService';

const Feedback = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });

  const loadFeedback = async () => {
    try {
      const data = await feedbackService.getFeedback();
      const items = data?.data;
      setList(Array.isArray(items.items) ? items.items : []);
    } catch (err) {
      console.error('Failed to load feedback', err);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleSubmit = async () => {
    if (!message.trim() || (!anonymous && !name.trim())) {
      setSnack({ open: true, message: 'Please provide your name (or choose anonymous) and message.' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: anonymous ? 'Anonymous' : name.trim(),
        email: anonymous ? '' : (email.trim() || ''),
        rating: Number(rating),
        message: message.trim(),
        anonymous: Boolean(anonymous),
      };

      await feedbackService.submitFeedback(payload);
      setSnack({ open: true, message: 'Thank you for your feedback!' });
      setName('');
      setEmail('');
      setRating(5);
      setMessage('');
      setAnonymous(false);
      loadFeedback();
    } catch (err) {
      console.error('Failed to submit feedback', err);
      setSnack({ open: true, message: err?.message || 'Failed to submit feedback' });
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            What Our Users Say
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          What Our Users Say
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Join thousands of satisfied learners
        </Typography>

        <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Share your feedback
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                disabled={anonymous}
              />
              <Chip
                label={anonymous ? 'Posting as Anonymous' : 'Verified User'}
                onClick={() => setAnonymous(!anonymous)}
                clickable
                color={anonymous ? 'default' : 'primary'}
              />
            </Box>

            <TextField
              label="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              disabled={anonymous}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography>Rating:</Typography>
              <Rating value={rating} onChange={(_, v) => setRating(v || 5)} />
            </Box>

            <TextField
              label="Your feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              multiline
              rows={5}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Submit Feedback'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Recent feedback
          </Typography>
          <Paper sx={{ p: 2 }} elevation={1}>
            <List>
              {list.length === 0 && (
                <Typography variant="body2" color="text.secondary">No feedback yet. Be the first to share!</Typography>
              )}

              {list.map((item, idx) => (
                <ListItem key={item._id || idx} alignItems="flex-start" sx={{ mb: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }} alt='name avatar'>{(item.name || 'U').charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Typography sx={{ fontWeight: 700 }}>{item.name}</Typography><Rating value={item.rating || 5} size="small" readOnly /></Box>}
                    secondary={<Typography variant="body2" color="text.secondary">{item.message}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        </Grid>

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ open: false, message: '' })} message={snack.message} />
      </Container>

      <Footer />
    </Box>
  );
};

export default Feedback;
