import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Container,
  InputAdornment,
  Pagination,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { buzzAPI } from '../services/api';

const Buzz = () => {
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [categories, setCategories] = useState([]);
  const [buzzContent, setBuzzContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load buzz content when category or page changes
  useEffect(() => {
    loadBuzzContent();
  });

  const loadCategories = async () => {
    try {
      const response = await buzzAPI.getCategories();
      if (response.categories) {
        // Filter out 'default' from response.categories to avoid duplication
        const filteredCategories = response.categories.filter(cat => cat !== 'default');
        setCategories(['default', ...filteredCategories]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    }
  };

  const loadBuzzContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const options = {
        format: 'json',
        pageno: currentPage,
        pageSize: 20,
      };

      const response = await buzzAPI.getBuzzContent(selectedCategory, options);
      
      if (response.blogs) {
        setBuzzContent(response.blogs);
        // Calculate total pages based on response if provided
        setTotalPages(response.totalPages || 1);
      } else {
        setBuzzContent([]);
        setError('No content available for this category');
      }
    } catch (error) {
      console.error('Error loading buzz content:', error);
      setError('Failed to load buzz content');
      setBuzzContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      loadBuzzContent();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await buzzAPI.searchBuzz(searchQuery, selectedCategory);
      
      if (response.blogs) {
        setBuzzContent(response.blogs);
        setTotalPages(1); // Search results usually on one page
      } else {
        setBuzzContent([]);
        setError('No results found for your search');
      }
    } catch (error) {
      console.error('Error searching buzz content:', error);
      setError('Failed to search buzz content');
      setBuzzContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const extractDomain = (url) => {
    if (!url) return '';
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch (error) {
      return '';
    }
  };

  const LoadingSkeleton = () => (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: 3, 
      mb: 4,
      justifyContent: 'flex-start'
    }}>
      {Array.from(new Array(3)).map((_, index) => (
        <Card 
          key={index} 
          sx={{
            height: '20vh',
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: '30%' },
            minHeight: '280px',
            maxHeight: '320px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Skeleton variant="rectangular" width="100%" height={140} />
          <CardContent sx={{ height: '180px', display: 'flex', flexDirection: 'column' }}>
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="100%" height={14} />
            <Skeleton variant="text" width="80%" height={14} />
            <Skeleton variant="text" width="60%" height={14} />
            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="rounded" width={70} height={20} />
              <Skeleton variant="text" width={50} height={14} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <>
      <ThemeToggle />
      <Box sx={{ ml: '80px' }}> {/* Add left margin to account for fixed navigation */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          <TrendingUpIcon sx={{ mr: 2, fontSize: 40 }} />
          Buzz
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Stay updated with the latest news and trends in Korea
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search buzz content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Category Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'capitalize',
              fontWeight: 600,
            },
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category === 'default' ? 'All' : category}
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Content Grid */}
      {!loading && !error && (
        <>
          {buzzContent.length > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 4,
              justifyContent: 'flex-start'
            }}>
              {buzzContent.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    height: '20vh',
                    width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)', lg: '30%' },
                    minHeight: '280px',
                    maxHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                    <CardActionArea
                      onClick={() => handleCardClick(item.url)}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'stretch',
                        justifyContent: 'flex-start'
                      }}
                    >
                      {/* Image */}
                      {item.thumbnail || item.img ? (
                        <CardMedia
                          component="img"
                          height="140" 
                          image={item.thumbnail || item.img}
                          alt={item.title || 'News image'}
                          sx={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div style="height: 140px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #666; font-size: 14px;">No Image</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: '140px',
                            backgroundColor: 'grey.100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No Image
                          </Typography>
                        </Box>
                      )}
                      
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex', 
                        flexDirection: 'column',
                        height: '180px', // Reduced from 220px to 180px
                        p: 2
                      }}>
                        {/* Title */}
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 'bold', 
                            lineHeight: 1.2,
                            height: '40px', // Reduced from 48px to 40px
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mb: 1,
                            fontSize: '1rem' // Slightly smaller font
                          }}
                        >
                          {item.title || 'Untitled'}
                        </Typography>
                        
                        {/* Content */}
                        {item.content && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ 
                              flexGrow: 1,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3, // Reduced from 4 to 3 lines
                              WebkitBoxOrient: 'vertical',
                              mb: 1.5, // Reduced margin
                              fontSize: '0.875rem',
                              lineHeight: 1.4
                            }}
                          >
                            {item.content}
                          </Typography>
                        )}
                        
                        {/* Metadata */}
                        <Box sx={{ mt: 'auto' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            {item.engine && (
                              <Chip
                                label={extractDomain(item.url) || item.engine}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                            {item.publishedDate && (
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(item.publishedDate)}
                              </Typography>
                            )}
                          </Box>
                          
                          {/* Score indicator if available */}
                          {item.score && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Relevance: {Math.round(item.score * 100)}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No content available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try selecting a different category or search term
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
    </Box>
    </>
  );
};

export default Buzz;
