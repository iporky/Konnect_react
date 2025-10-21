import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Box,
    Avatar,
    IconButton,
    Typography,
    CircularProgress,
    Skeleton,
} from "@mui/material";
import {
    FavoriteBorder,
    Favorite,
    ChatBubbleOutline,
    Send,
    AddRounded,
} from "@mui/icons-material";
import { buzzImagesAPI } from "../services/api";
import BuzzLightbox from "../components/BuzzLightbox";
import CommunityPostDialog from "../components/CommunityPostDialog";

const POSTS_PER_PAGE = 3;

const Buzz = () => {
    const [buzzImages, setBuzzImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postOpen, setPostOpen] = useState(false); 

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [lightboxComments, setLightboxComments] = useState([]);
    const [lightboxNewComment, setLightboxNewComment] = useState('');
    const [lightboxLoadingComments, setLightboxLoadingComments] = useState(false);
    const [lightboxSubmittingComment, setLightboxSubmittingComment] = useState(false);

    const containerRef = useRef(null);
    const observer = useRef();

    useEffect(() => {
        loadInitialPosts();
    }, []);

    const loadInitialPosts = async () => {
        setLoading(true);
        try {
            const data = (await buzzImagesAPI.list({ skip: 0, limit: POSTS_PER_PAGE })) || [];
            if (Array.isArray(data)) {
                setBuzzImages(data);
                setHasMore(data.length === POSTS_PER_PAGE);
            } else {
                setBuzzImages([]);
                setHasMore(false);
                console.error("buzzImagesAPI.list did not return an array:", data);
            }
        } catch (error) {
            console.error("Failed to load initial posts:", error);
            setBuzzImages([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = useCallback(async () => {
        console.log('handleLoadMore called', { loadingMore, hasMore, loading, page });
        if (loadingMore || !hasMore || loading) {
            console.log('Skipping load - conditions not met');
            return;
        }

        setLoadingMore(true);
        const skip = page * POSTS_PER_PAGE;
        console.log('Fetching posts with skip:', skip, 'limit:', POSTS_PER_PAGE);

        try {
            const data = (await buzzImagesAPI.list({ skip, limit: POSTS_PER_PAGE })) || [];
            console.log('Fetched data:', data.length, 'posts');

            if (Array.isArray(data) && data.length > 0) {
                setBuzzImages((prev) => {
                    console.log('Adding posts, previous count:', prev.length, 'new count:', prev.length + data.length);
                    return [...prev, ...data];
                });
                setPage((p) => p + 1);
                setHasMore(data.length === POSTS_PER_PAGE);
                console.log('Has more posts:', data.length === POSTS_PER_PAGE);
            } else {
                console.log('No more posts available');
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more posts:", error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
            console.log('Load more completed');
        }
    }, [loadingMore, hasMore, loading, page]);

    const lastPostElementRef = useCallback(
        (node) => {
            if (loading || loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    console.log('Intersection observed:', {
                        isIntersecting: entry.isIntersecting,
                        intersectionRatio: entry.intersectionRatio,
                        hasMore,
                        loadingMore
                    });

                    if (entry.isIntersecting && hasMore && !loadingMore) {
                        console.log('Loading more posts...');
                        handleLoadMore();
                    }
                },
                {
                    threshold: 0.3,
                    root: null,
                    rootMargin: '100px'
                }
            );

            if (node) {
                console.log('Started observing the last post element');
                observer.current.observe(node);
            }
        },
        [loading, hasMore, loadingMore, handleLoadMore]
    );

    const PostSkeleton = () => (
        <Box
            sx={{
                minHeight: "100vh",
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: "100%",
                        sm: "90%",
                        md: "min(450px, 90%)",
                    },
                    height: {
                        xs: "100%",
                        sm: "90vh",
                    },
                    maxHeight: "100vh",
                    borderRadius: { xs: 0, sm: 3 },
                    overflow: "hidden",
                    backgroundColor: "#e0e0e0",
                    position: "relative",
                    boxShadow: { xs: "none", sm: "0 4px 20px rgba(0,0,0,0.15)" },
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                    sx={{ borderRadius: { xs: 0, sm: 3 } }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        zIndex: 1,
                    }}
                >
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="text" width={100} height={20} />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        zIndex: 1,
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="circular" width={48} height={48} animation="wave" />
                    ))}
                </Box>
            </Box>
        </Box>
    );

    const handleOpenLightbox = async (post) => {
        setSelectedPost(post);
        setLightboxOpen(true);
        setLightboxLoadingComments(true);
        try {
            const commentsData = await buzzImagesAPI.getComments(post.id, { limit: 50 });
            setLightboxComments(Array.isArray(commentsData) ? commentsData : []);
        } catch {
            setLightboxComments([]);
            console.error("Failed to load comments for post:", post.id);
        }
        finally { setLightboxLoadingComments(false); }
        setLightboxNewComment('');
    };

    const handleLightboxSubmitComment = async (e) => {
        e.preventDefault();
        if (!selectedPost || !lightboxNewComment.trim() || lightboxSubmittingComment) return;
        try {
            setLightboxSubmittingComment(true);
            const comment = await buzzImagesAPI.addComment(selectedPost.id, lightboxNewComment.trim());
            setLightboxComments(prev => [comment, ...prev]);
            setLightboxNewComment('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally { setLightboxSubmittingComment(false); }
    };

    const PostCard = ({ post, isLast }) => {
        const [liked, setLiked] = useState(false);
        const [likeCount, setLikeCount] = useState(0);

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

        return (
            <Box
                ref={isLast ? lastPostElementRef : null}
                sx={{
                    minHeight: "100vh",
                    height: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    position: "relative",
                    backgroundColor: "#f5f5f5",
                }}
            >
                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            sm: "90%",
                            md: "min(450px, 90%)",
                        },
                        height: {
                            xs: "100%",
                            sm: "90vh",
                        },
                        maxHeight: "100vh",
                        position: "relative",
                        borderRadius: { xs: 0, sm: 3 },
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        boxShadow: { xs: "none", sm: "0 4px 20px rgba(0,0,0,0.3)" },
                    }}
                >
                    <img
                        src={post.url}
                        alt={post.title || "Buzz post"}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            cursor: "pointer",
                        }}
                        onClick={() => handleOpenLightbox(post)}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: 20, sm: 20 },
                            left: { xs: 16, sm: 20 },
                            right: { xs: 90, sm: 100 },
                            color: "#fff",
                            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                            zIndex: 2,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    border: "2px solid rgba(255,255,255,0.8)",
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                {post.username?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    letterSpacing: "0.3px",
                                }}
                            >
                                {post.username || "username"}
                            </Typography>
                        </Box>
                        {post.description && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "rgba(255,255,255,0.95)",
                                    fontSize: "0.9rem",
                                    lineHeight: 1.4,
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {post.description}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: 20, sm: 20 },
                            right: { xs: 16, sm: 20 },
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            alignItems: "center",
                            zIndex: 2,
                        }}
                    >
                        <Box sx={{ textAlign: "center" }}>
                            <IconButton
                                onClick={handleLike}
                                sx={{
                                    color: liked ? "#ff4444" : "#fff",
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.5)",
                                        transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                {liked ? <Favorite sx={{ fontSize: 28 }} /> : <FavoriteBorder sx={{ fontSize: 28 }} />}
                            </IconButton>
                            {likeCount > 0 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#fff",
                                        fontWeight: 600,
                                        textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                                        display: "block",
                                        mt: 0.5,
                                    }}
                                >
                                    {likeCount}
                                </Typography>
                            )}
                        </Box>

                        <IconButton
                            onClick={() => handleOpenLightbox(post)}
                            sx={{
                                color: "#fff",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(10px)",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    transform: "scale(1.1)",
                                },
                                transition: "all 0.2s",
                                width: 48,
                                height: 48,
                            }}
                        >
                            <ChatBubbleOutline sx={{ fontSize: 26 }} />
                        </IconButton>

                        <IconButton
                            sx={{
                                color: "#fff",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                backdropFilter: "blur(10px)",
                                "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.5)",
                                    transform: "scale(1.1)",
                                },
                                transition: "all 0.2s",
                                width: 48,
                                height: 48,
                            }}
                        >
                            <Send sx={{ fontSize: 26 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f5f5f5",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: "linear-gradient(to bottom, rgba(245,245,245,0.95) 0%, rgba(245,245,245,0.7) 70%, transparent 100%)",
                    pointerEvents: "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: { xs: 2, md: 3 },
                        py: 2,
                        pointerEvents: "auto",
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        sx={{
                            color: "#222",
                            fontFamily: "Metropolis",
                            fontWeight: 800,
                            fontSize: { xs: '40px', md: '54px' },
                            lineHeight: 1,
                            letterSpacing: { xs: '-0.4px', md: '-0.64px' },
                        }}
                    >
                        Buzz
                    </Typography>
                    <IconButton
                        aria-label="add community post"
                        onClick={() => setPostOpen(true)}
                        sx={{
                            width: { xs: 44, md: 50 },
                            height: { xs: 44, md: 50 },
                            borderRadius: "50%",
                            border: "2px solid #222",
                            color: "#222",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            "&:hover": {
                                backgroundColor: "#fff",
                                transform: "scale(1.05)",
                            },
                            transition: "all 0.2s",
                        }}
                    >
                        <AddRounded sx={{ fontSize: { xs: 26, md: 30 } }} />
                    </IconButton>
                </Box>
            </Box>

            <Box
                ref={containerRef}
                sx={{
                    height: "100vh",
                    width: "100%",
                    overflowY: "scroll",
                    overflowX: "hidden",
                    scrollSnapType: "y mandatory",
                    scrollBehavior: "smooth",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {loading ? (
                    <PostSkeleton />
                ) : buzzImages.length === 0 ? (
                    <Box
                        sx={{
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            scrollSnapAlign: "start",
                        }}
                    >
                        <Typography color="#666" variant="h6" sx={{ mb: 2 }}>
                            No posts yet
                        </Typography>
                        <Typography color="#999" variant="body2">
                            Be the first to add one!
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {buzzImages.map((post, index) => {
                            const isLast = index === buzzImages.length - 1;
                            console.log(`Rendering post ${index + 1}/${buzzImages.length}, isLast: ${isLast}`);
                            return (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    isLast={isLast}
                                />
                            );
                        })}

                        {loadingMore && (
                            <Box
                                sx={{
                                    height: "100vh",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    scrollSnapAlign: "start",
                                }}
                            >
                                <CircularProgress sx={{ color: "#666" }} size={40} />
                                <Typography sx={{ ml: 2, color: "#666" }}>Loading more...</Typography>
                            </Box>
                        )}
                        {!hasMore && buzzImages.length > 0 && (
                            <Box sx={{
                                height: "50vh",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                scrollSnapAlign: "start",
                                pb: 10
                            }}>
                                <Typography variant="body2" color="text.secondary">You've reached the end</Typography>
                            </Box>
                        )}
                    </>
                )}
            </Box>

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
            <CommunityPostDialog open={postOpen} onClose={() => setPostOpen(false)} />
        </Box>
    );
};

export default Buzz;