import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  alpha,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  Email,
} from '@mui/icons-material';
import ExternalRedirectModal from './ExternalRedirectModal';
import ScrollToTopButton from './UI/ScrollToTopButton';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Subscription', href: '/subscription' },
      { label: 'Feedback', href: '/feedback' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-conditions' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
    resources: [
      { label: 'Documentation', href: 'https://api.triviaverse.shop/api-docs/' },
      { label: 'API Reference', href: 'https://api.triviaverse.shop/health/' },
      { label: 'Refund', href: '/refund' },
      { label: 'Tutorials', href: '/tutorial' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook fontSize="small" />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter fontSize="small" />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram fontSize="small" />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn fontSize="small" />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <GitHub fontSize="small" />, href: 'https://github.com', label: 'GitHub' },
    { icon: <Email fontSize="small" />, href: 'mailto:support@triviaverse.shop', label: 'Email' },
  ];

  const renderColumn = (title, items, interceptExternal = false) => (
    <Grid item xs={6} sm={6} md={2}>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: '#f8fafc',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.75rem',
        }}
      >
        {title}
      </Typography>
      <Stack spacing={1.25}>
        {items.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            underline="none"
            sx={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#ffffff',
              },
            }}
            onClick={
              interceptExternal
                ? (e) => {
                    if (link.label === 'Documentation' || link.label === 'API Reference') {
                      e.preventDefault();
                      setPendingUrl(link.href);
                      setModalOpen(true);
                    }
                  }
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
      </Stack>
    </Grid>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0f172a',
        color: '#f8fafc',
        py: 7,
        mt: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <ScrollToTopButton />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src="/logo192.png"
                alt="TriviaVerse Logo - Interactive Quiz Platform"
                loading="lazy"
                width="34"
                height="34"
                style={{ height: '34px', width: '34px', marginRight: '12px', borderRadius: '8px' }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 800, color: '#ffffff' }}>
                TriviaVerse
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2.5, lineHeight: 1.7, maxWidth: 320 }}>
              Master concepts faster with interactive quizzes, adaptive practice tracks,
              instant feedback, and collaborative learning leaderboards.
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={{
                    color: '#94a3b8',
                    bgcolor: alpha('#ffffff', 0.05),
                    '&:hover': {
                      color: '#ffffff',
                      bgcolor: alpha('#4f46e5', 0.35),
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {renderColumn('Company', footerLinks.company)}
          {renderColumn('Support', footerLinks.support)}
          {renderColumn('Legal', footerLinks.legal)}
          {renderColumn('Resources', footerLinks.resources, true)}
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <ExternalRedirectModal open={modalOpen} onClose={() => setModalOpen(false)} url={pendingUrl} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © {currentYear} TriviaVerse. Empowering lifelong learners worldwide.
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/privacy-policy"
              variant="body2"
              underline="none"
              sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
            >
              Privacy
            </Link>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              •
            </Typography>
            <Link
              href="/terms-conditions"
              variant="body2"
              underline="none"
              sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
            >
              Terms
            </Link>
            <Typography variant="body2" sx={{ color: '#475569' }}>
              •
            </Typography>
            <Link
              href="/sitemap.xml"
              variant="body2"
              underline="none"
              sx={{ color: '#94a3b8', '&:hover': { color: '#ffffff' } }}
            >
              Sitemap
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
