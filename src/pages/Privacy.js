import ContactMailIcon from '@mui/icons-material/ContactMail';
import CookieIcon from '@mui/icons-material/Cookie';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import ShareIcon from '@mui/icons-material/Share';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Typography,
} from '@mui/material';

const Privacy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const privacySections = [
    {
      id: 'information-we-collect',
      title: 'Information We Collect',
      icon: <DataUsageIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We collect information you provide directly to us, information we get from your use of our services, and information from third-party sources.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Information You Provide:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Account information (name, email, password)</Typography></li>
            <li><Typography variant="body1">Profile information (location, interests, preferences)</Typography></li>
            <li><Typography variant="body1">Content you create or share (posts, comments, messages)</Typography></li>
            <li><Typography variant="body1">Communication with us (support requests, feedback)</Typography></li>
            <li><Typography variant="body1">Payment information (processed securely by third parties)</Typography></li>
          </Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Information We Collect Automatically:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Device information (IP address, browser type, operating system)</Typography></li>
            <li><Typography variant="body1">Usage data (pages visited, features used, time spent)</Typography></li>
            <li><Typography variant="body1">Location information (with your permission)</Typography></li>
            <li><Typography variant="body1">Log data (access times, error logs, performance data)</Typography></li>
          </Box>
        </Box>
      ),
    },
    {
      id: 'how-we-use-information',
      title: 'How We Use Your Information',
      icon: <DataUsageIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We use the information we collect to provide, maintain, and improve our services:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Provide and personalize our services</Typography></li>
            <li><Typography variant="body1">Process transactions and send related information</Typography></li>
            <li><Typography variant="body1">Send technical notices, updates, and administrative messages</Typography></li>
            <li><Typography variant="body1">Respond to your comments, questions, and customer service requests</Typography></li>
            <li><Typography variant="body1">Monitor and analyze trends and usage patterns</Typography></li>
            <li><Typography variant="body1">Detect, prevent, and address security issues</Typography></li>
            <li><Typography variant="body1">Improve our AI and machine learning capabilities</Typography></li>
            <li><Typography variant="body1">Comply with legal obligations</Typography></li>
          </Box>
        </Box>
      ),
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: <ShareIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1"><strong>With your consent:</strong> When you explicitly agree to share information</Typography></li>
            <li><Typography variant="body1"><strong>Service providers:</strong> Third parties who perform services on our behalf</Typography></li>
            <li><Typography variant="body1"><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</Typography></li>
            <li><Typography variant="body1"><strong>Legal requirements:</strong> To comply with laws, regulations, or legal processes</Typography></li>
            <li><Typography variant="body1"><strong>Safety and security:</strong> To protect our users and prevent harm</Typography></li>
            <li><Typography variant="body1"><strong>Aggregated data:</strong> Non-personally identifiable information for analytics</Typography></li>
          </Box>
        </Box>
      ),
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <SecurityIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Encryption of data in transit and at rest</Typography></li>
            <li><Typography variant="body1">Regular security audits and penetration testing</Typography></li>
            <li><Typography variant="body1">Access controls and authentication measures</Typography></li>
            <li><Typography variant="body1">Employee training on data protection</Typography></li>
            <li><Typography variant="body1">Incident response procedures</Typography></li>
            <li><Typography variant="body1">Compliance with industry standards and regulations</Typography></li>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure.
          </Alert>
        </Box>
      ),
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      icon: <CookieIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to collect and use personal information about you:
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
            Types of Cookies We Use:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label="Essential Cookies" color="primary" variant="outlined" />
            <Chip label="Analytics Cookies" color="secondary" variant="outlined" />
            <Chip label="Functional Cookies" color="info" variant="outlined" />
            <Chip label="Advertising Cookies" color="warning" variant="outlined" />
          </Box>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1"><strong>Essential:</strong> Required for basic site functionality</Typography></li>
            <li><Typography variant="body1"><strong>Analytics:</strong> Help us understand how you use our service</Typography></li>
            <li><Typography variant="body1"><strong>Functional:</strong> Remember your preferences and settings</Typography></li>
            <li><Typography variant="body1"><strong>Advertising:</strong> Deliver relevant ads and measure effectiveness</Typography></li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You can control cookies through your browser settings, but disabling certain cookies may affect functionality.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: <SecurityIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have certain rights regarding your personal information:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1"><strong>Access:</strong> Request a copy of your personal information</Typography></li>
            <li><Typography variant="body1"><strong>Correction:</strong> Request correction of inaccurate information</Typography></li>
            <li><Typography variant="body1"><strong>Deletion:</strong> Request deletion of your personal information</Typography></li>
            <li><Typography variant="body1"><strong>Portability:</strong> Request transfer of your data to another service</Typography></li>
            <li><Typography variant="body1"><strong>Restriction:</strong> Request limitation of processing</Typography></li>
            <li><Typography variant="body1"><strong>Objection:</strong> Object to certain types of processing</Typography></li>
            <li><Typography variant="body1"><strong>Withdrawal:</strong> Withdraw consent for processing based on consent</Typography></li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            To exercise these rights, please contact us using the information provided below.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      icon: <SecurityIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Our service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
          </Typography>
          <Typography variant="body1" paragraph>
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete such information.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: <ShareIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </Typography>
          <Typography variant="body1" paragraph>
            We participate in data protection frameworks and use standard contractual clauses to protect your information during international transfers.
          </Typography>
        </Box>
      ),
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <DataUsageIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We retain your personal information only as long as necessary to fulfill the purposes for which it was collected:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Account information: Until you delete your account</Typography></li>
            <li><Typography variant="body1">Usage data: Typically 2-3 years for analytics purposes</Typography></li>
            <li><Typography variant="body1">Communication records: 3-7 years as required by law</Typography></li>
            <li><Typography variant="body1">Marketing data: Until you unsubscribe or object</Typography></li>
          </Box>
        </Box>
      ),
    },
    {
      id: 'policy-changes',
      title: 'Changes to This Privacy Policy',
      icon: <ContactMailIcon />,
      content: (
        <Box>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li><Typography variant="body1">Posting the new policy on this page</Typography></li>
            <li><Typography variant="body1">Sending you an email notification</Typography></li>
            <li><Typography variant="body1">Displaying a prominent notice in our service</Typography></li>
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your continued use of our service after any changes constitutes acceptance of the updated policy.
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ ml: '80px' }}> {/* Add left margin to account for fixed navigation */}
      <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Privacy Policy
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Last updated: {currentDate}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Introduction */}
          <Box sx={{ mb: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body1">
                At Konnect.kr, your privacy is our priority. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our service.
              </Typography>
            </Alert>
            <Typography variant="body1" paragraph>
              This Privacy Policy applies to our website, mobile application, and all related services. 
              By using our service, you consent to the data practices described in this policy.
            </Typography>
          </Box>

          {/* Privacy Sections as Accordions */}
          {privacySections.map((section, index) => (
            <Accordion key={section.id} sx={{ mb: 2, '&:before': { display: 'none' } }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 2 },
                }}
              >
                {section.icon}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3 }}>
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* Contact Information */}
          <Box sx={{ textAlign: 'center', p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
            <ContactMailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Questions About Privacy?
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              <Typography variant="body1">
                <strong>Email:</strong> privacy@konnect.kr
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> +82-2-1234-5678
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> Seoul, South Korea
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={() => window.location.href = 'mailto:privacy@konnect.kr'}
            >
              Contact Privacy Team
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default Privacy;
