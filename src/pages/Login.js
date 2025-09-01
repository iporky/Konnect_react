import {
  Google,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ThemeToggle removed per request
import { authAPI } from '../services/api';
import { getGoogleAccessToken, fetchGoogleUser } from '../lib/googleAuth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      const { user, token } = response.data;
      
      onLogin(user, token);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '464658982283-0qqaacdf84sjgten1d3fr4o2fa47v2c8.apps.googleusercontent.com';
      const accessToken = await getGoogleAccessToken(clientId);
      const profile = await fetchGoogleUser(accessToken);
      const user = {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        avatar: profile.picture,
        provider: 'google'
      };
      const token = accessToken; // use access token as session token (frontend-only scenario)
      onLogin(user, token);
      navigate('/');
    } catch (e) {
      console.error('Google login failed:', e);
      setError('Google sign-in failed. Please try again.');
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
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your Konnect account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              autoComplete="current-password"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Link href="/forgot-password" variant="body2" color="primary">
                Forgot your password?
              </Link>
            </Box>
          </Box>

          {/* Social Login */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or continue with
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={handleSocialLogin}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link href="/signup" color="primary" sx={{ fontWeight: 'bold' }}>
                Sign up here
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

export default Login;
