import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Button, TextField, Grid, 
  IconButton, Container, AppBar, Toolbar, Dialog, DialogTitle, 
  DialogContent, DialogActions, Chip
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack, Add, AutoAwesome, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const AdminPricingManager = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    priceInr: '',
    durationDays: 30,
    features: ''
  });

  const fetchAdminPlans = async () => {
    try {
      const res = await apiClient.get('/pricing/admin');
      setPlans(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdminPlans();
  }, []);

  const handleDialogOpen = () => {
    setNewPlan({
      name: '',
      description: '',
      priceInr: '',
      durationDays: 30,
      features: ''
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCreate = async () => {
    try {
      await apiClient.post('/pricing', {
        ...newPlan,
        features: newPlan.features.split(',').map(f => f.trim()).filter(f => f)
      });
      fetchAdminPlans(); // refresh list
      handleDialogClose();
    } catch (error) {
      console.error(error);
      alert('Error creating plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await apiClient.delete(`/pricing/${id}`);
        fetchAdminPlans();
      } catch (error) {
        console.error(error);
        alert('Error deleting plan');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pricing Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleDialogOpen}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Add Plan
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
          Manage Subscription Plans
        </Typography>

        {/* List Existing Plans */}
        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan, index) => {
            const isPopular = index === 1; // You could add popular flag to model later
            return (
              <Grid item xs={12} md={4} key={plan._id}>
                <Card
                  elevation={isPopular ? 8 : 0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isPopular ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    borderRadius: 4,
                    position: 'relative',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isPopular ? '0 20px 60px rgba(99,102,241,0.3)' : '0 12px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {isPopular && (
                    <Chip
                      label="Most Popular"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          background: plan.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        <AutoAwesome sx={{ fontSize: 32, color: 'white' }} />
                      </Box>
                      <IconButton color="error" onClick={() => handleDelete(plan._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                      <Typography variant="h3" fontWeight={800}>
                        ₹{plan.priceInr}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                        /{plan.durationDays} days
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                      {plan.features?.map((feature, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckCircle sx={{ color: '#10b981', fontSize: 20, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          {plans.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">No plans created yet. Click "Add Plan" to get started.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Add Plan Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Pricing Plan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Plan Name"
            name="name"
            fullWidth
            value={newPlan.name}
            onChange={e => setNewPlan({...newPlan, name: e.target.value})}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Price (INR)"
            name="priceInr"
            type="number"
            fullWidth
            value={newPlan.priceInr}
            onChange={e => setNewPlan({...newPlan, priceInr: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Duration (Days)"
            name="durationDays"
            type="number"
            fullWidth
            value={newPlan.durationDays}
            onChange={e => setNewPlan({...newPlan, durationDays: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={newPlan.description}
            onChange={e => setNewPlan({...newPlan, description: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Features (comma separated)"
            name="features"
            fullWidth
            multiline
            rows={3}
            value={newPlan.features}
            onChange={e => setNewPlan({...newPlan, features: e.target.value})}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreate}
          >
            Create Plan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPricingManager;
