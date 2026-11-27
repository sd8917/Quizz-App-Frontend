import { useNavigate } from 'react-router-dom';
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Box,
  alpha,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ChatButton from './ChatButton';

const AppBarNav = ({ navigateTo = '/dashboard', title }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userRole = user?.data?.roles?.[0] || user?.role || 'user';
  const isAdmin = userRole === 'admin';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.18)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 60, sm: 66 }, gap: 1.5 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate(navigateTo)}
          aria-label="Go back"
          sx={{
            bgcolor: alpha('#ffffff', 0.1),
            '&:hover': { bgcolor: alpha('#ffffff', 0.2) },
          }}
        >
          <ArrowBack fontSize="small" />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isAdmin && <ChatButton />}
          <Chip
            label={user ? `${user?.username || 'Learner'}` : 'Guest'}
            size="small"
            sx={{
              bgcolor: alpha('#ffffff', 0.14),
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: 600,
              px: 0.5,
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarNav;
