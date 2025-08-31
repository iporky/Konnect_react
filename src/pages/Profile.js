import {
  Delete,
  Edit,
  Email,
  LocationOn,
  Logout,
  Notifications,
  Person,
  Phone,
  Security
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
// ThemeToggle removed per request

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+82-10-1234-5678',
    location: 'Seoul, South Korea',
    bio: 'Digital nomad exploring Korean culture and technology.',
    status: 'Student',
    visa: 'D-2 Student Visa',
    language: 'English',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    smsNotifications: false,
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: <Person />,
      fields: [
        { key: 'name', label: 'Full Name', value: profileData.name, type: 'text' },
        { key: 'email', label: 'Email', value: profileData.email, type: 'email' },
        { key: 'phone', label: 'Phone', value: profileData.phone, type: 'tel' },
        { key: 'location', label: 'Location', value: profileData.location, type: 'text' },
        { key: 'bio', label: 'Bio', value: profileData.bio, type: 'text', multiline: true },
      ],
    },
    {
      title: 'Korea Information',
      icon: <LocationOn />,
      fields: [
        { key: 'status', label: 'Status', value: profileData.status, type: 'text' },
        { key: 'visa', label: 'Visa Type', value: profileData.visa, type: 'text' },
        { key: 'language', label: 'Primary Language', value: profileData.language, type: 'text' },
      ],
    },
  ];

  const settingsItems = [
    {
      icon: <Notifications />,
      title: 'Push Notifications',
      description: 'Receive notifications about updates and messages',
      setting: 'notifications',
    },
    {
      icon: <Email />,
      title: 'Email Updates',
      description: 'Get weekly updates about Korean news and events',
      setting: 'emailUpdates',
    },
    {
      icon: <Phone />,
      title: 'SMS Notifications',
      description: 'Receive important alerts via SMS',
      setting: 'smsNotifications',
    },
  ];

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      {/* Theme toggle removed */}
      <Box sx={{ ml: { xs: 0, md: '80px' } }}> {/* 0 on mobile; offset on desktop for fixed navigation */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Profile
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                src={user.picture}
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  border: 4,
                  borderColor: 'primary.main',
                }}
              >
                {profileData.name.charAt(0)}
              </Avatar>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {profileData.name}
              </Typography>
              
              <Chip
                label={profileData.status}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {profileData.bio}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {profileData.location}
              </Typography>
              
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setIsEditing(!isEditing)}
                sx={{ mt: 2 }}
                fullWidth
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Profile Information Sections */}
            {profileSections.map((section, sectionIndex) => (
              <Grid item xs={12} key={sectionIndex}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ color: 'primary.main', mr: 2 }}>
                        {section.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {section.title}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      {section.fields.map((field) => (
                        <Grid item xs={12} sm={field.multiline ? 12 : 6} key={field.key}>
                          <TextField
                            fullWidth
                            label={field.label}
                            type={field.type}
                            multiline={field.multiline}
                            rows={field.multiline ? 3 : 1}
                            value={field.value}
                            onChange={(e) => handleProfileChange(field.key, e.target.value)}
                            disabled={!isEditing}
                            variant={isEditing ? 'outlined' : 'filled'}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Settings Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ color: 'primary.main', mr: 2 }}>
                      <Security />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Settings
                    </Typography>
                  </Box>
                  
                  <List>
                    {settingsItems.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          secondary={item.description}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings[item.setting]}
                            onChange={() => handleSettingChange(item.setting)}
                            color="primary"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Account Actions
                  </Typography>
                  
                  {isEditing && (
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        sx={{ mr: 2 }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Security />}
                      fullWidth
                    >
                      Change Password
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Logout />}
                      fullWidth
                    >
                      Clear History
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      fullWidth
                    >
                      Delete Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
    </Box>
    </>
  );
};

export default Profile;
