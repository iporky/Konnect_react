import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

// Minimal image-only carousel for three buzz images
const images = ['/images/buzz1.jpg', '/images/buzz2.jpg', '/images/buzz3.jpg'];

const BuzzCarousel = () => {
  const [current, setCurrent] = useState(0);

  // Optional autoplay (every 4s)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: 444, height: 240, borderRadius: '25px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
      {/* Slides */}
      {images.map((src, i) => (
        <Box
          key={src}
          component="img"
          src={src}
          alt={`buzz-${i + 1}`}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 500ms ease',
          }}
        />
      ))}

      {/* Dots */}
      <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75 }}>
        {images.map((_, i) => (
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
  );
};

export default BuzzCarousel;
