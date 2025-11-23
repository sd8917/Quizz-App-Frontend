import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Delete,
  Search,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle,
  Terminal,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import apiClient from '../services/api';

const ServerLogs = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const [currentTab, setCurrentTab] = useState(0);
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Check if user is admin
  useEffect(() => {
    const userRole = authUser?.roles?.[0] || authUser?.role;
    if (userRole?.toLowerCase() !== 'admin') {
      navigate('/dashboard');
    }
     // eslint-disable-next-line
  }, [authUser, navigate]);

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line
  }, [currentTab, currentPage, pageSize]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const logType = currentTab === 0 ? '' : 'errors';
      const response = await apiClient.get(`/logs/${logType}`, {
        params: {
          page: currentPage,
          pageSize: pageSize,
        }
      });
      const logsData = logType === "errors" ? response?.data?.data?.errors : response?.data?.data?.logs || [];
      const total = response.data?.data?.total || 0;
      const pages = response.data?.data?.totalPages || 0;
      
      setLogs(Array.isArray(logsData) ? logsData : []);
      setTotalLogs(total);
      setTotalPages(pages);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch server logs');
      setLogs([]);
      setTotalLogs(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLogs = async () => {
    setDeleting(true);
    try {
      const logType = currentTab === 0 ? 'combined' : 'error';
      await apiClient.delete(`/logs/${logType}`);
      
      setSnackbar({
        open: true,
        message: 'Logs deleted successfully',
        severity: 'success',
      });
      setOpenDeleteDialog(false);
      setCurrentPage(1);
      fetchLogs();
    } catch (err) {
      console.error('Error deleting logs:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete logs',
        severity: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const getLogLevelIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'warn':
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'info.main' }} />;
      case 'success':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      default:
        return <Terminal sx={{ color: 'text.secondary' }} />;
    }
  };

  const getLogLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'error.main';
      case 'warn':
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      case 'success':
        return 'success.main';
      default:
        return 'text.secondary';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      log.message?.toLowerCase().includes(searchLower) ||
      log.level?.toLowerCase().includes(searchLower) ||
      log.timestamp?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Terminal sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Server Logs
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchLogs}
            disabled={loading}
            sx={{
              mr: 2,
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setOpenDeleteDialog(true)}
            disabled={loading || logs.length === 0}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: '#ef4444',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Clear Logs
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Terminal />
                  Combined Logs
                  <Chip label={totalLogs} size="small" color="primary" />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ErrorIcon />
                  Error Logs
                  <Chip label={totalLogs} size="small" color="error" />
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Filters and Page Size */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              fullWidth
              placeholder="Search logs by message, level, or timestamp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                label="Per Page"
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Logs Display */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : filteredLogs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Terminal sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? 'No logs found matching your search' : 'No logs available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchQuery ? 'Try a different search query' : 'Server logs will appear here when generated'}
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalLogs)} of {totalLogs} logs
            </Typography>
            {filteredLogs.map((log, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  borderLeft: 4,
                  borderColor: getLogLevelColor(log.level),
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {getLogLevelIcon(log.level)}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Chip
                          label={log.level?.toUpperCase() || 'LOG'}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: `${getLogLevelColor(log.level)}15`,
                            color: getLogLevelColor(log.level),
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {log.timestamp || new Date().toISOString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          bgcolor: 'grey.50',
                          p: 1.5,
                          borderRadius: 1,
                        }}
                      >
                        {log.message || JSON.stringify(log, null, 2)}
                      </Typography>
                      {log.stack && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                            Stack Trace:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: 'monospace',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              display: 'block',
                              bgcolor: 'error.lighter',
                              p: 1.5,
                              borderRadius: 1,
                              color: 'error.dark',
                            }}
                          >
                            {log.stack}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => !deleting && setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          Clear {currentTab === 0 ? 'Combined' : 'Error'} Logs?
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all {currentTab === 0 ? 'combined' : 'error'} logs? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteLogs}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete Logs'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
          }}
        >
          {snackbar.message}
        </Alert>
      )}

      <Footer />
    </Box>
  );
};

export default ServerLogs;
