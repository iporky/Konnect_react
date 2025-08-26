import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeContextProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Buzz from './pages/Buzz';
import AboutUs from './pages/AboutUs';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Business from './pages/Business';
import Contact from './pages/Contact';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token and get user info
          // This would typically be an API call
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <ThemeContextProvider>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: 'background.default'
        }}>
          {/* You can add a loading spinner here */}
          Loading...
        </Box>
      </ThemeContextProvider>
    );
  }

  return (
    <ThemeContextProvider>
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          backgroundColor: '#cf202a0d'
        }}>
          <Navigation user={user} onLogout={handleLogout} />
          
          <Box component="main" sx={{ flexGrow: 1, borderRadius: 21 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/buzz" element={<Buzz />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/business" element={<Business />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/library" element={<Library user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* Add more routes as needed */}
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
