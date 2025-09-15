// Grid-based Buzz gallery: 3 cards per row (28vw each). Description at bottom, icons below image (Instagram style), lightbox on comment click.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChatBubbleOutlineOutlined, FavoriteOutlined } from '@mui/icons-material';
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
  CircularProgress
} from '@mui/material';
import BuzzLightbox from '../components/BuzzLightbox';
import { buzzImagesAPI } from '../services/api';

const CARD_WIDTH = '28vw';
const CARD_ASPECT_RATIO = 4 / 5;
const POSTS_PER_PAGE = 6; // load 6 images at a time

const Buzz = () => {
  const theme = useTheme();
  const [buzzImages, setBuzzImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // true during 500ms delay + fetch
  const sentinelRef = useRef(null);
  const delayTimeoutRef = useRef(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lightboxComments, setLightboxComments] = useState([]);
  const [lightboxNewComment, setLightboxNewComment] = useState('');
  const [lightboxLoadingComments, setLightboxLoadingComments] = useState(false);
  const [lightboxSubmittingComment, setLightboxSubmittingComment] = useState(false);

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
  const fetchMore = useCallback(async () => {
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
  }, [hasMore, page]);

  // Schedule fetch with 500ms delay; if already scheduling/fetching do nothing
  const scheduleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true); // show loader immediately during delay
    if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current);
    delayTimeoutRef.current = setTimeout(() => {
      fetchMore();
    }, 1500);
  }, [loadingMore, hasMore, fetchMore]);

  // Infinite scroll via IntersectionObserver (delayed)
  useEffect(() => {
    if (!hasMore) return; // no need to observe if no more data
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        scheduleLoadMore();
      }
    }, {
      root: null,
      rootMargin: '400px 0px 0px 0px',
      threshold: 0
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [scheduleLoadMore, hasMore]);

  // Fallback: if initial content height is shorter than viewport and we still have more, attempt additional loads until filled or no more
  useEffect(() => {
    if (!loading && hasMore && document.documentElement.scrollHeight <= window.innerHeight + 50) {
      scheduleLoadMore();
    }
  }, [loading, hasMore, scheduleLoadMore]);

  // Cleanup any pending timeout on unmount
  useEffect(() => () => { if (delayTimeoutRef.current) clearTimeout(delayTimeoutRef.current); }, []);

  // Post card
  const PostCard = ({ post }) => {
    const title = post.title || 'Buzz';
    const description = post.description || '';
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const loadLikeStatus = useCallback(async () => {
      try {
        const likeData = await buzzImagesAPI.getLikes(post.id);
        setLiked(likeData.isLiked || false);
        setLikeCount(likeData.count || 0);
      } catch { setLiked(false); setLikeCount(0); }
    }, [post.id]);

    useEffect(() => { if (post.id) loadLikeStatus(); }, [post.id, loadLikeStatus]);

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
      <Box sx={{ width: { xs: '100%', sm: '100%', md: CARD_WIDTH }, maxWidth: { xs: '100%', md: 420 }, flex: { xs: '1 1 100%', md: `0 0 ${CARD_WIDTH}` }, position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: '#90949C', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
        {/* Top header with avatar + username */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.2, py: 1, background: '#f5f5f5', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 30, height: 30, fontSize: 14 }}>{(post.username || 'U')[0]}</Avatar>
            <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Metropolis', fontSize: 14 }}>
              {post.username || 'username'}
            </Typography>
          </Box>
        </Box>
        {/* Image */}
        <Box onClick={handleOpenLightbox} sx={{ position: 'relative', width: '100%', aspectRatio: `${1 / CARD_ASPECT_RATIO}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#90949C' }}>
          {post.url ? (
            <CardMedia component="img" src={post.url} alt={title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (<Box sx={{ color: '#fff', fontSize: 18 }}>No Image</Box>)}
          <Box className="titleOverlay" sx={{ position: 'absolute', top: 8, left: 8, px: 1.2, py: 0.6, borderRadius: 1, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: 0.3, opacity: 0, transform: 'translateY(-8px)', transition: 'opacity .35s ease, transform .35s ease', maxWidth: '85%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</Box>
        </Box>
        {/* Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', px: 1.2, py: 0.8, background: '#f5f5f5', borderTop: '1px solid rgba(0,0,0,0.08)', gap: 2 }}>
          <IconButton size="small" onClick={handleOpenLightbox} sx={{ color: '#3289C9', mr: 1, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}><ChatBubbleOutlineOutlined fontSize="small" /></IconButton>
          <IconButton size="small" onClick={handleLike} sx={{ color: liked ? '#e91e63' : theme.palette.text.secondary, '&:hover': { backgroundColor: liked ? 'rgba(233,30,99,0.1)' : 'rgba(0,0,0,0.04)' } }}>
            <FavoriteOutlined fontSize="small" sx={{ fill: liked ? '#e91e63' : 'transparent', stroke: liked ? '#e91e63' : theme.palette.text.secondary, strokeWidth: liked ? 0 : 1 }} />
          </IconButton>
          <Typography variant="body2" sx={{ fontSize: 12, color: theme.palette.text.secondary }}>{likeCount}</Typography>
        </Box>
        {/* Bottom description only */}
        <Box sx={{ width: '100%', p: 1.2, background: '#f5f5f5', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.4 }}>{description}</Typography>
        </Box>
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

  return (
    <Box sx={{ color: theme.palette.text.primary, minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ color: '#3289C9', fontFamily: 'Metropolis', fontWeight: 800, fontSize: { xs: '36px', md: '54px' }, lineHeight: 1, letterSpacing: { xs: '-0.4px', md: '-0.64px' }, mb: 2 }}>Buzz Gallery</Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: { xs: '16px', md: '20px' } }}>Discover what's happening in your community</Typography>
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
              </Box>
            )}
            {/* Sentinel element for IntersectionObserver */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {!hasMore && buzzImages.length > 0 && (<Box sx={{ textAlign: 'center', mt: 4 }}><Typography variant="body2" color="text.secondary">You've reached the end</Typography></Box>)}
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
      </Container>
    </Box>
  );
};

// Skeleton loader component
const LoadingSkeleton = () => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
    {Array.from(new Array(6)).map((_, i) => (
      <Box key={i} sx={{ width: CARD_WIDTH, maxWidth: 420, position: 'relative' }}>
        <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: `${1 / CARD_ASPECT_RATIO}`, bgcolor: '#90949C', borderRadius: 2 }} />
        <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
      </Box>
    ))}
  </Box>
);

export default Buzz;
