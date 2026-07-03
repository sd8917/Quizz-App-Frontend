import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Chip,
    Tooltip,
    useTheme,
    useMediaQuery,
    Collapse
} from '@mui/material';
import {
    Close,
    Send,
    AutoAwesome,
    Delete,
    Add,
    Menu,
    ArrowBack,
    MenuBook,
    Psychology,
    AssignmentInd,
    Dns,
    Star,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { ragService } from '../../services';

const ChatDialog = ({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [messages, setMessages] = useState([
        { id: 'welcome', text: 'Hello! I am your TriviaVerse AI assistant. Ask me anything about users, quiz channels, questions, or attempts!', sender: 'bot', sources: [] },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [expandedSources, setExpandedSources] = useState({});

    const messagesEndRef = useRef(null);

    // Fetch sessions when dialog opens
    useEffect(() => {
        if (open) {
            fetchSessions();
        }
    }, [open]);

    // Adjust sidebar when screen size changes
    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchSessions = async () => {
        setLoadingSessions(true);
        try {
            const response = await ragService.getSessions();
            if (response.success && response.data) {
                setSessions(response.data);
            }
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleLoadSession = async (sessionId) => {
        setIsLoading(true);
        setCurrentSessionId(sessionId);
        if (isMobile) {
            setSidebarOpen(false);
        }
        try {
            const response = await ragService.getSession(sessionId);
            if (response.success && response.data) {
                const sessionData = response.data;
                const mappedMessages = sessionData.messages.map((msg, idx) => ({
                    id: msg._id || idx,
                    text: msg.content,
                    sender: msg.role === 'user' ? 'user' : 'bot',
                    timestamp: msg.timestamp,
                    sources: [] // Past messages don't store source citations in DB
                }));

                if (mappedMessages.length === 0) {
                    setMessages([
                        { id: 'welcome', text: 'This session has no messages yet. Ask a question to get started!', sender: 'bot', sources: [] }
                    ]);
                } else {
                    setMessages(mappedMessages);
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            setMessages([
                { id: 'error', text: 'Failed to load session history. Please try again.', sender: 'bot', isError: true }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setCurrentSessionId(null);
        setMessages([
            { id: 'welcome', text: 'Started a new session. Ask me anything about TriviaVerse!', sender: 'bot', sources: [] }
        ]);
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleDeleteSession = async (e, sessionId) => {
        e.stopPropagation(); // Avoid loading the session when deleting it
        try {
            const response = await ragService.deleteSession(sessionId);
            if (response.success) {
                setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
                if (currentSessionId === sessionId) {
                    handleNewChat();
                }
            }
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userQuery = input;
        setInput('');

        // Add user message to state
        const userMessage = {
            id: Date.now(),
            text: userQuery,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await ragService.search(userQuery, currentSessionId);

            if (response.success && response.data) {
                const { answer, sources, metadata } = response.data;

                const botResponse = {
                    id: Date.now() + 1,
                    text: answer || 'No response generated.',
                    sender: 'bot',
                    sources: sources || [],
                    timestamp: new Date(),
                    metadata: metadata
                };

                setMessages(prev => [...prev, botResponse]);

                // Update session details if a new one was initialized
                if (metadata?.sessionId && metadata.sessionId !== currentSessionId) {
                    setCurrentSessionId(metadata.sessionId);
                    fetchSessions();
                } else {
                    // Update active last message in local sidebar view
                    setSessions(prev => prev.map(s => {
                        if (s.sessionId === currentSessionId) {
                            return {
                                ...s,
                                lastMessage: { role: 'model', content: answer },
                                messageCount: s.messageCount + 2,
                                updatedAt: new Date().toISOString()
                            };
                        }
                        return s;
                    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
                }
            }
        } catch (error) {
            console.error('Error fetching RAG response:', error);
            const errorMsg = error?.response?.data?.message || 'Sorry, I encountered an error while processing your request. Please try again.';

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: errorMsg,
                sender: 'bot',
                isError: true,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleSourceExpand = (sourceId) => {
        setExpandedSources(prev => ({
            ...prev,
            [sourceId]: !prev[sourceId]
        }));
    };

    const getSourceIcon = (type) => {
        switch (type) {
            case 'user': return <Psychology fontSize="small" sx={{ color: '#6366f1' }} />;
            case 'channel': return <Dns fontSize="small" sx={{ color: '#10b981' }} />;
            case 'question': return <MenuBook fontSize="small" sx={{ color: '#3b82f6' }} />;
            case 'attempt': return <AssignmentInd fontSize="small" sx={{ color: '#ec4899' }} />;
            default: return <AutoAwesome fontSize="small" />;
        }
    };

    const getSourceColor = (type) => {
        switch (type) {
            case 'user': return { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1' };
            case 'channel': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' };
            case 'question': return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
            case 'attempt': return { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899' };
            default: return { bg: 'rgba(102, 126, 234, 0.15)', text: '#667eea' };
        }
    };

    // Glassmorphic paper styling
    const glassPaperStyle = {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        borderRadius: '12px',
        overflow: 'hidden'
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: glassPaperStyle }}
        >
            {/* Header */}
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#fff',
                padding: '16px 24px',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)'
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        {isMobile && (
                            <IconButton
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                sx={{ color: '#fff', mr: 0.5 }}
                            >
                                <Menu />
                            </IconButton>
                        )}
                        <AutoAwesome />
                        <Typography variant="h6" fontWeight={700}>TriviaVerse RAG Chatbot</Typography>
                        <Chip
                            label="Gemini 2.5 + Re-ranking"
                            size="small"
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.7rem'
                            }}
                        />
                    </Box>
                    <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', height: '65vh', width: '100%', position: 'relative', overflow: 'hidden' }}>

                    {/* Sidebar: Chat History */}
                    <Collapse
                        in={sidebarOpen}
                        orientation="horizontal"
                        sx={{
                            height: '100%',
                            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                            background: 'rgba(248, 250, 252, 0.6)',
                            width: sidebarOpen ? (isMobile ? '100%' : '280px') : '0px',
                            minWidth: sidebarOpen ? (isMobile ? '100%' : '280px') : '0px',
                            position: isMobile ? 'absolute' : 'relative',
                            zIndex: 10,
                            '& .MuiCollapse-wrapperInner': {
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }
                        }}
                    >
                        {/* New Chat Button */}
                        <Box sx={{ p: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleNewChat}
                                sx={{
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                New Chat
                            </Button>
                        </Box>

                        <Divider sx={{ opacity: 0.6 }} />

                        {/* Sessions List */}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                            <Typography variant="caption" sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 600, display: 'block' }}>
                                CHAT HISTORY
                            </Typography>
                            {loadingSessions ? (
                                <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : sessions.length === 0 ? (
                                <Box textAlign="center" p={3}>
                                    <Typography variant="body2" color="text.secondary">No previous sessions</Typography>
                                </Box>
                            ) : (
                                <List sx={{ p: 0 }}>
                                    {sessions.map((session) => {
                                        const isActive = session.sessionId === currentSessionId;
                                        const lastMsgText = session.lastMessage?.content || 'Empty Chat';

                                        return (
                                            <ListItem
                                                button
                                                key={session.sessionId}
                                                onClick={() => handleLoadSession(session.sessionId)}
                                                sx={{
                                                    borderRadius: '8px',
                                                    mb: 0.5,
                                                    bgcolor: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                                    '&:hover': {
                                                        bgcolor: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                                                    },
                                                    transition: 'all 0.2s',
                                                    px: 2,
                                                    py: 1
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            variant="subtitle2"
                                                            noWrap
                                                            sx={{
                                                                color: isActive ? 'primary.main' : 'text.primary',
                                                                fontWeight: isActive ? 700 : 500
                                                            }}
                                                        >
                                                            {lastMsgText}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(session.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                    }
                                                />
                                                <ListItemSecondaryAction sx={{ right: 8 }}>
                                                    <Tooltip title="Delete Session">
                                                        <IconButton
                                                            edge="end"
                                                            size="small"
                                                            onClick={(e) => handleDeleteSession(e, session.sessionId)}
                                                            sx={{
                                                                color: 'text.secondary',
                                                                '&:hover': { color: 'error.main' },
                                                                opacity: 0.7
                                                            }}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Box>
                    </Collapse>

                    {/* Main Chat Interface */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            width: 0,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        {!sidebarOpen && (
                            <Box sx={{
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                bgcolor: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(10px)',
                                position: 'sticky',
                                top: 0,
                                zIndex: 5
                            }}>
                                <Button
                                    startIcon={<ArrowBack />}
                                    onClick={() => setSidebarOpen(true)}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'rgba(99, 102, 241, 0.08)'
                                        }
                                    }}
                                >
                                    Go back
                                </Button>
                            </Box>
                        )}

                        {/* Messages List Area */}
                        <Box sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 3,
                            bgcolor: 'rgba(255,255,255,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {messages.map((message) => {
                                const isUser = message.sender === 'user';
                                return (
                                    <Box
                                        key={message.id}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: isUser ? 'flex-end' : 'flex-start',
                                            width: '100%'
                                        }}
                                    >
                                        {/* Message Bubble */}
                                        <Box sx={{
                                            bgcolor: isUser ? 'primary.main' : 'rgba(255, 255, 255, 0.9)',
                                            color: isUser ? 'white' : 'text.primary',
                                            borderRadius: '8px',
                                            p: 2,
                                            maxWidth: '85%',
                                            boxShadow: isUser ? '0 4px 12px rgba(99, 102, 241, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.04)',
                                            border: isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
                                            position: 'relative'
                                        }}>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                {message.text}
                                            </Typography>
                                        </Box>

                                        {/* Timestamp */}
                                        {message.timestamp && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mx: 1, fontSize: '0.65rem' }}>
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        )}

                                        {/* Source Citations */}
                                        {!isUser && message.sources && message.sources.length > 0 && (
                                            <Box sx={{ mt: 1.5, width: '100%', maxWidth: '85%' }}>
                                                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', fontWeight: 700, mb: 1, ml: 1 }}>
                                                    <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                                                    Retrieved Sources & Relevance Scores:
                                                </Typography>

                                                <Box display="flex" flexDirection="column" gap={1}>
                                                    {message.sources.map((source, sIdx) => {
                                                        const sType = source.metadata?.type || 'unknown';
                                                        const sColors = getSourceColor(sType);
                                                        const isExpanded = expandedSources[`${message.id}-${sIdx}`];

                                                        // Format Scores
                                                        const baseScore = source.score ? `${(source.score * 100).toFixed(0)}%` : null;
                                                        const reRankScore = source.reRankScore ? `${(source.reRankScore * 100).toFixed(0)}%` : null;

                                                        return (
                                                            <Card
                                                                key={sIdx}
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                                                    boxShadow: 'none',
                                                                    bgcolor: 'rgba(255, 255, 255, 0.7)'
                                                                }}
                                                            >
                                                                <CardContent sx={{ p: '12px !important' }}>
                                                                    {/* Source Card Header */}
                                                                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                                                                        <Box display="flex" alignItems="center" gap={1}>
                                                                            <Chip
                                                                                icon={getSourceIcon(sType)}
                                                                                label={sType.toUpperCase()}
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: sColors.bg,
                                                                                    color: sColors.text,
                                                                                    fontWeight: 700,
                                                                                    fontSize: '0.65rem',
                                                                                    height: 20
                                                                                }}
                                                                            />
                                                                            {source.metadata?.name && (
                                                                                <Typography variant="caption" fontWeight={600} color="text.primary">
                                                                                    {source.metadata.name}
                                                                                </Typography>
                                                                            )}
                                                                            {source.metadata?.username && (
                                                                                <Typography variant="caption" fontWeight={600} color="text.primary">
                                                                                    @{source.metadata.username}
                                                                                </Typography>
                                                                            )}
                                                                        </Box>

                                                                        {/* Relevance Badges */}
                                                                        <Box display="flex" gap={0.5}>
                                                                            {baseScore && (
                                                                                <Chip
                                                                                    label={`Vector: ${baseScore}`}
                                                                                    size="small"
                                                                                    sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#f1f5f9', color: '#475569' }}
                                                                                />
                                                                            )}
                                                                            {reRankScore && (
                                                                                <Chip
                                                                                    label={`Re-ranked Match: ${reRankScore}`}
                                                                                    size="small"
                                                                                    color="secondary"
                                                                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }}
                                                                                />
                                                                            )}
                                                                        </Box>
                                                                    </Box>

                                                                    {/* Source Text Content Toggle */}
                                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                        <Typography variant="caption" color="text.secondary" sx={{
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            display: '-webkit-box',
                                                                            WebkitLineClamp: isExpanded ? 'unset' : 1,
                                                                            WebkitBoxOrient: 'vertical',
                                                                            width: '90%',
                                                                            fontStyle: 'italic'
                                                                        }}>
                                                                            "{source.text}"
                                                                        </Typography>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => toggleSourceExpand(`${message.id}-${sIdx}`)}
                                                                            sx={{ ml: 1, p: 0 }}
                                                                        >
                                                                            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                                                                        </IconButton>
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        );
                                                    })}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}

                            {/* Loading State Bubble */}
                            {isLoading && (
                                <Box display="flex" justifyContent="flex-start" width="100%">
                                    <Box sx={{
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        color: 'text.primary',
                                        borderRadius: '8px',
                                        p: 2,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                                        border: '1px solid rgba(0, 0, 0, 0.05)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5
                                    }}>
                                        <CircularProgress size={16} />
                                        <Typography variant="body2" color="text.secondary">Thinking...</Typography>
                                    </Box>
                                </Box>
                            )}

                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input Area */}
                        <Box sx={{
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.7)',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <TextField
                                onClick={() => { }}
                                fullWidth
                                multiline
                                maxRows={3}
                                placeholder="Type your question about channels, questions, attempts..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                disabled={isLoading}
                                size="small"
                                sx={{
                                    bgcolor: '#fff',
                                    borderRadius: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!input.trim() || isLoading}
                                onClick={handleSend}
                                sx={{
                                    minWidth: 48,
                                    width: 48,
                                    height: 40,
                                    borderRadius: '8px',
                                    p: 0,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                                }}
                            >
                                <Send fontSize="small" />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ChatDialog;
