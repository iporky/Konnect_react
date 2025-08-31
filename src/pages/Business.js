import { Box, Button, Card, CardContent, Container, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LaptopMacOutlined, VerifiedOutlined, FaceRetouchingNatural, TheaterComedy as TheaterComedyIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Business = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Use the same layout and spacings as AboutUs; images load from business folder
  const slides = [
    `${process.env.PUBLIC_URL}/images/business/business_1.jpeg`,
    `${process.env.PUBLIC_URL}/images/business/business_2.jpeg`,
    `${process.env.PUBLIC_URL}/images/business/business_3.jpeg`,
    `${process.env.PUBLIC_URL}/images/business/business_4.jpeg`,
  ];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  // Logos carousel (10 at a time, auto-advance every 5s)
  const [logos, setLogos] = useState([]);
  const pageSize = 10;
  const [logoPage, setLogoPage] = useState(0);
  useEffect(() => {
    const base = `${process.env.PUBLIC_URL}/images/logos`;
    const logoFiles = [
      'Amazon_Web_Services-Logo.wine.png',
      'daejeon.png',
      'Emblem_of_the_Ministry_of_Justice_(South_Korea)_(English).svg.png',
      'GSC.png',
      'gyeonggi.jfif',
      'hq720.jpg',
      'HYU_logo_singlecolor_png.png',
      'KISED.png',
      'southsummit.png',
      '08.KIPA-B.jpg',
    ];
    setLogos(logoFiles.map((f) => `${base}/${f}`));
  }, []);

  const logoPages = logos.length
    ? Array.from({ length: Math.ceil(logos.length / pageSize) }, (_, p) => logos.slice(p * pageSize, p * pageSize + pageSize))
    : [];

  useEffect(() => {
    if (logoPages.length <= 1) return; // don't transition if only one page (<=10 logos)
    const id = setInterval(() => setLogoPage((i) => (i + 1) % logoPages.length), 5000);
    return () => clearInterval(id);
  }, [logoPages.length]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
  <Box sx={{ color: theme.palette.text.primary, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', pb: { xs: 6, md: 10, lg: 14 } }}>
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ width: 'auto' }}
        >
          <Container
            maxWidth="xl"
            sx={{
              // Reduce desktop minHeight to avoid large gap before next section
              minHeight: { xs: 'auto', md: '60vh' },
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              py: { xs: 2, md: 0 },
              ml: { xs: 0, md: 30 },
              mt: { xs: 0, md: 10 },
            }}
          >
            <Grid container spacing={12} alignItems="flex-start" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              {/* Left copy (business-specific text) */}
              <Grid item xs={12} sm={8} md={8}>
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
                        color: '#1E4485',
                        fontFamily: 'Metropolis',
                        fontSize: '64px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: '119%',
                        letterSpacing: '-0.64px',
                        mb: 1,
                      }}
                    >
                      Be <Box component="span" sx={{ color: '#DB6067', fontStyle: 'italic' }}>Global</Box>
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: '#3289C9',
                        fontFamily: 'Metropolis',
                        fontWeight: 700,
                        fontSize: { xs: '28px', md: '44px' },
                        lineHeight: 1.2,
                        mb: 2,
                      }}
                    >
                      Turn visibility into growth
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
                        fontFamily: 'Metropolis',
                        fontWeight: 400,
                        maxWidth: 700,
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                        fontSize: '20px',
                      }}
                    >
                      Millions of international customers are searching for foreign-friendly businesses — get discovered easily with Konnect.
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
                      <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 7, px: 4, py: 1.5, textTransform: 'none', fontFamily: 'Metropolis', fontWeight: 700 }} onClick={() => navigate('/linkBusiness')}>
                        List your Business
                      </Button>
                      <Button variant="outlined" color="primary" size="large" sx={{ borderRadius: 7, px: 4, py: 1.5, textTransform: 'none', fontFamily: 'Metropolis', fontWeight: 700 }}>
                        Contact Us
                      </Button>
                    </Box>
                  </motion.div>

                  {/* Mobile-only image carousel below buttons; same as AboutUs */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 3 }}>
                      <Box
                        aria-label="Business images carousel"
                        sx={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', width: '100%', height: 220, bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800' }}
                      >
                        <Box sx={{ display: 'flex', width: '100%', height: '100%', transform: `translateX(-${slideIndex * 100}%)`, transition: 'transform 600ms ease' }}>
                          {slides.map((src, i) => (
                            <Box key={i} sx={{ minWidth: '100%', height: '100%' }}>
                              <Box component="img" src={src} alt={`Business ${i + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                        {slides.map((_, i) => (
                          <Box key={i} onClick={() => setSlideIndex(i)} sx={{ width: 6, height: 6, borderRadius: '50%', cursor: 'pointer', bgcolor: i === slideIndex ? 'grey.500' : 'grey.300' }} />
                        ))}
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Where we have shined - logo carousel */}
                  <Box sx={{ mt: 4, pr: { md: 2 } }}>
                    <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 600, fontSize: '16px', color: 'grey.600', fontStyle: 'italic', mb: 2 }}>
                      Where we have shined
                    </Typography>
                    <Box sx={{ maxWidth: { xs: '100%', sm: 520 }, position: 'relative', overflow: 'hidden', width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          width: `${Math.max(logoPages.length, 1) * 100}%`,
                          transform: logoPages.length > 1 ? `translateX(-${logoPage * (100 / logoPages.length)}%)` : 'none',
                          transition: 'transform 600ms ease',
                        }}
                      >
                        {(logoPages.length ? logoPages : [[]]).map((page, pi) => (
                          <Box key={pi} sx={{ width: `${100 / logoPages.length}%`, px: 0.5 }}>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                                gap: 4,
                              }}
                            >
                              {page.map((src, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Box
                                    sx={{
                                      width: 90,
                                      height: 90,
                                      borderRadius: '20px',
                                      bgcolor: '#fff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={src}
                                      alt={`logo-${pi * pageSize + i + 1}`}
                                      onError={(e) => {
                                        // fallback to transparent pixel to keep grey tile when logo missing
                                        e.currentTarget.style.display = 'none';
                                      }}
                                      sx={{ maxWidth: '95%', objectFit: 'contain', opacity: 1 }}
                                    />
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right mosaic copied from AboutUs but with business images; hidden on xs */}
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
                      alt="Business 1"
                      src={`${process.env.PUBLIC_URL}/images/business/business_1.jpeg`}
                      sx={{ borderRadius: '20px', width: '320px', height: { xs: 180, sm: 240, md: 400 }, objectFit: 'cover', display: 'block' }}
                    />
                    <Box
                      component="img"
                      alt="Business 2"
                      src={`${process.env.PUBLIC_URL}/images/business/business_2.jpeg`}
                      sx={{ ml: { xs: 0, sm: 2, md: -22 }, mt: { xs: 2, sm: 3, md: 9.5 }, borderRadius: '20px', width: '380px', height: { xs: 180, sm: 240, md: 320 }, objectFit: 'cover', display: 'block' }}
                    />
                    <Box
                      component="img"
                      alt="Business 3"
                      src={`${process.env.PUBLIC_URL}/images/business/business_3.jpeg`}
                      sx={{ borderRadius: '20px', width: '500px', height: { xs: 180, sm: 240, md: 290 }, objectFit: 'cover', display: 'block', ml: 'auto' }}
                    />
                    <Box
                      component="img"
                      alt="Business 4"
                      src={`${process.env.PUBLIC_URL}/images/business/business_4.jpeg`}
                      sx={{ borderRadius: '20px', width: '210px', height: { xs: 180, sm: 240, md: 290 }, objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
        
        {/* Section 2: Benefits for businesses (mirrors AboutUs card layout) */}
        {/* Reduce top padding so heading sits closer to hero */}
    <Box sx={{ width: '100%', display: 'flex', pt: { xs: 2, md: 16 }, pb: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: isMobile ? 0.12 : 0.5 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', maxWidth: 1100 }}
          >
            <Container maxWidth="xl" sx={{ ml: { xs: 0, md: 30 } }}>
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: 'Metropolis',
                    fontWeight: 700,
                    fontSize: { xs: '32px', md: '56px' },
                    color: '#3289C9',
                    letterSpacing: { xs: '-0.32px', md: '-0.56px' },
                  }}
                >
                  We help bring foreign customers to your doorstep
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 400, fontSize: '16px', color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                    To be a part of us,
                  </Typography>
                  <Button size="small" variant="contained" color="primary" sx={{ borderRadius: 999, px: 1.5, py: 0.25, fontSize: '11px', fontWeight: 700, textTransform: 'none' }} onClick={() => navigate('/linkBusiness')}>List your Business</Button>
                  <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 400, fontSize: '16px', color: theme.palette.text.secondary, fontStyle: 'italic' }}>
                    today!
                  </Typography>
                </Box>

                {/* Four cards row  */}
                <Box sx={{ mt: 8, display: 'grid', gap: { xs: 3, md: 6.5 }, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, justifyItems: { xs: 'center', sm: 'center', md: 'stretch' } }}>
                  {[
                    { Icon: TheaterComedyIcon, title: 'Be Yourself', desc: 'Upload information in Korean (or your language) and we convert it accurately in 100+ Languages' },
                    { Icon: VerifiedOutlined, title: 'Verified User Base', desc: 'Reach 100+ million real users planning travel or living in Korea' },
                    { Icon: FaceRetouchingNatural, title: 'Trust-Building Profile', desc: 'Business profile optimized for credibility & visibility' },
                    { Icon: LaptopMacOutlined, title: 'Embedded Booking API', desc: 'Customers book & pay directly through Konnect', comingSoon: true },
                  ].map((f, i) => (
          <Card
                      key={f.title}
                      elevation={0}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 4,
                        boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            height: { xs: 'auto', md: '380px' },
            width: { xs: '90%', sm: '300px', md: '320px' },
                        border: `1px solid ${theme.palette.divider}`,
            pt: 4,
            mx: { xs: 'auto', md: 0 },
                      }}
                    >
                      {/* circular top shape */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          top: { xs: -110, md: -90 },
                          width: { xs: 220, md: 380 },
                          height: { xs: 220, md: 300 },
                          borderRadius: '50%',
                          background: 'linear-gradient(180deg, rgba(205,32,40,0.10) 0%, rgba(205,32,40,0.10) 60%, rgba(205,32,40,0.06) 100%)',
                        }}
                      />
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: { xs: 3, md: 6 }, pt: 2 }}>
                        <f.Icon sx={{ color: '#CD2028', fontSize: 45 }} />
                        <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 700, fontSize: { xs: '20px', md: '22px' } }}>{f.title}</Typography>
                        <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 400, fontSize: { xs: '15px', md: '17px' }, color: theme.palette.text.secondary }}>
                          {f.desc}
                        </Typography>
                        {f.comingSoon && (
                          <Typography sx={{ mt: 0.5, fontFamily: 'Metropolis', fontWeight: 400, fontSize: '12px', color: 'grey.500', fontStyle: 'italic' }}>
                            (Coming soon)
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Container>
          </motion.div>
        </Box>
        
        {/* Section 3: Your ads. In their language. */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: isMobile ? 0.12 : 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
        >
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 8, md: 12 },
              ml: { xs: 0, md: 30 },
            }}
          >
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Metropolis',
                  fontWeight: 700,
                  fontSize: { xs: '28px', md: '44px' },
                  color: '#3289C9',
                  lineHeight: 1.2,
                }}
              >
                Your <Box component="span" sx={{ fontStyle: 'italic' }}>ads.</Box> In their language.
              </Typography>
            </Box>

            <Grid container spacing={6} alignItems="center">
              {/* Left: grey area with image */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 260, sm: 320, md: 360 },
                    bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    component="img"
                    src={`${process.env.PUBLIC_URL}/images/business/yourAd.jpeg`}
                    alt="Your Ads preview"
                    sx={{
                      width: { xs: '115%', sm: '112%', md: '500px' },
                      height: '100%',
                      objectFit: 'cover',
                      mx: 'auto',
                      transform: { xs: 'translateX(0)', sm: 'translateX(0)', md: 'none' },
                    }}
                  />
                </Box>
              </Grid>

              {/* Right: points */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'grid', gap: 4 }}>
                  {[{
                    title: 'Targeted Visibility',
                    body: 'Show your business to users from 100+ countries actively searching for things to do, eat, or book in Korea.',
                  }, {
                    title: 'Multilingual Ad Delivery',
                    body: 'Your promotions are auto-translated and localized for global audiences in over 100+ languages',
                  }, {
                    title: 'Action-Ready Placement',
                    body: 'Ads appear next to booking, payment, and navigation flows—driving real conversions, not just clicks.',
                  }].map((p) => (
                    <Box key={p.title}>
                      <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#CD2028', mb: 0.5 }}>
                        {p.title}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Metropolis', fontWeight: 400, fontSize: { xs: '14px', md: '18px' }, color: theme.palette.text.secondary }}>
                        {p.body}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 1 }}>
                    <Button variant="contained" color="primary" sx={{ borderRadius: 999, px: 3, py: 1.2, textTransform: 'none', fontWeight: 700 }}>
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default Business;
