import React from 'react';
import {
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import {
  Box,
  FormControlLabel,
  Switch,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();

  return (
    <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              icon={<LightMode sx={{ fontSize: '1.2rem' }} />}
              checkedIcon={<DarkMode sx={{ fontSize: '1.2rem' }} />}
              sx={{
                width: 62, // Increased from default
                height: 34, // Increased from default
                padding: 0,
                '& .MuiSwitch-switchBase': {
                  padding: 0,
                  margin: 1,
                  transitionDuration: '300ms',
                  '&.Mui-checked': {
                    transform: 'translateX(28px)', // Adjusted for larger size
                    color: '#fff',
                    '& + .MuiSwitch-track': {
                      backgroundColor: theme.palette.primary.main,
                      opacity: 1,
                      border: 0,
                    },
                  },
                },
                '& .MuiSwitch-thumb': {
                  boxSizing: 'border-box',
                  width: 30, // Increased from default
                  height: 30, // Increased from default
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                '& .MuiSwitch-track': {
                  borderRadius: 34 / 2,
                  backgroundColor: theme.palette.mode === 'light' ? '#1d4484' : '#39393D',
                  opacity: 1,
                  transition: theme.transitions.create(['background-color'], {
                    duration: 500,
                  }),
                },
              }}
            />
          }
          label=""
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '50px',
            p: 1,
            boxShadow: theme.shadows[4],
          }}
        />
      </motion.div>
    </Box>
  );
};

export default ThemeToggle;
