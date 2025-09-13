import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser, clearUser } from './store';
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
import LinkBusiness from './pages/LinkBusiness';
import Language from './pages/Language';
import SearchResults from './pages/SearchResults';
import Admin from './pages/Admin';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate token and get user info
          // This would typically be an API call
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData && Object.keys(userData).length) {
            dispatch(setUser(userData));
          }
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
  }, [dispatch]);

  const handleLogin = (userData, token) => {
    dispatch(setUser(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    dispatch(clearUser());
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
          
          <Box
            component="main"
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              position: 'fixed',
              // fixed container with an 8px margin around it
              top: { xs: 72, md: 8 }, // leave room for the mobile app bar (64) + 8px gap
              right: 8,
              bottom: 8,
              left: { xs: 8, md: 74 }, // sidebar (66) + 8px gap on desktop
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Scrollable content region inside the fixed white container */}
            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/buzz" element={<Buzz />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/business" element={<Business />} />
                <Route path="/linkBusiness" element={<LinkBusiness />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/library" element={<Library user={user} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/language" element={<Language />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/admin" element={<Admin />} />
                {/* Add more routes as needed */}
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
