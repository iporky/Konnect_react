import React from 'react';
import {
  HomeRounded,
  HomeOutlined,
  Newspaper,
  NewspaperOutlined,
  AutoStories,
  AutoStoriesOutlined,
  LanguageRounded,
  LanguageOutlined,
} from '@mui/icons-material';

// Icons inherit color from parent wrapper (Navigation sets it).
// Required size: width 24px, height 24px for all icons.
const iconSize = { width: 24, height: 24 };

export const CustomHomeIcon = ({ selected = false, sx, ...props }) => (
  selected ? (
  <HomeRounded color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  ) : (
  <HomeOutlined color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  )
);

export const CustomBuzzIcon = ({ selected = false, sx, ...props }) => (
  selected ? (
  <Newspaper color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  ) : (
  <NewspaperOutlined color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  )
);

export const CustomLibraryIcon = ({ selected = false, sx, ...props }) => (
  selected ? (
  <AutoStories color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  ) : (
  <AutoStoriesOutlined color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  )
);

export const CustomLanguageIcon = ({ selected = false, sx, ...props }) => (
  selected ? (
  <LanguageRounded color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  ) : (
  <LanguageOutlined color="inherit" sx={{ ...iconSize, ...(sx || {}) }} {...props} />
  )
);
