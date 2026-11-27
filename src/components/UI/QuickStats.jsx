import { Grid, Card, CardContent, Typography, Box, Avatar, alpha } from '@mui/material';

/**
 * Dashboard KPI summary cards with clean EdTech framing.
 */
const QuickStats = ({ stats }) => {
  return (
    <Grid container spacing={2.5}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              height: '100%',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: alpha(stat.color, 0.2),
              borderTop: `4px solid ${stat.color}`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: 3,
              },
            }}
          >
            <CardContent sx={{ p: 2.75 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {stat.title}
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.color, 0.12),
                    color: stat.color,
                    width: 42,
                    height: 42,
                  }}
                  alt="stat icon"
                >
                  {stat.icon}
                </Avatar>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'text.primary',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default QuickStats;
