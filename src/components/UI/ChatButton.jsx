import React, { useState } from 'react';
import { Button } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import ChatDialog from './ChatDialog';

const ChatButton = () => {
    const [chatOpen, setChatOpen] = useState(false);

    const handleChatOpen = () => setChatOpen(true);
    const handleChatClose = () => setChatOpen(false);

    return (
        <>
            <Button
                variant="outlined"
                size="small"
                startIcon={<AutoAwesome />}
                onClick={handleChatOpen}
                sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'white',
                    },
                    fontSize: '0.75rem',
                    padding: '2px 12px',
                    minWidth: 'auto',
                    margin: '0 4px'
                }}
            >
                 AI 
            </Button>
            <ChatDialog open={chatOpen} onClose={handleChatClose} />
        </>
    );
};

export default ChatButton;
