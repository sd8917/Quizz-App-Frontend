import {
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  CardActions,
  Button,
  alpha,
} from '@mui/material';
import {
  Quiz as QuizIcon,
  PlayArrow,
  Schedule,
  Lock,
  LockOpen,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { channelColors } from '../../utils/constant';

const UserRoleDashboard = ({ quizzes }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {quizzes?.map((channel, index) => {
        const color = channel.color || channelColors[index % channelColors.length];
        const isPublic = (channel?.isPublic || 'public').toString().toLowerCase() === 'public';

        return (
          <Grid item xs={12} md={4} sm={6} key={channel._id || index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: `4px solid ${color}`,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: alpha(color, 0.45),
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(color, 0.14),
                      color,
                      width: 46,
                      height: 46,
                    }}
                    alt="Quiz icon"
                  >
                    <QuizIcon />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                      {channel.name || channel.title || 'Untitled Channel'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {channel.category || 'General Track'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.75, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${channel.totalQuestions || 0} Qs`}
                    size="small"
                    icon={<QuizIcon sx={{ fontSize: 15 }} />}
                    sx={{ bgcolor: alpha(color, 0.1), color }}
                  />
                  <Chip
                    label={channel.difficulty || 'Medium'}
                    size="small"
                    color={
                      channel.difficulty === 'Easy'
                        ? 'success'
                        : channel.difficulty === 'Medium'
                          ? 'warning'
                          : 'error'
                    }
                  />
                  {channel.duration && (
                    <Chip
                      label={`${channel.duration} min`}
                      size="small"
                      variant="outlined"
                      icon={<Schedule sx={{ fontSize: 15 }} />}
                    />
                  )}
                  <Chip
                    label={channel?.isPublic || 'Public'}
                    size="small"
                    variant="outlined"
                    icon={isPublic ? <LockOpen sx={{ fontSize: 14 }} /> : <Lock sx={{ fontSize: 14 }} />}
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                  }}
                >
                  {channel.description ||
                    'Test your knowledge and compete for the top spot on the leaderboard!'}
                </Typography>
              </CardContent>

              <CardActions sx={{ px: 3, pb: 2.5, pt: 0, gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate(`/quiz/${channel._id}`)}
                  sx={{
                    bgcolor: color,
                    '&:hover': { bgcolor: color, filter: 'brightness(0.92)' },
                  }}
                >
                  Start Quiz
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => navigate(`/quiz/${channel._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default UserRoleDashboard;
