import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

// Minimal image-only carousel for three buzz images (from buzzCarousel folder)
const slides = [
  {
    src: '/images/buzzCarousel/Chunju_Main Banner _ 1.webp',
    url: 'https://www.expedia.com/Things-To-Do-In-Chungju.d6139560.Travel-Guide-Activities',
    alt: 'Chungju activities - Expedia',
  },
  {
    src: '/images/buzzCarousel/Chungju_mainbanner_2.png',
    url: 'https://www.seoultravelpass.com/en/products/1639-chungbuk-from-seoul-chungju-activity-day-tour-cruise-cable-car-cave-kayak-adventure?srsltid=AfmBOoqFBMEZ5yLLk-QrGwfGbW2N5nnoBK86nMRcTp4ezgVOllqgTS8l',
    alt: 'Chungju day tour - Seoul Travel Pass',
  },
  {
    src: '/images/buzzCarousel/Main Banner_3.webp',
    url: 'https://thewanderingwhittens.com/2022/11/04/hwalok-cave-in-chungju/',
    alt: 'Hwalok Cave in Chungju - Blog',
  },
];

const BuzzCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Optional autoplay (every 4s)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: 410, ml: 5, height: 244, borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        {/* Slides */}
        {slides.map((s, i) => (
          <Box
            key={s.src}
            component="a"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.alt}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              opacity: i === current ? 1 : 0,
              transition: 'opacity 500ms ease',
              pointerEvents: i === current ? 'auto' : 'none',
            }}
          >
            <Box
              component="img"
              src={s.src}
              alt={s.alt}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        ))}

        {/* Dots */}
        <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => setCurrent(i)}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: i === current ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Caption */}
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 400,
          fontFamily: 'Metropolis',
          mt: 1,
          ml: 5,
          color: 'text.secondary'
        }}
      >
        Explore the beauty of Chungju City
      </Typography>
    </Box>
  );
};

export default BuzzCarousel;
