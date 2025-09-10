import {
  Google,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
// ThemeToggle removed per request
import { authAPI, usersAPI } from '../services/api';
import { getGoogleAccessToken, fetchGoogleUser } from '../lib/googleAuth';

const Signup = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name) {
      setError('All fields are required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        terms_accepted: formData.termsAccepted,
      };

      const response = await authAPI.signup(signupData);
      const { user, token } = response.data;
      
  dispatch(setUser(user));
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const accessToken = await getGoogleAccessToken(clientId);
      const profile = await fetchGoogleUser(accessToken);

      // 1. Check if user already exists via backend
      let existing = null;
      try {
        existing = await usersAPI.searchByEmail(profile.email);
      } catch (searchErr) {
        if (searchErr?.response?.status !== 404) {
          console.error('Search user failed:', searchErr);
          // Proceed if 404 (not found); otherwise show error
          setError('Unable to verify existing user. Please try again.');
          return;
        }
      }

      if (existing && existing.email && existing.name) {
        // User exists -> redirect to login with message
        setError('User already exists. Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { emailPrefill: profile.email, notice: 'Account exists. Please sign in.' } });
        }, 1200);
        return;
      }

      // 2. Create user
      const createPayload = {
        email: profile.email,
        name: profile.name,
        given_name: profile.given_name,
        family_name: profile.family_name,
        picture: profile.picture,
        email_verified: profile.email_verified,
        sub: profile.sub
      };
      let created;
      try {
        created = await usersAPI.create(createPayload);
      } catch (createErr) {
        console.error('Create user failed:', createErr);
        setError(createErr?.response?.data?.detail || 'Failed to create user.');
        return;
      }

      // 3. Store user locally & treat accessToken as session token (or replace when backend returns one)
      const userObj = {
        id: created.id || createPayload.sub,
        name: created.name || createPayload.name,
        email: created.email || createPayload.email,
        picture: created.picture || createPayload.picture,
        provider: 'google'
      };
      dispatch(setUser(userObj));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      navigate('/');
    } catch (e) {
      console.error('Google signup failed:', e);
      setError('Google sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  {/* Theme toggle removed */}
  <Box sx={{ ml: { xs: 0, md: '80px' } }}> {/* 0 on mobile; offset on desktop for fixed nav */}
  <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
  <Card sx={{ boxShadow: 2, backgroundColor: 'background.default' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Join Konnect
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              margin="normal"
              required
              autoComplete="name"
              autoFocus
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              autoComplete="new-password"
              helperText="Password must be at least 8 characters long"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              margin="normal"
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={handleChange('termsAccepted')}
                  color="primary"
                  size="small"
                  disableRipple
                  sx={{ p: 0, mr: 1, pl: 1.2 }}
                />
              }
              label={
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" color="primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2, alignItems: 'center' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          {/* Social Signup */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or sign up with
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleSocialSignup}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" color="primary" sx={{ fontWeight: 'bold' }}>
                Sign in here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
    </>
  );
};

export default Signup;
