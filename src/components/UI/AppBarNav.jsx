import { useNavigate } from 'react-router-dom';
import {
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Chip
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ChatButton from './ChatButton';

const AppBarNav = ({ navigateTo = "/dashboard", title }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const userRole = user?.data?.roles?.[0] || user?.role || 'user';
    const isAdmin = userRole === 'admin';

    return (
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
                    onClick={() => navigate(navigateTo)}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    {title}
                </Typography>
                {isAdmin && <ChatButton />}
                {isAdmin && (
                    <Typography variant="body2" color="text.secondary">
                        •
                    </Typography>
                )}
                <Chip
                    label={user ? `Logged in as ${user?.username || 'Anonymous'}`: "Not logged In"}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                    }}
                />
            </Toolbar>
        </AppBar>
    )
}

export default AppBarNav
