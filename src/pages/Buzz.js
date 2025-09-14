// Facebook-style Buzz feed with comments
import {
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Favorite as FavoriteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { buzzImagesAPI } from '../services/api';

const Buzz = () => {
  const theme = useTheme();
  const [buzzImages, setBuzzImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [comments, setComments] = useState({}); // Store comments per post
  const [newComment, setNewComment] = useState({}); // Store new comment text per post
  const [showComments, setShowComments] = useState({}); // Toggle comments visibility per post

  const POSTS_PER_PAGE = 5;

  // Initial fetch
  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buzzImagesAPI.list({ skip: 0, limit: POSTS_PER_PAGE });
      if (Array.isArray(data)) {
        setBuzzImages(data);
        setHasMore(data.length === POSTS_PER_PAGE);
        setPage(1);
      } else {
        setBuzzImages([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading buzz images:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const skip = page * POSTS_PER_PAGE;
      const data = await buzzImagesAPI.list({ skip, limit: POSTS_PER_PAGE });
      
      if (Array.isArray(data) && data.length > 0) {
        setBuzzImages(prev => [...prev, ...data]);
        setHasMore(data.length === POSTS_PER_PAGE);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  // Scroll handler for infinite scroll
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore) {
      return;
    }
    loadMorePosts();
  }, [loadingMore, loadMorePosts]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Comment handlers
  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const addComment = (postId) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    const comment = {
      id: Date.now(),
      text: commentText,
      author: 'You', // In real app, get from user context
      timestamp: new Date(),
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));

    setNewComment(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  const handleKeyPress = (postId, event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addComment(postId);
    }
  };

  const LoadingSkeleton = () => (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
      {Array.from(new Array(3)).map((_, index) => (
        <Paper 
          key={index}
          elevation={3}
          sx={{ 
            mb: 3, 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          {/* Post header */}
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2.5 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="35%" height={24} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="25%" height={18} />
            </Box>
          </Box>
          
          {/* Post content */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Skeleton variant="text" width="95%" height={22} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={22} />
          </Box>
          
          {/* Post image */}
          <Box sx={{ px: 3, pb: 2 }}>
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="45vh" 
              sx={{ borderRadius: 3, bgcolor: '#6F95BD' }}
            />
          </Box>
          
          {/* Action buttons */}
          <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" width={120} height={40} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rounded" width={100} height={40} sx={{ borderRadius: 3 }} />
          </Box>
        </Paper>
      ))}
    </Box>
  );

  const PostCard = ({ post }) => {
    const postComments = comments[post.id] || [];
    const isCommentsVisible = showComments[post.id];
    const commentText = newComment[post.id] || '';

    return (
      <Paper 
        elevation={3}
        sx={{ 
          mb: 3, 
          borderRadius: 4,
          overflow: 'hidden',
          maxWidth: 800,
          mx: 'auto',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        {/* Post Header */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            width: 56, 
            height: 56, 
            mr: 2.5, 
            bgcolor: 'linear-gradient(45deg, #3289C9 30%, #5ba7f7 90%)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(50, 137, 201, 0.3)'
          }}>
            {post.title?.[0]?.toUpperCase() || 'B'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              lineHeight: 1.3,
              fontSize: '1.25rem',
              color: '#1a1a1a'
            }}>
              {post.title || 'Buzz Post'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ 
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Box>

        {/* Post Content */}
        {post.description && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="body1" sx={{ 
              lineHeight: 1.6,
              fontSize: '1.1rem',
              color: '#2c2c2c',
              fontWeight: 400
            }}>
              {post.description}
            </Typography>
          </Box>
        )}

        {/* Post Image */}
        {post.url && (
          <Box sx={{ px: 1, pb: 2, bgcolor: '#6F95BD', borderRadius: 3, display: 'flex', justifyContent: 'center' }}>
            <CardMedia 
              component="img" 
              image={post.url} 
              alt={post.title || 'Buzz image'} 
              sx={{ 
                width: '100%',
                height: '50vh',
                objectFit: 'contain',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                backgroundColor: '#6F95BD'
              }} 
            />
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              startIcon={<FavoriteIcon />}
              variant="text"
              size="medium"
              sx={{ 
                color: 'text.secondary', 
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 3,
                px: 2.5,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(255, 71, 87, 0.08)',
                  color: '#ff4757'
                }
              }}
            >
              Like
            </Button>
            <Button
              startIcon={<ChatBubbleOutlineIcon />}
              variant="text"
              size="medium"
              onClick={() => toggleComments(post.id)}
              sx={{ 
                color: 'text.secondary', 
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 3,
                px: 2.5,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(50, 137, 201, 0.08)',
                  color: '#3289C9'
                }
              }}
            >
              Comment ({postComments.length})
            </Button>
          </Box>

          {/* Comments Section */}
          {isCommentsVisible && (
            <>
              <Divider sx={{ my: 2, bgcolor: 'rgba(0,0,0,0.08)' }} />
              
              {/* Existing Comments */}
              {postComments.map((comment) => (
                <Box key={comment.id} sx={{ mb: 2.5, display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    mr: 1.5, 
                    bgcolor: 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)', 
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#666'
                  }}>
                    {comment.author[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Paper elevation={0} sx={{ 
                      bgcolor: '#f8f9fa', 
                      p: 2, 
                      borderRadius: 3,
                      border: '1px solid rgba(0,0,0,0.04)'
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 700,
                        color: '#3289C9',
                        fontSize: '0.9rem'
                      }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mt: 0.5,
                        fontSize: '1rem',
                        lineHeight: 1.5,
                        color: '#2c2c2c'
                      }}>
                        {comment.text}
                      </Typography>
                    </Paper>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      ml: 1.5, 
                      fontSize: '0.8rem',
                      fontWeight: 500
                    }}>
                      {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Add Comment */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ 
                  width: 36, 
                  height: 36, 
                  mr: 1.5, 
                  bgcolor: 'linear-gradient(45deg, #3289C9 30%, #5ba7f7 90%)', 
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(50, 137, 201, 0.3)'
                }}>
                  Y
                </Avatar>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Write a thoughtful comment..."
                  value={commentText}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(post.id, e)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 4,
                      bgcolor: '#f8f9fa',
                      fontSize: '1rem',
                      '&:hover': {
                        bgcolor: '#f0f2f5'
                      },
                      '&.Mui-focused': {
                        bgcolor: '#ffffff',
                        boxShadow: '0 0 0 2px rgba(50, 137, 201, 0.2)'
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        size="medium" 
                        onClick={() => addComment(post.id)}
                        disabled={!commentText.trim()}
                        sx={{
                          bgcolor: commentText.trim() ? '#3289C9' : 'transparent',
                          color: commentText.trim() ? 'white' : 'disabled',
                          '&:hover': {
                            bgcolor: commentText.trim() ? '#2a7bb8' : 'transparent',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(0,0,0,0.3)'
                          }
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ 
      color: theme.palette.text.primary, 
      minHeight: '100vh',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: '#3289C9',
              fontFamily: 'Metropolis',
              fontWeight: 800,
              fontSize: { xs: '40px', md: '64px' },
              lineHeight: 1,
              letterSpacing: { xs: '-0.4px', md: '-0.64px' },
              mb: 2
            }}
          >
            Buzz Feed
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            fontSize: { xs: '18px', md: '22px' }
          }}>
            Discover what's happening in your community
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ 
            mb: 4, 
            maxWidth: 800, 
            mx: 'auto',
            borderRadius: 3,
            fontSize: '1.1rem'
          }}>
            {error}
          </Alert>
        )}

        {/* Loading Skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Posts Feed */}
        {!loading && !error && (
          <>
            {buzzImages.length === 0 ? (
              <Paper sx={{ 
                p: 6, 
                textAlign: 'center', 
                maxWidth: 800, 
                mx: 'auto',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
              }}>
                <Typography variant="h4" color="text.secondary" gutterBottom sx={{
                  fontWeight: 600,
                  mb: 2
                }}>
                  No posts yet
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{
                  fontWeight: 400,
                  opacity: 0.8
                }}>
                  Be the first to share something with the community!
                </Typography>
              </Paper>
            ) : (
              <>
                {/* Posts */}
                {buzzImages.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}

                {/* Load More Button / Loading More */}
                {hasMore && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    {loadingMore ? (
                      <Paper sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            Loading more posts...
                          </Typography>
                        </Box>
                      </Paper>
                    ) : (
                      <Button 
                        variant="outlined" 
                        onClick={loadMorePosts}
                        sx={{ 
                          borderRadius: 3,
                          px: 4,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Load More Posts
                      </Button>
                    )}
                  </Box>
                )}

                {!hasMore && buzzImages.length > 0 && (
                  <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      You've reached the end of the feed
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Buzz;
