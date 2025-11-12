import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ArrowBack,
  Search,
  EmojiEvents,
  TrendingUp,
  Star,
  Timer,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const leaderboardData = [
    {
      rank: 1,
      username: 'code_master',
      avatar: 'C',
      score: 2400,
      quizzesTaken: 12,
      accuracy: 95,
      badge: 'gold',
      trend: 'up',
    },
    {
      rank: 2,
      username: 'quiz_whiz',
      avatar: 'Q',
      score: 2150,
      quizzesTaken: 10,
      accuracy: 92,
      badge: 'gold',
      trend: 'up',
    },
    {
      rank: 3,
      username: 'admin',
      avatar: 'A',
      score: 1800,
      quizzesTaken: 4,
      accuracy: 90,
      badge: 'silver',
      trend: 'same',
    },
    {
      rank: 4,
      username: 'react_guru',
      avatar: 'R',
      score: 1650,
      quizzesTaken: 8,
      accuracy: 88,
      badge: 'silver',
      trend: 'up',
    },
    {
      rank: 5,
      username: 'trivia_fan',
      avatar: 'T',
      score: 1500,
      quizzesTaken: 7,
      accuracy: 85,
      badge: 'silver',
      trend: 'down',
    },
    {
      rank: 6,
      username: 'js_ninja',
      avatar: 'J',
      score: 1350,
      quizzesTaken: 6,
      accuracy: 82,
      badge: 'bronze',
      trend: 'up',
    },
    {
      rank: 7,
      username: 'css_wizard',
      avatar: 'C',
      score: 1200,
      quizzesTaken: 5,
      accuracy: 80,
      badge: 'bronze',
      trend: 'up',
    },
    {
      rank: 8,
      username: 'python_pro',
      avatar: 'P',
      score: 1100,
      quizzesTaken: 5,
      accuracy: 78,
      badge: 'bronze',
      trend: 'same',
    },
  ];

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

  const getTrendIcon = (trend) => {
    if (trend === 'up')
      return (
        <TrendingUp
          sx={{ fontSize: 16, color: 'success.main', transform: 'rotate(0deg)' }}
        />
      );
    if (trend === 'down')
      return (
        <TrendingUp
          sx={{ fontSize: 16, color: 'error.main', transform: 'rotate(180deg)' }}
        />
      );
    return null;
  };

  const filteredData = leaderboardData.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
              Top Players
            </Typography>
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

          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="All Time" />
            <Tab label="This Week" />
            <Tab label="This Month" />
          </Tabs>

          {/* Leaderboard Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Player</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Score
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Quizzes
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Accuracy
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Badge
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Trend
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((player) => (
                  <TableRow
                    key={player.rank}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                        cursor: 'pointer',
                      },
                      bgcolor: player.username === 'admin' ? 'primary.lighter' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: getRankColor(player.rank),
                            minWidth: 30,
                          }}
                        >
                          #{player.rank}
                        </Typography>
                        {player.rank <= 3 && (
                          <EmojiEvents
                            sx={{
                              color: getRankColor(player.rank),
                              fontSize: 20,
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: getBadgeColor(player.badge),
                            color: 'white',
                            fontWeight: 600,
                          }}
                        >
                          {player.avatar}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {player.username}
                          </Typography>
                          {player.username === 'admin' && (
                            <Chip
                              label="You"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {player.score.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        pts
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1">{player.quizzesTaken}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${player.accuracy}%`}
                        size="small"
                        color={
                          player.accuracy >= 90
                            ? 'success'
                            : player.accuracy >= 80
                            ? 'warning'
                            : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: getBadgeColor(player.badge),
                          border: '2px solid',
                          borderColor: 'background.paper',
                          boxShadow: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{getTrendIcon(player.trend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* No Results */}
          {filteredData.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No players found</Typography>
            </Box>
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
