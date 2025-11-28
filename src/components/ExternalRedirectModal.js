import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ExternalRedirectModal = ({ open, onClose, url, host }) => {
  const handleContinue = () => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // fallback
      window.location.href = url;
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="external-redirect-title">
      <DialogTitle id="external-redirect-title">You are leaving TriviaVerse</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" color="text.primary">
            You are about to be redirected to an external site:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, wordBreak: 'break-all' }}>
            {url}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            TriviaVerse is responsible for the content on external sites. Do you want to continue?
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleContinue} variant="contained" color="primary">Continue</Button>
      </DialogActions>
    </Dialog>
  );
};

ExternalRedirectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string,
  host: PropTypes.string,
};

ExternalRedirectModal.defaultProps = {
  url: '',
  host: '',
};

export default ExternalRedirectModal;
