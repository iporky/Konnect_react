import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';

const Terms = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By using our service or signing up, you agree to these terms of service and our privacy policy. If you do not agree to these terms, please do not use our service.',
    },
    {
      title: '2. Description of Service',
      content: 'Konnect.kr provides a comprehensive platform for foreigners in Korea, offering AI-powered chat support, cultural resources, community features, and educational content to help users navigate life in Korea.',
    },
    {
      title: '3. User Accounts',
      content: 'You may need to create an account to access certain features. You must provide accurate information when creating an account and are responsible for keeping your account credentials confidential.',
      subsections: [
        'You must be at least 18 years old to create an account',
        'One person may not maintain more than one account',
        'You are responsible for all activity under your account',
        'You must notify us immediately of any security breaches',
      ],
    },
    {
      title: '4. User Conduct',
      content: 'You agree not to use the service for any unlawful or prohibited activities, including but not limited to:',
      subsections: [
        'Posting illegal, harmful, or offensive content',
        'Infringing on others\' intellectual property rights',
        'Disrupting the service or other users\' experience',
        'Attempting to gain unauthorized access to our systems',
        'Spreading misinformation or spam',
      ],
    },
    {
      title: '5. Intellectual Property',
      content: 'All content, features, and functionality of our service are owned by Konnect.kr and are protected by copyright, trademark, and other intellectual property laws.',
      subsections: [
        'You retain rights to content you create and share',
        'You grant us a license to use your content for service operation',
        'You may not reproduce, distribute, or create derivative works',
        'Respect third-party intellectual property rights',
      ],
    },
    {
      title: '6. Privacy and Data Protection',
      content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.',
    },
    {
      title: '7. Service Availability',
      content: 'We strive to provide reliable service but cannot guarantee 100% uptime. We reserve the right to modify, suspend, or discontinue any part of our service with or without notice.',
    },
    {
      title: '8. Payment and Subscriptions',
      content: 'Some features may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to change our pricing with reasonable notice.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'To the maximum extent permitted by law, Konnect.kr shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our service.',
    },
    {
      title: '10. Termination',
      content: 'We may terminate or suspend your account and access to our service immediately, without prior notice, for conduct that we believe violates these terms or is harmful to other users.',
    },
    {
      title: '11. Governing Law',
      content: 'These terms are governed by and construed in accordance with the laws of South Korea, without regard to conflict of law principles.',
    },
    {
      title: '12. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our service. Continued use constitutes acceptance of modified terms.',
    },
    {
      title: '13. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us at legal@konnect.kr or through our support channels.',
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
              Terms of Service
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Last updated: {currentDate}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Introduction */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              Welcome to Konnect.kr. These Terms of Service ("Terms") govern your use of our website, 
              mobile application, and related services (collectively, the "Service") operated by Konnect.kr.
            </Typography>
            <Typography variant="body1" paragraph>
              Please read these Terms carefully before using our Service. By accessing or using our Service, 
              you agree to be bound by these Terms. If you disagree with any part of these terms, 
              then you may not access the Service.
            </Typography>
          </Box>

          {/* Terms Sections */}
          {sections.map((section, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {section.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {section.content}
              </Typography>
              {section.subsections && (
                <Box component="ul" sx={{ mt: 2, pl: 3 }}>
                  {section.subsections.map((subsection, subIndex) => (
                    <Box component="li" key={subIndex} sx={{ mb: 1 }}>
                      <Typography variant="body1">{subsection}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              For questions about these terms, please contact us at{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                legal@konnect.kr
              </Box>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default Terms;
