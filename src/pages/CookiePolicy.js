import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Link,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            TriviaVerse
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 8, flex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(139, 92, 246, 0.02) 100%)',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Cookies Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Last updated: November 25, 2025
          </Typography>
          <Typography variant="body1" paragraph>
            This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used. This Cookies Policy has been created with the help of the{' '}
            <Link href="https://www.freeprivacypolicy.com/free-cookies-policy-generator/" target="_blank" rel="noopener">
              Free Cookies Policy Generator
            </Link>
            .
          </Typography>
          <Typography variant="body1" paragraph>
            Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.
          </Typography>
          <Typography variant="body1" paragraph>
            We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.
          </Typography>

          <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 600, color: '#667eea' }}>
            Interpretation and Definitions
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            Interpretation
          </Typography>
          <Typography variant="body1" paragraph>
            The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            Definitions
          </Typography>
          <Typography variant="body1" paragraph>
            For the purposes of this Cookies Policy:
          </Typography>
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 2 } }}>
            <li>
              <Typography variant="body1">
                <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to triviaverse.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Website</strong> refers to triviaverse, accessible from{' '}
                <Link href="http://triviaverse.s3-website.ap-south-1.amazonaws.com/" target="_blank" rel="noopener">
                  http://triviaverse.s3-website.ap-south-1.amazonaws.com/
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.
              </Typography>
            </li>
          </Box>

          <Typography variant="h4" gutterBottom sx={{ mt: 4, fontWeight: 600, color: '#667eea' }}>
            The use of the Cookies
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            Type of Cookies We Use
          </Typography>
          <Typography variant="body1" paragraph>
            Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
          </Typography>
          <Typography variant="body1" paragraph>
            We use both session and persistent Cookies for the purposes set out below:
          </Typography>
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 3 } }}>
            <li>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Necessary / Essential Cookies
              </Typography>
              <Typography variant="body2" paragraph>
                Type: Session Cookies
              </Typography>
              <Typography variant="body2" paragraph>
                Administered by: Us
              </Typography>
              <Typography variant="body2">
                Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Functionality Cookies
              </Typography>
              <Typography variant="body2" paragraph>
                Type: Persistent Cookies
              </Typography>
              <Typography variant="body2" paragraph>
                Administered by: Us
              </Typography>
              <Typography variant="body2">
                Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
              </Typography>
            </li>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            Your Choices Regarding Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any time.
          </Typography>
          <Typography variant="body1" paragraph>
            If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.
          </Typography>
          <Typography variant="body1" paragraph>
            If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.
          </Typography>
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 2 } }}>
            <li>
              <Typography variant="body1">
                For the Chrome web browser, please visit this page from Google:{' '}
                <Link href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener">
                  https://support.google.com/accounts/answer/32050
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                For the Internet Explorer web browser, please visit this page from Microsoft:{' '}
                <Link href="http://support.microsoft.com/kb/278835" target="_blank" rel="noopener">
                  http://support.microsoft.com/kb/278835
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                For the Firefox web browser, please visit this page from Mozilla:{' '}
                <Link href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener">
                  https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
                </Link>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                For the Safari web browser, please visit this page from Apple:{' '}
                <Link href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener">
                  https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
                </Link>
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            For any other web browser, please visit your web browser's official web pages.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            More Information about Cookies
          </Typography>
          <Typography variant="body1" paragraph>
            You can learn more about cookies:{' '}
            <Link href="https://www.freeprivacypolicy.com/blog/cookies/" target="_blank" rel="noopener">
              Cookies: What Do They Do?
            </Link>
            .
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Cookies Policy, You can contact us:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <Typography variant="body1">
                By email: triviaverse.contact@gmail.com
              </Typography>
            </li>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default CookiePolicy;
