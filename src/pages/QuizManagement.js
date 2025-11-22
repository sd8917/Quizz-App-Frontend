import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { ArrowBack, Add, Upload, PostAdd, PersonAdd } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { channelService } from '../services';

const QuizManagement = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddQuestionDialog, setOpenAddQuestionDialog] = useState(false);
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bulkQuestionsJson, setBulkQuestionsJson] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [selectedChannelForUser, setSelectedChannelForUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch channels on component mount
  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const response = await channelService.getAllChannels();
      setChannels(response?.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err.message || 'Failed to load channels');
      setSnackbar({ open: true, message: 'Failed to load channels', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      setSnackbar({ open: true, message: 'Channel name is required', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const channelData = {
        name: channelName,
        description: channelDescription,
      };
      
      await channelService.createChannel(channelData);
      setSnackbar({ open: true, message: 'Channel created successfully', severity: 'success' });
      setOpenDialog(false);
      setChannelName('');
      setChannelDescription('');
      
      // Refresh channels list
      fetchChannels();
    } catch (err) {
      console.error('Error creating channel:', err);
      setSnackbar({ open: true, message: err.message || 'Failed to create channel', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (channel) => {
    setSelectedQuiz(channel);
    setOpenAddQuestionDialog(true);
  };

  const handleBulkUpload = (channel) => {
    setSelectedQuiz(channel);
    setBulkQuestionsJson(''); // Clear previous input
    setOpenBulkUploadDialog(true);
  };

  const handleBulkUploadSubmit = async () => {
    if (!bulkQuestionsJson.trim()) {
      setSnackbar({ open: true, message: 'Please paste the questions JSON', severity: 'warning' });
      return;
    }

    if (!selectedQuiz?._id) {
      setSnackbar({ open: true, message: 'No channel selected', severity: 'error' });
      return;
    }

    setUploadLoading(true);
    try {
      // Parse the JSON input
      const parsedData = JSON.parse(bulkQuestionsJson);
      const questions = parsedData.questions || parsedData;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid format: questions array is required');
      }

      // Upload to API
      const response = await channelService.addBulkQuestions(selectedQuiz._id, questions);
      
      console.log('Bulk upload response:', response);
      
      // Update the local channel state with new question count
      const addedCount = response?.data.length || questions.length;
      
      setChannels(prevChannels => 
        prevChannels.map(ch => 
          ch._id === selectedQuiz._id 
            ? { ...ch, questionsCount: (ch.questionsCount || 0) + addedCount }
            : ch
        )
      );
      
      setSnackbar({ 
        open: true, 
        message: `Successfully added ${addedCount} question${addedCount !== 1 ? 's' : ''} to ${selectedQuiz.name}!`, 
        severity: 'success' 
      });
      
      setOpenBulkUploadDialog(false);
      setBulkQuestionsJson('');
      
      // Optionally refresh channels to get accurate count from server
      setTimeout(() => fetchChannels(), 1000);
    } catch (err) {
      console.error('Error uploading bulk questions:', err);
      let errorMessage = 'Failed to upload questions';
      
      if (err instanceof SyntaxError) {
        errorMessage = 'Invalid JSON format. Please check your input.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAddUserToChannel = async () => {
    if (!userEmail.trim()) {
      setSnackbar({ open: true, message: 'Please enter an email address', severity: 'warning' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'warning' });
      return;
    }

    setAddingUser(true);
    try {
      await channelService.addUserToChannel(selectedChannelForUser._id, { email: userEmail });
      
      setSnackbar({ 
        open: true, 
        message: `User ${userEmail} added to ${selectedChannelForUser.name}!`, 
        severity: 'success' 
      });
      setOpenAddUserDialog(false);
      setUserEmail('');
    } catch (err) {
      console.error('Error adding user:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to add user to channel', 
        severity: 'error' 
      });
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteChannel = async () => {
    if (!channelToDelete) return;

    setDeleting(true);
    try {
      await channelService.deleteChannel(channelToDelete._id);
      
      // Remove channel from local state
      setChannels(prevChannels => 
        prevChannels.filter(ch => ch._id !== channelToDelete._id)
      );
      
      setSnackbar({ 
        open: true, 
        message: `Channel "${channelToDelete.name}" deleted successfully!`, 
        severity: 'success' 
      });
      
      setOpenDeleteDialog(false);
      setChannelToDelete(null);
    } catch (err) {
      console.error('Error deleting channel:', err);
      setSnackbar({ 
        open: true, 
        message: err.message || 'Failed to delete channel', 
        severity: 'error' 
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Quiz Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Quiz Channels</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            disabled={loading}
          >
            Create Quiz Channel
          </Button>
        </Box>

        {loading && channels.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error && channels.length === 0 ? (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        ) : channels.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No channels created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click "Create Quiz Channel" to get started
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {channels.map((channel, index) => (
              <Grid item xs={12} md={6} key={channel._id || index}>
                <Card
                  onMouseEnter={() => setHoveredChannel(channel._id)}
                  onMouseLeave={() => setHoveredChannel(null)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Add User Icon - Shows on Hover */}
                  {hoveredChannel === channel._id && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'primary.main',
                        color: 'white',
                        zIndex: 2,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChannelForUser(channel);
                        setOpenAddUserDialog(true);
                      }}
                    >
                      <PersonAdd fontSize="small" />
                    </IconButton>
                  )}
                  <CardContent
                    onClick={() => navigate(`/channel/${channel._id}`)}
                  >
                    <Typography variant="h6" gutterBottom>
                      {channel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {channel.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={`${channel.questionsCount || 0} Questions`} size="small" />
                      <Chip label={new Date(channel.createdAt).toLocaleDateString()} size="small" color="primary" />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                    <Button 
                      size="small" 
                      startIcon={<PostAdd />}
                      onClick={() => handleAddQuestion(channel)}
                      variant="outlined"
                    >
                      Add Question
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Upload />}
                      onClick={() => handleBulkUpload(channel)}
                      variant="outlined"
                      color="secondary"
                    >
                      Add in Bulk
                    </Button>
                    <Button size="small">Edit</Button>
                    <Button 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChannelToDelete(channel);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Quiz Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="e.g., Ai developer MCQ"
          />
          <TextField
            margin="dense"
            label="Channel Description"
            fullWidth
            multiline
            rows={3}
            value={channelDescription}
            onChange={(e) => setChannelDescription(e.target.value)}
            placeholder="e.g., Its about ai exam and its summary for quick learning of user."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateChannel}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create 1'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add Question Dialog */}
      <Dialog open={openAddQuestionDialog} onClose={() => setOpenAddQuestionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Question to {selectedQuiz?.title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Option A"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Option B"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Option C"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Option D"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Correct Answer"
            fullWidth
            select
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="">Select correct answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </TextField>
          <TextField
            margin="dense"
            label="Points"
            type="number"
            fullWidth
            defaultValue={10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddQuestionDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenAddQuestionDialog(false)}>
            Add Question
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={openBulkUploadDialog} onClose={() => setOpenBulkUploadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Upload Questions to {selectedQuiz?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Paste your questions JSON array below:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={12}
              value={bulkQuestionsJson}
              onChange={(e) => setBulkQuestionsJson(e.target.value)}
              placeholder={`{
  "questions": [
    {
      "title": "What is the chemical symbol for water?",
      "questionGroupTitle": "Basic Science",
      "content": "Select the correct chemical symbol for water.",
      "type": "multiple_choice",
      "difficulty": "easy",
      "points": 5,
      "options": [
        { "text": "H2O", "isCorrect": true, "explanation": "H2O is the chemical formula for water." },
        { "text": "O2", "isCorrect": false },
        { "text": "CO2", "isCorrect": false },
        { "text": "NaCl", "isCorrect": false }
      ]
    }
  ]
}`}
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                }
              }}
              disabled={uploadLoading}
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                <strong>Format:</strong> Paste a JSON object with a "questions" array. Each question should have: title, questionGroupTitle, content, type, difficulty, points, and options array.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkUploadDialog(false)} disabled={uploadLoading}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <Upload />} 
            onClick={handleBulkUploadSubmit}
            disabled={uploadLoading}
          >
            {uploadLoading ? 'Uploading...' : 'Upload Questions'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add User to {selectedChannelForUser?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter the email address of the user you want to add to this channel.
            </Typography>
            <TextField
              autoFocus
              fullWidth
              label="Email Address"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={addingUser}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddUserToChannel();
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddUserDialog(false)} disabled={addingUser}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddUserToChannel}
            disabled={addingUser}
            startIcon={addingUser ? <CircularProgress size={20} /> : <PersonAdd />}
          >
            {addingUser ? 'Adding...' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => !deleting && setOpenDeleteDialog(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Delete Channel</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the channel <strong>"{channelToDelete?.name}"</strong>? 
            This action cannot be undone and will remove all associated quizzes and questions.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteChannel}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default QuizManagement;
