import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
    Typography,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Close, Send } from '@mui/icons-material';
import { ragService } from '../../services';

const ChatDialog = ({ open, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            const userMessage = {
                id: messages.length + 1,
                text: input,
                sender: 'user',
            };
            setMessages([...messages, userMessage]);
            const query = input;
            setInput('');
            setIsLoading(true);

            try {
                const response = await ragService.search(query);

                const botResponse = {
                    id: messages.length + 2,
                    text: response.data.answer || 'I apologize, but I couldn\'t find an answer to your query.',
                    sender: 'bot',
                };
                setMessages(prev => [...prev, botResponse]);
            } catch (error) {
                console.error('Error fetching RAG response:',  error?.response);
                const errorResponse = {
                    id: messages.length + 2,
                    text: error?.response?.message || 'Sorry, I encountered an error while processing your request. Please try again.',
                    sender: 'bot',
                };
                setMessages(prev => [...prev, errorResponse]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle  sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                color: "#fff"
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">AI Chat Support</Typography>
                    <IconButton onClick={onClose} sx={{
                        color: "#fff"
                    }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {messages.map((message) => (
                        <ListItem key={message.id} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <ListItemText
                                primary={message.text}
                                sx={{
                                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.200',
                                    color: message.sender === 'user' ? 'white' : 'black',
                                    borderRadius: 2,
                                    p: 1,
                                    maxWidth: '70%',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    endIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatDialog;
