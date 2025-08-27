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
  Typography,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
// import ThemeToggle from '../components/ThemeToggle';


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

const AboutUs = () => {
  const theme = useTheme();
  // Mobile carousel setup (xs only). Desktop view remains unchanged.
  const slides = [
    `${process.env.PUBLIC_URL}/images/aboutUs/about_section_1.jpeg`,
    `${process.env.PUBLIC_URL}/images/aboutUs/about_section_2.jpeg`,
    `${process.env.PUBLIC_URL}/images/aboutUs/about_section_3.jpeg`,
    `${process.env.PUBLIC_URL}/images/aboutUs/about_section_4.jpeg`,
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

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
          style={{ width: 'auto' }}
        >
          <Container
            maxWidth="xl"
            sx={{
              minHeight: { xs: 'calc(100vh - 64px)', md: '95vh' },
              display: 'flex',
              alignItems: 'center',
              ml: { xs: 0, md: 30 },
            }}
          >
            {/* Hero two-column layout */}
            <Grid container spacing={4} alignItems="flex-start" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              {/* Left copy */}
              <Grid item xs={12} sm={7} md={7}>
                <Box sx={{ textAlign: 'left', pl: 0, pr: { sm: 2, md: 3 }, mt: 10 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        // Exact CSS per request (except the word "Only")
                        color: '#1E4485',
                        fontFamily: 'Metropolis',
                        fontSize: '64px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '119%',
                        letterSpacing: '-0.64px',
                        mb: 3,
                      }}
                    >
                      The <Box component="span" sx={{ color: theme.palette.secondary.main, fontStyle: 'italic' }}>Only</Box>{' '}App
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

                  {/* Mobile-only image carousel (appears below buttons) */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 3 }}>
                      <Box
                        aria-label="About images carousel"
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '20px',
                          width: '100%',
                          height: 220,
                          bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            transform: `translateX(-${slideIndex * 100}%)`,
                            transition: 'transform 600ms ease',
                          }}
                        >
                          {slides.map((src, i) => (
                            <Box key={i} sx={{ minWidth: '100%', height: '100%' }}>
                              <Box
                                component="img"
                                src={src}
                                alt={`About Konnect ${i + 1}`}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      {/* Dots */}
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                        {slides.map((_, i) => (
                          <Box
                            key={i}
                            onClick={() => setSlideIndex(i)}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              bgcolor: i === slideIndex ? 'grey.500' : 'grey.300',
                            }}
                          />
                        ))}
                      </Box>
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

              {/* Right mosaic: two flex rows, each with two images; stacked vertically; right column (5/12) */}
              <Grid item xs={12} sm={5} md={5} sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: { sm: 'flex-end' }, minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box
                      component="img"
                      alt="About Konnect 1"
                      src={`${process.env.PUBLIC_URL}/images/aboutUs/about_section_1.jpeg`}
                      sx={{
                        borderRadius: '20px',
                        width: '320px',
                        height: { xs: 180, sm: 240, md: 400 },
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <Box
                      component="img"
                      alt="About Konnect 2"
                      src={`${process.env.PUBLIC_URL}/images/aboutUs/about_section_2.jpeg`}
                      sx={{
                        ml: { xs: 0, sm: 2, md: -22 },
                        mt: { xs: 2, sm: 3, md: 9.5 },
                        borderRadius: '20px',
                        width: '380px',
                        height: { xs: 180, sm: 240, md: 320 },
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <Box
                      component="img"
                      alt="About Konnect 3"
                      src={`${process.env.PUBLIC_URL}/images/aboutUs/about_section_3.jpeg`}
                      sx={{
                        borderRadius: '20px',
                        width: '500px',
                        height: { xs: 180, sm: 240, md: 290 },
                        objectFit: 'cover',
                        display: 'block',
                        ml: 'auto'
                      }}
                    />
                    <Box
                      component="img"
                      alt="About Konnect 4"
                      src={`${process.env.PUBLIC_URL}/images/aboutUs/about_section_4.jpeg`}
                      sx={{
                        borderRadius: '20px',
                        width: '210px',
                        height: { xs: 180, sm: 240, md: 290 },
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>


        {/* What you can do with Konnect Section */}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'left', py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 1100 }}
          >
            <Container maxWidth="xl"
              sx={{
                minHeight: { xs: 'calc(100vh - 64px)', md: '60vh' },
                display: 'flex',
                alignItems: 'center',
                ml: { xs: 0, md: 30 },
              }}
            >
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
                      color: '#3289C9',
                      textAlign: 'flex-start',
                      fontFamily: 'Metropolis',
                      fontSize: '52px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                    }}
                  >
                    What you can do with{' '}
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <Box component="img" src="/images/Konnect_logo.png" alt="Konnect" sx={{ height: { xs: 28, md: 40 }, ml: 1, position: 'relative', top: { xs: 2, md: 4 } }} />
                    </Box>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '16px', color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                      To learn more about us,
                    </Typography>
                    <Button size="small" variant="contained" color="primary" sx={{ borderRadius: 999, px: 1.5, py: 0.25, fontSize: '11px', fontWeight: 700, textTransform: 'none' }}>Join the Community</Button>
                    <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '12px', color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                      today!
                    </Typography>
                  </Box>
                </motion.div>

                {/* Five cards row */}
                <Box sx={{ mt: 4, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' } }}>
                  {[
                    { Icon: TravelExploreOutlined, title: 'Search', desc: 'Find what you need in your language—tourism, transport, food, events, clinics & more.' },
                    { Icon: RoomServiceOutlined, title: 'Book', desc: 'Reserve taxis, trains, restaurants, or hotels directly in the app—no Korean needed.' },
                    { Icon: CreditCardOutlined, title: 'Pay', desc: 'Use your international card, digital wallet, or our SuperK card—even without a bank account.' },
                    { Icon: LockOutlined, title: 'Verify', desc: 'Scan your passport and activate your digital ID with eSIM—skip long registration queues.' },
                    { Icon: ChatBubbleOutlineOutlined, title: 'Connect', desc: 'Meet and join activities with like-minded individuals from around the world.' },
                  ].map((f, i) => (
                    <ScaleIn key={f.title} delay={0.15 + i * 0.1}>
                      <Card
                        elevation={0}
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 4,
                          boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                          height: '380px',
                          width: '210px',
                          border: `1px solid ${theme.palette.divider}`,
                          pt: 4,
                        }}
                      >
                        {/* circular top shape */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: { xs: -110, md: -90 },
                            width: { xs: 220, md: 220 },
                            height: { xs: 220, md: 260 },
                            borderRadius: '50%',
                            background: 'linear-gradient(180deg, rgba(205,32,40,0.10) 0%, rgba(205,32,40,0.10) 60%, rgba(205,32,40,0.06) 100%)',
                          }}
                        />
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.25, pt: 7 }}>
                          <f.Icon sx={{ color: '#CD2028', fontSize: 32 }} />
                          <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '20px' }}>{f.title}</Typography>
                          <Typography sx={{ fontFamily: 'Metropolis, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: '14px', color: theme.palette.text.secondary }}>
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
                  <Box
                    component="img"
                    alt="Where we are going"
                    src={`${process.env.PUBLIC_URL}/images/aboutUs/where_section.jpeg`}
                    sx={{
                      height: { xs: 180, md: 240 },
                      width: '100%',
                      borderRadius: 3,
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
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
