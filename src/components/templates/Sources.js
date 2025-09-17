import React from 'react';
import { Box, Link, Typography, useTheme } from '@mui/material';
import { Source, OpenInNew } from '@mui/icons-material';

const Sources = ({ sources }) => {
  const theme = useTheme();

  if (!sources || sources.length === 0) return null;

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Source sx={{ color: '#666', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666' }}>
          Sources
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {sources.map((source, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {source.name}
            </Typography>
            <Link
              href={source.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#3289C9',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Visit
              <OpenInNew sx={{ fontSize: 16 }} />
            </Link>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sources;