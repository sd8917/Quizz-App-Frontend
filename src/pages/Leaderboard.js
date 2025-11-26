import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  EmojiEvents,
  TrendingUp,
  Star,
  Timer,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { leaderboardService, channelService } from '../services';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [channels, setChannels] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [channelsLoading, setChannelsLoading] = useState(true);

  // Fetch channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await channelService.getAllChannels();
        // API returns { success, data: [...channels], message }
        const channelsData = response?.data || [];
        const channelsList = Array.isArray(channelsData) ? channelsData : [];
        setChannels(channelsList);
        // Set first channel as default
        if (channelsList.length > 0) {
          setSelectedChannel(channelsList[0]._id);
        }
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError('Failed to load channels');
      } finally {
        setChannelsLoading(false);
      }
    };
    fetchChannels();
  }, []);

  // Fetch leaderboard data when channel selection changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedChannel) {
        // No channel selected yet
        setLeaderboardData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch leaderboard for specific channel: /attempt/channel/:channelId/leaderboard
        const response = await leaderboardService.getChannelLeaderboard(selectedChannel);
        // API returns { success, data: { channelId, totalParticipants, leaderboard: [...] } }
        const data = response?.data?.leaderboard || [];
        setLeaderboardData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to load leaderboard data for this channel');
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedChannel]);

  // const leaderboardData = [
  //   {
  //     rank: 1,
  //     username: 'code_master',
  //     avatar: 'C',
  //     score: 2400,
  //     quizzesTaken: 12,
  //     accuracy: 95,
  //     badge: 'gold',
  //     trend: 'up',
  //   },
  //   {
  //     rank: 2,
  //     username: 'quiz_whiz',
  //     avatar: 'Q',
  //     score: 2150,
  //     quizzesTaken: 10,
  //     accuracy: 92,
  //     badge: 'gold',
  //     trend: 'up',
  //   },
  //   {
  //     rank: 3,
  //     username: 'admin',
  //     avatar: 'A',
  //     score: 1800,
  //     quizzesTaken: 4,
  //     accuracy: 90,
  //     badge: 'silver',
  //     trend: 'same',
  //   },
  //   {
  //     rank: 4,
  //     username: 'react_guru',
  //     avatar: 'R',
  //     score: 1650,
  //     quizzesTaken: 8,
  //     accuracy: 88,
  //     badge: 'silver',
  //     trend: 'up',
  //   },
  //   {
  //     rank: 5,
  //     username: 'trivia_fan',
  //     avatar: 'T',
  //     score: 1500,
  //     quizzesTaken: 7,
  //     accuracy: 85,
  //     badge: 'silver',
  //     trend: 'down',
  //   },
  //   {
  //     rank: 6,
  //     username: 'js_ninja',
  //     avatar: 'J',
  //     score: 1350,
  //     quizzesTaken: 6,
  //     accuracy: 82,
  //     badge: 'bronze',
  //     trend: 'up',
  //   },
  //   {
  //     rank: 7,
  //     username: 'css_wizard',
  //     avatar: 'C',
  //     score: 1200,
  //     quizzesTaken: 5,
  //     accuracy: 80,
  //     badge: 'bronze',
  //     trend: 'up',
  //   },
  //   {
  //     rank: 8,
  //     username: 'python_pro',
  //     avatar: 'P',
  //     score: 1100,
  //     quizzesTaken: 5,
  //     accuracy: 78,
  //     badge: 'bronze',
  //     trend: 'same',
  //   },
  // ];

  const topStats = [
    {
      title: 'Total Players',
      value: '1,247',
      icon: <EmojiEvents />,
      color: '#6366f1',
    },
    {
      title: 'Avg Score',
      value: '1,450',
      icon: <Star />,
      color: '#ec4899',
    },
    {
      title: 'Active Today',
      value: '342',
      icon: <TrendingUp />,
      color: '#10b981',
    },
    {
      title: 'Completion Rate',
      value: '87%',
      icon: <Timer />,
      color: '#f59e0b',
    },
  ];

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      case 'bronze':
        return '#CD7F32';
      default:
        return '#gray';
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return 'text.secondary';
  };

  const filteredData = leaderboardData.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar 
        position="static" 
        elevation={0}
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
            Leaderboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {topStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}30`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        width: 40,
                        height: 40,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Leaderboard */}
        <Paper sx={{ p: 3 }}>
          {/* Header with Search */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Channel Rankings
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Channel</InputLabel>
                <Select
                  value={selectedChannel}
                  label="Filter by Channel"
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  }
                  disabled={channelsLoading}
                >
                  {channels.map((channel) => (
                    <MenuItem key={channel._id} value={channel._id}>
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Leaderboard Table */}
          {!loading && !error && (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Player</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Best Score
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Performance
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.map((player, index) => {
                        const rank = index + 1;
                        return (
                          <TableRow
                            key={player._id || player.userId}
                            sx={{
                              '&:hover': {
                                bgcolor: 'action.hover',
                                cursor: 'pointer',
                              },
                            }}
                          >
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 700,
                                    color: getRankColor(rank),
                                    minWidth: 30,
                                  }}
                                >
                                  #{rank}
                                </Typography>
                                {rank <= 3 && (
                                  <EmojiEvents
                                    sx={{
                                      color: getRankColor(rank),
                                      fontSize: 20,
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 600 }}>
                                  {player.username?.charAt(0)?.toUpperCase() || player.email?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    {player.username || 'Anonymous'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {player.email || ''}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {player.bestPercentage?.toFixed(2)}%
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={
                                  player.bestPercentage >= 90
                                    ? 'Excellent'
                                    : player.bestPercentage >= 80
                                    ? 'Great'
                                    : player.bestPercentage >= 70
                                    ? 'Good'
                                    : 'Needs Work'
                                }
                                size="small"
                                color={
                                  player.bestPercentage >= 90
                                    ? 'success'
                                    : player.bestPercentage >= 70
                                    ? 'warning'
                                    : 'error'
                                }
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={player.bestPercentage >= 70 ? 'Passed' : 'Failed'}
                                size="small"
                                variant="outlined"
                                color={player.bestPercentage >= 70 ? 'success' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* No Results */}
              {filteredData.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No leaderboard data for this channel
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Users will appear here once they complete the quiz
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>

        {/* Your Stats */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Your Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  #3
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Current Rank
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  1800
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Points
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  90%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  4
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quizzes Taken
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default Leaderboard;
