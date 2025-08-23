import React, { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Search,
  Book,
  VideoLibrary,
  Quiz,
  Language,
  PlayArrow,
  Bookmark,
  BookmarkBorder,
  Star,
} from '@mui/icons-material';

const Library = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookmarkedItems, setBookmarkedItems] = useState(new Set());

  const libraryTabs = [
    { label: 'All', icon: <Book /> },
    { label: 'Courses', icon: <VideoLibrary /> },
    { label: 'Guides', icon: <Book /> },
    { label: 'Language', icon: <Language /> },
    { label: 'Tests', icon: <Quiz /> },
  ];

  const libraryItems = [
    {
      id: 1,
      title: 'Korean Language Basics',
      description: 'Essential vocabulary and grammar for beginners',
      type: 'Language Course',
      progress: 45,
      duration: '12 hours',
      level: 'Beginner',
      rating: 4.8,
      image: '/api/placeholder/300/200',
      category: 'language',
    },
    {
      id: 2,
      title: 'Seoul City Guide',
      description: 'Comprehensive guide to exploring Seoul',
      type: 'Travel Guide',
      progress: 75,
      duration: '2 hours',
      level: 'All Levels',
      rating: 4.6,
      image: '/api/placeholder/300/200',
      category: 'guides',
    },
    {
      id: 3,
      title: 'Korean Cuisine Cookbook',
      description: 'Traditional and modern Korean recipes',
      type: 'Cookbook',
      progress: 20,
      duration: '4 hours',
      level: 'Intermediate',
      rating: 4.9,
      image: '/api/placeholder/300/200',
      category: 'guides',
    },
    {
      id: 4,
      title: 'Business Korean Course',
      description: 'Professional Korean for workplace communication',
      type: 'Language Course',
      progress: 60,
      duration: '20 hours',
      level: 'Advanced',
      rating: 4.7,
      image: '/api/placeholder/300/200',
      category: 'language',
    },
    {
      id: 5,
      title: 'Korean Culture Quiz',
      description: 'Test your knowledge of Korean traditions',
      type: 'Quiz',
      progress: 100,
      duration: '30 minutes',
      level: 'All Levels',
      rating: 4.5,
      image: '/api/placeholder/300/200',
      category: 'tests',
    },
    {
      id: 6,
      title: 'Video: Korean Etiquette',
      description: 'Learn proper behavior in Korean society',
      type: 'Video Course',
      progress: 0,
      duration: '1.5 hours',
      level: 'Beginner',
      rating: 4.8,
      image: '/api/placeholder/300/200',
      category: 'courses',
    },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleBookmark = (itemId) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(itemId)) {
      newBookmarks.delete(itemId);
    } else {
      newBookmarks.add(itemId);
    }
    setBookmarkedItems(newBookmarks);
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 0) return matchesSearch; // All
    
    const tabCategory = libraryTabs[selectedTab].label.toLowerCase();
    const matchesTab = item.category === tabCategory;
    
    return matchesSearch && matchesTab;
  });

  const getProgressColor = (progress) => {
    if (progress === 100) return 'success';
    if (progress >= 50) return 'primary';
    if (progress > 0) return 'warning';
    return 'inherit';
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      <ThemeToggle />
      <Box sx={{ ml: '80px' }}> {/* Add left margin to account for fixed navigation */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your Library
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue your learning journey with personalized content and resources
        </Typography>
      </Box>

      {/* User Stats */}
      {user && (
        <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #57d1d6 0%, #c43e59 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
              <Avatar
                src={user.picture}
                sx={{ width: 60, height: 60, mr: 3 }}
              >
                {user.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Welcome back, {user.name || 'Student'}!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  You've completed 3 courses this month
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', mx: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  12
                </Typography>
                <Typography variant="body2">Courses</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', mx: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  48h
                </Typography>
                <Typography variant="body2">Study Time</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  85%
                </Typography>
                <Typography variant="body2">Avg. Progress</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search your library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: '600px', mx: 'auto', display: 'block' }}
        />
      </Box>

      {/* Category Tabs */}
      <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {libraryTabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Library Items */}
      <Grid container spacing={4}>
        {filteredItems.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No items found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your search or browse different categories.
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '420px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.title}
                    sx={{ backgroundColor: 'grey.200' }}
                  />
                  
                  {/* Bookmark Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(item.id);
                    }}
                  >
                    {bookmarkedItems.has(item.id) ? (
                      <Bookmark color="primary" />
                    ) : (
                      <BookmarkBorder />
                    )}
                  </IconButton>

                  {/* Play Button for Videos */}
                  {item.type.includes('Video') && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 40 }} />
                    </IconButton>
                  )}
                </Box>

                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '220px',
                  p: 2
                }}>
                  {/* Tags */}
                  <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={item.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={item.level}
                      size="small"
                      color={getLevelColor(item.level)}
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      height: '48px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 1
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      flexGrow: 1,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {item.description}
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      color={getProgressColor(item.progress)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Footer Info */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">{item.rating}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.duration}
                    </Typography>
                  </Box>

                  <Button
                    variant={item.progress > 0 ? 'contained' : 'outlined'}
                    fullWidth
                  >
                    {item.progress === 100 ? 'Review' : item.progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
    </Box>
    </>
  );
};

export default Library;
