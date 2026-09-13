import React, { useState } from 'react';
import { Button } from '@mui/material';
import apiClient from '../services/api';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutButton = ({ amount = 500, planId, onSuccess, onError, buttonText, fullWidth, size, disabled, sx, variant = "contained" }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 0. Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Please check your connection or disable adblockers.');
        setLoading(false);
        return;
      }

      // 1. Create Order on your backend
      const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
      
      const orderRes = await apiClient.post('/payment/create-order', {
        amount: numericAmount,
        currency: 'INR', // or let backend decide or pass as prop
        planId: planId
      });

      // The backend returns { success: true, data: { id: "order_...", amount: ... } }
      // Adapting based on standard backend structure
      const order = orderRes.data?.data || orderRes.data;

      // 2. Setup Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyId', // Use env variable or placeholder
        amount: order.amount, // Amount in paise as returned from backend
        currency: order.currency || 'INR',
        name: 'TriviaVerse',
        description: 'Premium Quiz Subscription',
        order_id: order.id,
        handler: async function (response) {
          // 3. This runs automatically when the user pays successfully
          try {
            const verifyRes = await apiClient.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success || verifyRes.status === 200) {
              if (onSuccess) onSuccess(response);
              else alert('Payment Successful!');
            }
          } catch (verifyError) {
            console.error('Verification failed', verifyError);
            if (onError) onError(verifyError);
            else alert('Payment verification failed.');
          }
        },
        prefill: {
          name: 'User', // Can be dynamic
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#6366f1', // Matching the theme from Subscription.js
        },
        config: {
          display: {
            blocks: {
              preferred: {
                name: 'Pay using Card or UPI (QR)',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' }
                ]
              }
            },
            sequence: ['block.preferred'],
            preferences: {
              show_default_blocks: false
            }
          }
        }
      };

      // 4. Open Razorpay Checkout Modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error(response.error);
        if (onError) onError(response.error);
        else alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      if (onError) onError(error);
      else alert('Could not start payment process.');
    } finally {
      setLoading(false);
    }
  };

  // We export a button that can be styled using Material UI props if needed, or normal HTML props
  return (
    <Button
      onClick={handlePayment}
      disabled={loading || disabled}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      sx={sx}
    >
      {loading ? 'Processing...' : (buttonText || `Pay ₹${amount}`)}
    </Button>
  );
};

export default CheckoutButton;
