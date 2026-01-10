import { useNavigate } from 'react-router-dom';
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const AppBarNav = ({ navigateTo = "/dashboard", title }) => {
    const navigate = useNavigate();

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
            </Toolbar>
        </AppBar>
    )
}

export default AppBarNav
