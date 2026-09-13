import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material';
import apiClient from '../services/api';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await apiClient.get('/payment/history');
        if (response.data?.success || response.data?.data) {
          setPayments(response.data.data || response.data);
        } else if (Array.isArray(response.data)) {
            setPayments(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payments', error);
        setError('Could not load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const downloadReceipt = async (paymentId) => {
    try {
      // We use responseType: 'blob' because the backend sends a PDF file
      const response = await apiClient.get(`/payment/receipt/${paymentId}`, {
        responseType: 'blob',
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download receipt', error);
      alert('Failed to download receipt');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Payment History
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {payments.length === 0 && !error ? (
        <Typography color="text.secondary">No payment history found.</Typography>
      ) : (
        payments.map(payment => (
          <Card key={payment._id} elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
              <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {payment.planId ? (payment.planId.name || 'Subscription') : 'Subscription'} - ₹{payment.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(payment.createdAt).toLocaleDateString()}
                </Typography>
                <Chip 
                  label={payment.status?.toUpperCase() || 'PAID'} 
                  color={(payment.status || 'paid').toLowerCase() === 'paid' ? 'success' : 'default'} 
                  size="small" 
                  sx={{ mt: 1 }} 
                />
              </Box>
              
              {(payment.status || 'paid').toLowerCase() === 'paid' && (
                <Button variant="outlined" onClick={() => downloadReceipt(payment._id)}>
                  Download Receipt
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default PaymentHistory;
