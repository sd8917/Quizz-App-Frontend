import { Grid, Card, CardContent, Typography, Box, Avatar } from "@mui/material"


// At top of dashboard page - Stats details.

const QuickStats = ({stats}) => {
    return (
        <>
            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                                border: `1px solid ${stat.color}30`,
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }} alt='stat icon'>
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
        </>
    )
}

export default QuickStats
