// Card to controll usermanagement, server logs etc.
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboardCards = ({
  title,
  description,
  icon,
  iconBg = 'primary.main',
  navigateTo,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => navigate(navigateTo)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: iconBg, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6">{title}</Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardCards;
