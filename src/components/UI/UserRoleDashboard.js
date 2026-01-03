import { Grid, Card, CardContent, Box, Avatar, Typography, Chip, CardActions, Button } from "@mui/material";
import {
    Quiz as QuizIcon,
    PlayArrow,
    Schedule,
    Accessibility,
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { channelColors } from "../../utils/constant";

const UserRoleDashboard = ({ quizzes }) => {
    const navigate = useNavigate();
    return (
        <>
            <Grid container spacing={3}>
                {quizzes?.map((channel, index) => (
                    <Grid item xs={12} md={4} sm={6} key={channel._id || index}>
                        {(() => {
                            const color = channel.color || channelColors[index % channelColors.length];
                            return (
                                <Card
                                    sx={{
                                        height: '100%',
                                        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                                        border: `1px solid ${color}30`,
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{ bgcolor: color, width: 44, height: 44 }} alt='Quiz icon'>
                                                    <QuizIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        {channel.name || channel.title || 'Untitled Channel'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip label={`${channel.totalQuestions || 0} Q`} size="small" icon={<QuizIcon />} />
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
                                            {channel.duration && <Chip label={channel.duration + " min"} size="small" icon={<Schedule />} />}
                                            <Chip label={`${channel?.isPublic || "Public"}`} size="small" icon={<Accessibility />} />
                                            <Chip label={channel.category || 'General'} size="small" variant="outlined" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2, // number of lines
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {channel.description || 'Test your knowledge and compete for the top spot on the leaderboard!'}
                                        </Typography>
                                        
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            startIcon={<PlayArrow />}
                                            onClick={() => navigate(`/quiz/${channel._id}`)}
                                        >
                                            Start Quiz
                                        </Button>
                                        <Button size="small" variant="secondary" onClick={() => navigate(`/quiz/${channel._id}`)}>View Details</Button>
                                    </CardActions>
                                </Card>
                            );
                        })()}
                    </Grid>
                ))}
            </Grid>
        </>
    )
}

export default UserRoleDashboard
