import {
  ChatBubbleOutlineOutlined,
  CreditCardOutlined,
  LockOutlined,
  RoomServiceOutlined,
  TravelExploreOutlined
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
// import ThemeToggle from '../components/ThemeToggle';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

// Animation components
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const SlideInLeft = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const SlideInRight = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const ScaleIn = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const CountUp = ({ end, duration = 2, delay = 0 }) => {
  const count = useTransform(
    useScroll().scrollYProgress,
    [0, 1],
    [0, end]
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <motion.span>{count}</motion.span>
    </motion.div>
  );
};

const AboutUs = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          ml: { xs: 0 },
          mt: { xs: '64px', md: 0 },
          mb: { xs: '56px', md: 0, lg: 10 }, // Add extra bottom margin for large screens
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pb: { xs: 6, md: 10, lg: 14 }, // Add padding bottom for all screens
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ width: '100%' }}
        >
          <Container
            maxWidth="lg"
            sx={{
              minHeight: { xs: 'calc(100vh - 64px)', md: '100vh' },
              display: 'flex',
              alignItems: 'center',
              py: { xs: 4, md: 8 },
            }}
          >
            {/* Hero two-column layout */}
            <Grid container spacing={4} alignItems="center">
              {/* Left copy */}
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'left', pl: 0, mt: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: '40px', md: '64px' },
                        lineHeight: 1.1,
                        mb: 3,
                        color: theme.palette.text.primary,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      The <Box component="span" sx={{ color: theme.palette.secondary.main, fontStyle: 'italic' }}>Only</Box>{' '}
                      <Box component="span" sx={{ color: theme.palette.primary.main }}>App</Box>
                      <br />
                      You Need in Korea
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        maxWidth: 700,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                        fontSize: '16px',
                      }}
                    >
                      Konnect puts Korea at your fingertips—navigate, translate, book, and
                      explore in your language. No confusion. No hassle. Just your life,
                      made easier.
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2,
                      mt: 4,
                      alignItems: { xs: 'stretch', sm: 'center' },
                      justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                          fontWeight: 700,
                        }}
                        href="/signup"
                      >
                        Join the Community
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1.5,
                          textTransform: 'none',
                          fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                          fontWeight: 700,
                        }}
                        href="/"
                      >
                        Explore Now
                      </Button>
                    </Box>
                  </motion.div>

                  {/* Small: What we offer + icon row */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Box sx={{ mt: 5 }}>
                      <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '16px', fontStyle: 'italic', color: theme.palette.text.secondary, mb: 2 }}>
                        What we offer
                      </Typography>
                      <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(5, 1fr)' },
                        gap: { xs: 3, sm: 2 },
                        alignItems: 'center',
                        maxWidth: 800,
                      }}>
                        {[
                          { Icon: TravelExploreOutlined, label: 'Search' },
                          { Icon: RoomServiceOutlined, label: 'Book' },
                          { Icon: CreditCardOutlined, label: 'Pay' },
                          { Icon: LockOutlined, label: 'Verify' },
                          { Icon: ChatBubbleOutlineOutlined, label: 'Connect' },
                        ].map(({ Icon, label }) => (
                          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Icon sx={{ color: '#3289C9', fontSize: 36 }} />
                            <Typography sx={{ mt: 1, color: '#3289C9', fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '16px' }}>
                              {label}
                            </Typography>
                            <Box sx={{ mt: 1, width: 90, height: 6, bgcolor: '#3289C9', borderRadius: 999 }} />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              </Grid>

              {/* Right mosaic */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Grid container spacing={2}>
            <Grid item xs={6}>
                        <Box sx={{
              borderRadius: '20px',
                          height: { xs: 200, md: 260 },
                          backgroundImage: 'url(https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=900&q=60)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{
              borderRadius: '20px',
                          height: { xs: 120, md: 180 },
                          mb: 2,
                          backgroundImage: 'url(https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=600&q=60)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />
                        <Box sx={{
              borderRadius: '20px',
                          height: { xs: 70, md: 70 },
                          backgroundImage: 'url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=60)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />
                      </Grid>
                      <Grid item xs={8}>
                        <Box sx={{
              borderRadius: '20px',
                          height: { xs: 120, md: 160 },
                          backgroundImage: 'url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=60)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{
              borderRadius: '20px',
                          height: { xs: 120, md: 160 },
                          backgroundImage: 'url(https://images.unsplash.com/photo-1563240389-1b3d1b2323cf?auto=format&fit=crop&w=600&q=60)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }} />
                      </Grid>
                    </Grid>
                    {/* removed down-arrow affordance per request */}
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>


        {/* What you can do with Konnect Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 1100 }}
          >
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'left', mb: 6 }}>
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: '36px', md: '64px' },
                      color: theme.palette.text.primary,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    What you can do with{' '}
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Box component="img" src="/images/Konnect_logo.png" alt="Konnect" sx={{ height: { xs: 28, md: 40 }, ml: 1, position: 'relative', top: { xs: 2, md: 4 } }} />
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                    <Button size="small" variant="contained" color="primary" sx={{ borderRadius: 999, px: 1.5, py: 0.25, fontSize: '11px', fontWeight: 700, textTransform: 'none' }}>Join the Community</Button>
                    <Button size="small" variant="outlined" color="secondary" sx={{ borderRadius: 999, px: 1.5, py: 0.25, fontSize: '11px', fontWeight: 700, textTransform: 'none' }}>Safety</Button>
                  </Box>
                </motion.div>

                {/* Five cards row */}
                <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' } }}>
                  {[
                    { icon: '🌐', title: 'Search', desc: 'Find what you need in your language—tourism, transport, food, events, clinics & more.' },
                    { icon: '📖', title: 'Book', desc: 'Reserve taxis, trains, restaurants, or hotels directly in the app—no Korean needed.' },
                    { icon: '💳', title: 'Pay', desc: 'Use your international card, digital wallet, or our SuperK card—even without a bank account.' },
                    { icon: '🔐', title: 'Verify', desc: 'Scan your passport and activate your digital ID with eSIM—skip long registration queues.' },
                    { icon: '💬', title: 'Connect', desc: 'Meet and join activities with like-minded individuals from around the world.' },
                  ].map((f, i) => (
                    <ScaleIn key={f.title} delay={0.15 + i * 0.1}>
                      <Card elevation={0} sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1 }}>
                          <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#CD20281A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: theme.palette.secondary.main }}>
                            {f.icon}
                          </Box>
                          <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '16px' }}>{f.title}</Typography>
                          <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '11px', color: theme.palette.text.secondary }}>
                            {f.desc}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ScaleIn>
                  ))}
                </Box>
              </Box>
            </Container>
          </motion.div>
        </Box>

        {/* Where we are going! Section */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'transparent' }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <SlideInLeft>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 700,
                      fontSize: { xs: '36px', md: '64px' },
                      color: theme.palette.text.primary,
                      lineHeight: 1.1,
                      mb: 2,
                    }}
                  >
                    Where we are going
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: 400,
                      color: theme.palette.text.secondary,
                      fontSize: '16px',
                    }}
                  >
                    We’re just getting started. With over 100,000 users from 96 countries, Konnect is expanding every day. Our goal? To become the easiest way for anyone, anywhere, to live, travel, and thrive in Korea.
                  </Typography>
                </SlideInLeft>
              </Grid>
              <Grid item xs={12} md={6}>
                <SlideInRight>
                  <Paper elevation={0} sx={{ bgcolor: 'grey.100', height: { xs: 180, md: 240 }, borderRadius: 3 }} />
                </SlideInRight>
              </Grid>
            </Grid>
          </Container>
        </motion.div>

        {/* Coming soon */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', maxWidth: 1100 }}
          >
            <Container maxWidth="lg">
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                    fontWeight: 700,
                    fontSize: { xs: '36px', md: '64px' },
                    color: theme.palette.text.primary,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Coming soon
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                  <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '11px', color: theme.palette.text.secondary }}>
                    Any things you miss or love? We’re constantly expanding.
                  </Typography>
                  <Button size="small" variant="contained" color="primary" sx={{ borderRadius: 999, px: 1.5, py: 0.25, fontSize: '11px', fontWeight: 700, textTransform: 'none' }}>
                    Stay updated
                  </Button>
                </Box>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                  {[
                    { icon: '🪪', title: 'SuperK all-in-one digital card' },
                    { icon: '🗺️', title: 'Local experiences & events' },
                    { icon: '💼', title: 'Jobs & Internships' },
                  ].map((it, i) => (
                    <Grid item xs={12} sm={4} key={it.title}>
                      <ScaleIn delay={0.1 + i * 0.1}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
                          <Box sx={{ width: 72, height: 56, borderRadius: 2, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: theme.palette.text.secondary }}>
                            {it.icon}
                          </Box>
                          <Typography sx={{ mt: 1.5, fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '11px', color: theme.palette.text.secondary }}>
                            {it.title}
                          </Typography>
                        </Box>
                      </ScaleIn>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Container>
          </motion.div>
        </Box>

      </Box>
    </motion.div>
  );
};

export default AboutUs;
