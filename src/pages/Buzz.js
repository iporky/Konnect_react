// Removed search icon as search bar is removed
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Skeleton,
  Typography,
  useTheme,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
// Removed ThemeToggle per request
import { buzzImagesAPI } from '../services/api';

const Buzz = () => {
  const theme = useTheme();
  const [buzzImages, setBuzzImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10); // how many to fetch
  const [fetchingMore, setFetchingMore] = useState(false);

  // Initial & subsequent fetch when limit changes
  useEffect(() => {
    let active = true;
    const fetchImages = async () => {
      try {
        if (limit === 10) setLoading(true); else setFetchingMore(true);
        setError(null);
        const data = await buzzImagesAPI.list({ skip: 0, limit });
        if (!active) return;
        if (Array.isArray(data)) {
          setBuzzImages(data);
        } else {
          setBuzzImages([]);
        }
      } catch (err) {
        if (!active) return;
        console.error('Error loading buzz images:', err);
        setError('Failed to load buzz images');
      } finally {
        if (!active) return;
        setLoading(false);
        setFetchingMore(false);
      }
    };
    fetchImages();
    return () => { active = false; };
  }, [limit]);

  const loadMore = () => setLimit(l => l + 20);

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
  {/* Page wrapper inside global white container */}
  <Box sx={{ color: theme.palette.text.primary, display: 'flex', flexDirection: 'column', alignItems: 'stretch', pb: { xs: 6, md: 10, lg: 14 } }}>
      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          ml: { xs: 0, md: 30 },
          // Match AboutUs hero height so the rounded container fills similarly
          minHeight: { xs: 'calc(100vh - 64px)', md: '86vh' },
        }}
      >
      {/* Header (logo and subheading removed) */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            color: '#3289C9',
            fontFamily: 'Metropolis',
            fontWeight: 700,
            fontSize: { xs: '32px', md: '56px' },
            lineHeight: 1.1,
            letterSpacing: { xs: '-0.32px', md: '-0.56px' },
          }}
        >
          Buzz
        </Typography>
      </Box>

      {/* Unified Buzz Images (only source) */}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {loading && <LoadingSkeleton />}
      {!loading && !error && (
        <>
          {buzzImages.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">No images yet</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
              {buzzImages.map(img => (
                <Card key={img.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 16px)' }, maxWidth: 320, display: 'flex', flexDirection: 'column' }}>
                  {img.url && (
                    <CardMedia component="img" image={img.url} alt={img.title || 'Buzz image'} sx={{ height: 160, objectFit: 'cover' }} />
                  )}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {img.title || 'Untitled'}
                    </Typography>
                    {img.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                        {img.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">{new Date(img.created_at).toLocaleDateString()}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1, ml: { xs: 0, md: -10 } }}>
            <Button variant="contained" onClick={loadMore} disabled={fetchingMore} sx={{ borderRadius: 6, px: 4, minWidth: 180 }}>
              {fetchingMore ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        </>
      )}
    </Container>
    </Box>
    </>
  );
};

export default Buzz;
