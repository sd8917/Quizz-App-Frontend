import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  Email,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
      { label: 'FAQs', href: '/faq' },
      { label: 'Feedback', href: '/feedback' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-conditions' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Community', href: '/community' },
      { label: 'Tutorials', href: '/tutorials' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <Instagram />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <GitHub />, href: 'https://github.com', label: 'GitHub' },
    { icon: <Email />, href: 'mailto:info@TriviaVerse.com', label: 'Email' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/logo192.png" 
              alt="TriviaVerse Logo - Interactive Quiz Platform" 
              loading="lazy"
              width="32"
              height="32"
              style={{ height: '32px', marginRight: '12px' }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              TriviaVerse
            </Typography>
          </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Challenge yourself, compete with others, and enhance your knowledge
              with our interactive quiz platform. Join thousands of learners
              worldwide!
            </Typography>
            {/* Social Links */}
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
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'primary.lighter',
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Support
            </Typography>
            <Stack spacing={1}>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Legal
            </Typography>
            <Stack spacing={1}>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              {footerLinks.resources.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

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
          <Typography variant="body2" color="text.secondary">
            © {currentYear} TriviaVerse. All rights reserved.
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
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Privacy
            </Link>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Link
              href="/terms-conditions"
              variant="body2"
              underline="none"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              Terms
            </Link>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Link
              href="/sitemap"
              variant="body2"
              underline="none"
              sx={{
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
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
