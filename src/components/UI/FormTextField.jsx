import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

/**
 * Reusable form text field component with common patterns
 * Supports icons, password visibility toggle, and error states
 */
const FormTextField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  type = 'text',
  icon: Icon,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  fullWidth = true,
  required = false,
  sx = {},
  ...props
}) => {
  const inputProps = {};
  
  if (Icon) {
    inputProps.startAdornment = (
      <InputAdornment position="start">
        <Icon color="action" />
      </InputAdornment>
    );
  }

  if (showPasswordToggle && type === 'password') {
    inputProps.endAdornment = (
      <InputAdornment position="end">
        <IconButton
          onClick={onTogglePassword}
          edge="end"
          disabled={disabled}
          aria-label="toggle password visibility"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    );
  }

  return (
    <TextField
      fullWidth={fullWidth}
      name={name}
      label={label}
      type={showPasswordToggle && showPassword ? 'text' : type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      disabled={disabled}
      required={required}
      InputProps={inputProps}
      sx={{ mb: 2.5, ...sx }}
      {...props}
    />
  );
};

export default FormTextField;
