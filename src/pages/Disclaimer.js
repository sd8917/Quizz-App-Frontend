import React from 'react';
import { Box, Container, Paper, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Disclaimer = () => {
  const navigate = useNavigate();

  const htmlContent = `
    <h1>Disclaimer</h1>
    <p>Last updated: November 28, 2025</p>
    <h2>Interpretation and Definitions</h2>
    <h4>Interpretation</h4>
    <p>The words whose initial letters are capitalized have meanings defined under the following conditions.
    The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
    <h4>Definitions</h4>
    <p>For the purposes of this Disclaimer:</p>
    <ul>
      <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Disclaimer) refers to triviaverse.</li>
      <li><strong>Service</strong> refers to the Website.</li>
      <li><strong>You</strong> means the individual accessing the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
      <li><strong>Website</strong> refers to triviaverse, accessible from <a href="https://triviaverse.site/" rel="external nofollow noopener" target="_blank">https://triviaverse.site/</a></li>
    </ul>
    <h2>Disclaimer</h2>
    <p>The information contained on the Service is for general information purposes only.</p>
    <p>The Company assumes no responsibility for errors or omissions in the contents of the Service.</p>
    <p>In no event shall the Company be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service. The Company reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. This Disclaimer has been created with the help of the <a href="https://www.freeprivacypolicy.com/free-disclaimer-generator/" target="_blank" rel="noopener noreferrer">Free Disclaimer Generator</a>.</p>
    <p>The Company does not warrant that the Service is free of viruses or other harmful components.</p>
    <h2>External Links Disclaimer</h2>
    <p>The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with the Company.</p>
    <p>Please note that the Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>
    <h2>Errors and Omissions Disclaimer</h2>
    <p>The information given by the Service is for general guidance on matters of interest only. Even if the Company takes every precaution to ensure that the content of the Service is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules and regulations, there may be delays, omissions or inaccuracies in the information contained on the Service.</p>
    <p>The Company is not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
    <h2>Fair Use Disclaimer</h2>
    <p>The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.</p>
    <p>The Company believes this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the United States Copyright law.</p>
    <p>If You wish to use copyrighted material from the Service for your own purposes that go beyond fair use, You must obtain permission from the copyright owner.</p>
    <h2>Views Expressed Disclaimer</h2>
    <p>The Service may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other author, agency, organization, employer or company, including the Company.</p>
    <p>Comments published by users are their sole responsibility and the users will take full responsibility, liability and blame for any libel or litigation that results from something written in or as a direct result of something written in a comment. The Company is not liable for any comment published by users and reserves the right to delete any comment for any reason whatsoever.</p>
    <h2>No Responsibility Disclaimer</h2>
    <p>The information on the Service is provided with the understanding that the Company is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal or other competent advisers.</p>
    <p>In no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the Service.</p>
    <h2>"Use at Your Own Risk" Disclaimer</h2>
    <p>All information in the Service is provided "as is", with no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information, and without warranty of any kind, express or implied, including, but not limited to warranties of performance, merchantability and fitness for a particular purpose.</p>
    <p>The Company will not be liable to You or anyone else for any decision made or action taken in reliance on the information given by the Service or for any consequential, special or similar damages, even if advised of the possibility of such damages.</p>
    <h2>Contact Us</h2>
    <p>If you have any questions about this Disclaimer, You can contact Us:</p>
    <ul>
      <li>By email: triviaverse.contact@gmail.com</li>
      <li>By visiting this page on our website: <a href="https://triviaverse.site/contact" rel="external nofollow noopener" target="_blank">https://triviaverse.site/contact</a></li>
    </ul>
  `;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Disclaimer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Paper sx={{ p: { xs: 3, md: 4 } }} elevation={2}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default Disclaimer;
