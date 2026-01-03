import { Typography } from "@mui/material"

const DashboardTitle = ({ userRole }) => {
    return (
        <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {userRole === 'admin' && 'Manage your platform and monitor performance'}
                {userRole === 'creator' && 'Track your quiz performance and create new content'}
                {userRole === 'user' && 'Continue your learning journey and compete with others'}
            </Typography>
        </>
    )
}

export default DashboardTitle
