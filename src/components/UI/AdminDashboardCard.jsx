import { Card, CardContent, Typography, Box, Avatar, alpha } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboardCards = ({
  title,
  description,
  icon,
  iconBg = '#4f46e5',
  navigateTo,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          borderColor: 'primary.light',
          '& .card-arrow': {
            transform: 'translateX(4px)',
            color: 'primary.main',
          },
        },
      }}
      onClick={() => navigate(navigateTo)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Avatar
              sx={{
                bgcolor: iconBg.includes?.('.') ? iconBg : alpha(iconBg, 0.14),
                color: iconBg.includes?.('.') ? 'white' : iconBg,
                width: 44,
                height: 44,
              }}
            >
              {icon}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>
          <ArrowForward
            className="card-arrow"
            fontSize="small"
            sx={{ color: 'text.secondary', transition: 'all 0.2s ease' }}
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
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardCards;
