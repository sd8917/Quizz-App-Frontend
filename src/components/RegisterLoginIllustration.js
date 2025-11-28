import React from 'react';
import { Box } from '@mui/material';

const RegisterLoginIllustration = ({ sx }) => (
  <Box sx={{ width: '100%', ...sx }}>
    <svg viewBox="0 0 700 420" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect width="700" height="420" rx="16" fill="#fff" stroke="#eef2ff" />

      {/* left card: Register */}
      <rect x="36" y="36" width="300" height="340" rx="12" fill="#f8fafc" stroke="#e6eefc" />
      <circle cx="86" cy="96" r="36" fill="url(#g1)" />
      <text x="86" y="104" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fill="white" textAnchor="middle">R</text>
      <text x="160" y="80" fontFamily="Arial" fontSize="18" fill="#0f172a">Register</text>
      <text x="160" y="110" fontFamily="Arial" fontSize="13" fill="#475569">Create your account with email</text>
      <rect x="60" y="150" width="220" height="36" rx="8" fill="#fff" stroke="#e6eefc" />
      <rect x="60" y="200" width="220" height="36" rx="8" fill="#fff" stroke="#e6eefc" />
      <rect x="60" y="250" width="140" height="36" rx="8" fill="#667eea" />
      <text x="130" y="276" fontFamily="Arial" fontSize="13" fill="white" textAnchor="middle">Create Account</text>

      {/* right card: Login */}
      <rect x="364" y="36" width="300" height="340" rx="12" fill="#f8fafc" stroke="#e6eefc" />
      <circle cx="414" cy="96" r="36" fill="#10B981" />
      <text x="414" y="104" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fill="white" textAnchor="middle">L</text>
      <text x="488" y="80" fontFamily="Arial" fontSize="18" fill="#0f172a">Login</text>
      <text x="488" y="110" fontFamily="Arial" fontSize="13" fill="#475569">Access your account</text>
      <rect x="388" y="150" width="220" height="36" rx="8" fill="#fff" stroke="#e6eefc" />
      <rect x="388" y="200" width="220" height="36" rx="8" fill="#fff" stroke="#e6eefc" />
      <rect x="388" y="250" width="140" height="36" rx="8" fill="#06b6d4" />
      <text x="458" y="276" fontFamily="Arial" fontSize="13" fill="white" textAnchor="middle">Sign In</text>

      {/* footer tag */}
      <text x="350" y="392" fontFamily="Arial" fontSize="12" fill="#94a3b8" textAnchor="middle">Register & Login — quick and secure</text>
    </svg>
  </Box>
);

export default RegisterLoginIllustration;
