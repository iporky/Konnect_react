// Grid-based Buzz gallery: 3 cards per row (28vw each). Description at bottom, icons below image (Instagram style), lightbox on comment click.
import React, { useEffect, useState } from 'react';
import { ChatBubbleOutlineOutlined, FavoriteOutlined, Send } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  CardMedia,
  Container,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
  CircularProgress,
  Slide,
  Paper,
  Button
} from '@mui/material';
import BuzzLightbox from '../components/BuzzLightbox';
import { buzzImagesAPI } from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../store';
import { useNavigate } from 'react-router-dom';

const CARD_WIDTH = '28vw';
const CARD_ASPECT_RATIO = 4 / 5;
const POSTS_PER_PAGE = 6; // load 6 images at a time

const Buzz = () => {
  const theme = useTheme();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [buzzImages, setBuzzImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // true during 500ms delay + fetch

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lightboxComments, setLightboxComments] = useState([]);
  const [lightboxNewComment, setLightboxNewComment] = useState('');
  const [lightboxLoadingComments, setLightboxLoadingComments] = useState(false);
  const [lightboxSubmittingComment, setLightboxSubmittingComment] = useState(false);

  // Auth gating state
  const [authGateActive, setAuthGateActive] = useState(false); // true once we need login to continue
  const [authGateDismissed, setAuthGateDismissed] = useState(false); // user closed sheet without login

  useEffect(() => { fetchInitial(); }, []); // initial load

  const fetchInitial = async () => {
    try {
      setLoading(true); setError(null);
      const data = await buzzImagesAPI.list({ skip: 0, limit: POSTS_PER_PAGE });
      if (Array.isArray(data)) {
        setBuzzImages(data);
        setHasMore(data.length === POSTS_PER_PAGE);
        setPage(1);
      } else { setBuzzImages([]); setHasMore(false); }
    } catch (e) { setError('Failed to load posts'); } finally { setLoading(false); }
  };

  // Actual fetch (assumes loadingMore already true)
  const fetchMore = async () => {
    if (!hasMore) { setLoadingMore(false); return; }
    const skip = page * POSTS_PER_PAGE;
    try {
      const data = await buzzImagesAPI.list({ skip, limit: POSTS_PER_PAGE });
      if (Array.isArray(data) && data.length) {
        setBuzzImages(prev => [...prev, ...data]);
        setHasMore(data.length === POSTS_PER_PAGE);
        setPage(p => p + 1);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  // Post card
  const PostCard = ({ post }) => {
    const title = post.title || 'Buzz';
    const description = post.description || '';
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Load like status when post.id changes
    useEffect(() => {
      if (!post.id) return;
      let cancelled = false;
      const run = async () => {
        try {
          const likeData = await buzzImagesAPI.getLikes(post.id);
          if (cancelled) return;
            setLiked(likeData.isLiked || false);
            setLikeCount(likeData.count || 0);
        } catch {
          if (cancelled) return;
          setLiked(false);
          setLikeCount(0);
        }
      };
      run();
      return () => { cancelled = true; };
    }, [post.id]);

    const handleLike = async (e) => {
      e.stopPropagation();
      try {
        const result = await buzzImagesAPI.toggleLike(post.id);
        setLiked(result.isLiked); setLikeCount(result.count);
      } catch {
        setLiked(prev => !prev); setLikeCount(c => (liked ? c - 1 : c + 1));
      }
    };

    const handleOpenLightbox = async (e) => {
      e.stopPropagation();
      setSelectedPost(post); setLightboxOpen(true); setLightboxLoadingComments(true);
      try {
        const commentsData = await buzzImagesAPI.getComments(post.id, { limit: 50 });
        setLightboxComments(Array.isArray(commentsData) ? commentsData : []);
      } catch { setLightboxComments([]); }
      finally { setLightboxLoadingComments(false); }
      setLightboxNewComment('');
    };

    return (
      <Box sx={{ width: { xs: '100%', sm: '100%', md: CARD_WIDTH }, maxWidth: { xs: '100%', md: 420 }, flex: { xs: '1 1 100%', md: `0 0 ${CARD_WIDTH}` }, position: 'relative', borderRadius: 2, bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0, py: 1.2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>{(post.username || 'U')[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{post.username || 'username'}</Typography>
          </Box>
        </Box>
        {/* Image (with border) */}
        <Box onClick={handleOpenLightbox} sx={{ position: 'relative', width: '100%', aspectRatio: `${1 / CARD_ASPECT_RATIO}`, backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
          {post.url ? (
            <CardMedia component="img" src={post.url} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (<Box sx={{ color: '#fff', fontSize: 18 }}>No Image</Box>)}
        </Box>
        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, px: 0, pt: 0.5 }}>
          <IconButton size="medium" onClick={handleLike} sx={{ color: liked ? '#e91e63' : '#000' }}>
            <FavoriteOutlined fontSize="medium" sx={{ fill: liked ? '#e91e63' : 'transparent', stroke: liked ? '#e91e63' : '#000', strokeWidth: liked ? 0 : 1.6 }} />
          </IconButton>
          <IconButton size="medium" onClick={handleOpenLightbox} sx={{ color: '#000' }}>
            <ChatBubbleOutlineOutlined fontSize="medium" />
          </IconButton>
          <IconButton size="medium" sx={{ color: '#000' }}>
            <Send fontSize="medium" />
          </IconButton>
        </Box>
        {/* Likes count */}
        <Box sx={{ px: 2, mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</Typography>
        </Box>
        {/* Description */}
        {description && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>{post.username || 'username'}</Box>{description}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // Lightbox comment submit
  const handleLightboxSubmitComment = async (e) => {
    e.preventDefault();
    if (!selectedPost || !lightboxNewComment.trim() || lightboxSubmittingComment) return;
    try {
      setLightboxSubmittingComment(true);
      const comment = await buzzImagesAPI.addComment(selectedPost.id, lightboxNewComment.trim());
      setLightboxComments(prev => [comment, ...prev]);
      setLightboxNewComment('');
    } finally { setLightboxSubmittingComment(false); }
  };

  // Auth bottom sheet component
  const AuthBottomSheet = ({ open, onClose, onLogin, onSignup }) => (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper elevation={16} sx={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1400, borderTopLeftRadius: 0, borderTopRightRadius: 0, p: { xs: 2, md: 4 }, bgcolor: '#fff', boxShadow: '0 -4px 24px rgba(0,0,0,0.18)' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto', width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>Continue Reading More Posts</Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Paper variant="outlined" sx={{ flex: 1, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Free Account</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Create a free account to keep exploring the Buzz gallery.</Typography>
              <Button fullWidth variant="contained" color="primary" onClick={onSignup} sx={{ borderRadius: 2, py: 1.2 }}>Sign Up Free</Button>
            </Paper>
            <Paper variant="outlined" sx={{ flex: 1, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Already a member?</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Log in to load more posts and engage with the community.</Typography>
              <Button fullWidth variant="outlined" color="primary" onClick={onLogin} sx={{ borderRadius: 2, py: 1.2 }}>Log In</Button>
            </Paper>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button size="small" color="secondary" onClick={onClose}>Back</Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );

  useEffect(() => {
    if (user && authGateActive) {
      // User logged in while sheet open; allow loading
      setAuthGateActive(false);
      setAuthGateDismissed(false);
    }
  }, [user, authGateActive]);

  const handleLoadMore = async () => {
    if (loadingMore) return;
    if (!user) {
      setAuthGateActive(true);
      setAuthGateDismissed(false);
      return;
    }
    if (!hasMore) return;
    setLoadingMore(true);
    await fetchMore();
  };

  return (
    <Box sx={{ color: theme.palette.text.primary, minHeight: '100vh', pb: 6, px: '10vw' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: { xs: 'left', md: 'left' } }}>
          <Typography variant="h2" component="h1" sx={{ color: '#3289C9', fontFamily: 'Metropolis', fontWeight: 800, fontSize: { xs: '36px', md: '54px' }, lineHeight: 1, letterSpacing: { xs: '-0.4px', md: '-0.64px' }, mb: 0 }}>Buzz Gallery</Typography>
        </Box>
        {error && (<Alert severity="error" sx={{ mb: 4, maxWidth: 900, mx: 'auto', borderRadius: 3, fontSize: '1.05rem' }}>{error}</Alert>)}
        {loading && <LoadingSkeleton />}
        {!loading && !error && (
          <>
            {buzzImages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}><Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>No posts yet</Typography></Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, flexWrap: { md: 'wrap' }, gap: 5, justifyContent: 'center', alignItems: { xs: 'stretch', md: 'center' } }}>
                {buzzImages.map(p => <PostCard key={p.id} post={p} />)}
              </Box>
            )}
            {hasMore && (
              <Box sx={{ textAlign: 'center', mt: 4, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {loadingMore && <CircularProgress size={28} thickness={4} />}
                {!loadingMore && (
                  <Button variant="outlined" onClick={handleLoadMore} sx={{ borderRadius: 2, px: 3, py: 1.2, color: '#3289C9', borderColor: '#3289C9', '&:hover': { borderColor: '#1d6f9a', color: '#1d6f9a' } }}>
                    Load More
                  </Button>
                )}
              </Box>
            )}
            {!hasMore && buzzImages.length > 0 && (<Box sx={{ textAlign: 'center', mt: 4 }}><Typography variant="body2" color="text.secondary">You've reached the end</Typography></Box>)}
            {authGateDismissed && !user && hasMore && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Please login to load further posts.
                </Typography>
              </Box>
            )}
          </>
        )}
        <BuzzLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          post={selectedPost}
          comments={lightboxComments}
          newComment={lightboxNewComment}
          setNewComment={setLightboxNewComment}
          handleSubmitComment={handleLightboxSubmitComment}
          loadingComments={lightboxLoadingComments}
          submittingComment={lightboxSubmittingComment}
        />
        <AuthBottomSheet
          open={authGateActive && !authGateDismissed}
          onClose={() => setAuthGateDismissed(true)}
          onLogin={() => { navigate('/login'); }}
          onSignup={() => { navigate('/signup'); }}
        />
      </Container>
    </Box>
  );
};

// Skeleton loader component
const LoadingSkeleton = () => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
    {Array.from(new Array(6)).map((_, i) => (
      <Box key={i} sx={{ width: '32vw', maxWidth: 480, position: 'relative', height:  '30vh', maxHeight: 600, borderRadius: 2, overflow: 'hidden' }}>
        <Skeleton animation="wave" variant="circular" width={40} height={40} />
        <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }}/>
        <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={12} width="80%" />
      </Box>
    ))}
  </Box>
);

export default Buzz;
