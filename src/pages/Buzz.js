import {
    AddRounded,
    ArrowDownward,
    ArrowUpward,
    BookmarkBorder,
    ChatBubbleOutline,
    Favorite,
    FavoriteBorder,
    OutlinedFlag,
    ReplyOutlined
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    CircularProgress,
    IconButton,
    Skeleton,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import BuzzLightbox from "../components/BuzzLightbox";
import CommunityPostDialog from "../components/CommunityPostDialog";
import { buzzImagesAPI } from "../services/api";

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

    // NEW: arrow visibility state
    const [showUpArrow, setShowUpArrow] = useState(false); // initially hidden
    const [showDownArrow, setShowDownArrow] = useState(true); // initially visible

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
            }
        } catch (error) {
            setBuzzImages([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = useCallback(async () => {
        if (loadingMore || !hasMore || loading) {
            return;
        }

        setLoadingMore(true);
        const skip = page * POSTS_PER_PAGE;

        try {
            const data = (await buzzImagesAPI.list({ skip, limit: POSTS_PER_PAGE })) || [];

            if (Array.isArray(data) && data.length > 0) {
                setBuzzImages((prev) => {
                    return [...prev, ...data];
                });
                setPage((p) => p + 1);
                setHasMore(data.length === POSTS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore, hasMore, loading, page]);

    const lastPostElementRef = useCallback(
        (node) => {
            if (loading || loadingMore) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];

                    if (entry.isIntersecting && hasMore && !loadingMore) {
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
                observer.current.observe(node);
            }
        },
        [loading, hasMore, loadingMore, handleLoadMore]
    );

    // NEW: scroll listener to toggle arrow visibility
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const scrollTop = containerRef.current.scrollTop;
            const scrollHeight = containerRef.current.scrollHeight;
            const clientHeight = containerRef.current.clientHeight;

            // Show up arrow after user scrolls down some amount
            setShowUpArrow(scrollTop > 50);
            // Show down arrow if not at bottom
            setShowDownArrow(scrollTop + clientHeight < scrollHeight - 50);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll, { passive: true });
            // run once to set initial states correctly
            handleScroll();
        }
        return () => {
            if (container) container.removeEventListener("scroll", handleScroll);
        };
    }, [buzzImages, loading, loadingMore, hasMore]);

    // NEW: handlers for clicking arrows (page-like scroll by viewport height)
    const handleScrollDown = () => {
        if (!containerRef.current) return;
        const vh = containerRef.current.clientHeight; // use container's visible height
        containerRef.current.scrollBy({ top: vh, behavior: "smooth" });
    };

    const handleScrollUp = () => {
        if (!containerRef.current) return;
        const vh = containerRef.current.clientHeight;
        containerRef.current.scrollBy({ top: -vh, behavior: "smooth" });
    };

    const PostSkeleton = () => (
        <Box
            sx={{
                minHeight: { xs: "calc(100vh - 80px)", md: "100vh" },
                height: { xs: "calc(100vh - 80px)", md: "100vh" },
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "start",
                scrollSnapStop: "always",
                position: "relative",
                backgroundColor: "#f5f5f5",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: "calc(100% - 80px)",   // mobile (<600px)
                        sm: "min(450px, 90%)",     // tablet (600–900px)
                        md: "min(450px, 90%)",     // desktop (>900px)
                    },
                    height: {
                        xs: "calc(100vh - 160px)",
                        sm: "90vh",
                    },
                    maxHeight: { xs: "calc(100vh - 160px)", sm: "100vh" },
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    boxShadow: "none",

                    // --- Korean Flag Gradient Border (uniform across all devices) ---
                    border: "0.5mm solid transparent",
                    backgroundImage: {
                        xs: "linear-gradient(white, white), linear-gradient(135deg, #000 0%, #c60c30 50%, #003478 100%)",
                        sm: "linear-gradient(white, white), linear-gradient(135deg, #000 0%, #c60c30 50%, #003478 100%)",
                        md: "linear-gradient(white, white), linear-gradient(135deg, #000 0%, #c60c30 50%, #003478 100%)",
                    },
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",

                    // Ensures border visibility is consistent (tablet fix)
                    "@media (min-width:600px) and (max-width:900px)": {
                        borderWidth: "0.6mm",
                    },
                }}
            >


                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    animation="wave"
                    sx={{ borderRadius: { xs: 3, sm: 3 } }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: { xs: 20, sm: 20 },
                        left: { xs: 16, sm: 20 },
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        zIndex: 1,
                    }}
                >
                    <Skeleton variant="circular" width={36} height={36} />
                    <Skeleton variant="text" width={100} height={20} />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: { xs: 16, sm: 20 },
                        right: { xs: 16, sm: 20 },
                        zIndex: 1,
                    }}
                >
                    <Skeleton variant="text" width="80%" height={16} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={16} />
                </Box>

                {/* Mobile/Tablet skeleton buttons overlay */}
                <Box
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        flexDirection: "column",
                        gap: 2,
                        position: "absolute",
                        right: 16,
                        bottom: 30,
                        zIndex: 3,
                    }}
                >
                    {[1, 2, 3].map((i) => (
                        <Skeleton
                            key={i}
                            variant="circular"
                            width={48}
                            height={48}
                            animation="wave"
                            sx={{ bgcolor: "#d6d6d6" }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Desktop side skeleton buttons */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    height: "85vh",
                }}
            >
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                        key={i}
                        variant="circular"
                        width={48}
                        height={48}
                        animation="wave"
                        sx={{ bgcolor: "#d6d6d6" }}
                    />
                ))}
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
        } finally { setLightboxSubmittingComment(false); }
    };

    const PostCard = ({ post, isLast }) => {
        const [liked, setLiked] = useState(false);

        useEffect(() => {
            if (!post.id) return;
            let cancelled = false;
            const run = async () => {
                try {
                    const likeData = await buzzImagesAPI.getLikes(post.id);
                    if (cancelled) return;
                    setLiked(likeData.isLiked || false);
                } catch {
                    if (cancelled) return;
                    setLiked(false);
                }
            };
            run();
            return () => { cancelled = true; };
        }, [post.id]);

        const handleLike = async (e) => {
            e.stopPropagation();
            try {
                const result = await buzzImagesAPI.toggleLike(post.id);
                setLiked(result.isLiked);
            } catch {
                setLiked(prev => !prev);
            }
        };

        return (
            <Box
                ref={isLast ? lastPostElementRef : null}
                sx={{
                    minHeight: { xs: "calc(100vh - 80px)", md: "100vh" },
                    height: { xs: "calc(100vh - 80px)", md: "100vh" },
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    scrollSnapAlign: "start",
                    scrollSnapStop: "always",
                    position: "relative",
                    backgroundColor: "#fff",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: {
                            xs: "calc(100% - 80px)",   // mobile (<600px)
                            sm: "min(450px, 90%)",     // tablet (600–900px)
                            md: "min(450px, 90%)",     // desktop (>900px)
                        },
                        height: {
                            xs: "calc(100vh - 160px)",
                            sm: "90vh",
                        },
                        maxHeight: { xs: "calc(100vh - 160px)", sm: "100vh" },
                        position: "relative",
                        borderRadius: 7,
                        overflow: "hidden",
                        backgroundColor: "black",
                        boxShadow: "none",

                        // --- Korean Flag Gradient Border (uniform across all devices) ---
                        border: "5px solid transparent",
                        backgroundImage: `
                                        linear-gradient(black, black),
                                        linear-gradient(135deg, #ffffff 15%, #0055a4 50%, #ff0000 85%)
                                        `,
                        backgroundOrigin: "border-box",
                        backgroundClip: "content-box, border-box",

                        // Ensures border visibility is consistent (tablet fix)
                        "@media (min-width:600px) and (max-width:900px)": {
                            borderWidth: "5px",
                        },
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

                    {/* User info overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: { xs: 20, sm: 20 },
                            left: { xs: 16, sm: 20 },
                            right: { xs: 16, sm: 20 },
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

                    {/* Mobile/Tablet Actions Overlay */}
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            position: "absolute",
                            right: 16,
                            zIndex: 3,
                            top: 20
                        }}
                    >
                        <IconButton
                            aria-label="add community post"
                            onClick={() => setPostOpen(true)}
                            sx={{
                                width: { xs: 44, md: 50 },
                                height: { xs: 44, md: 50 },
                                borderRadius: "50%",
                                border: "2px solid #fff",
                                color: "#fff",
                                transition: "all 0.2s",
                            }}
                        >
                            <AddRounded sx={{ fontSize: { xs: 26, md: 30 } }} />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            flexDirection: "column",
                            gap: 2,
                            position: "absolute",
                            right: 16,
                            bottom: 30,
                            zIndex: 3,
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
                            {/* {likeCount > 0 && (
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
                                        )} */}
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
                            <ReplyOutlined sx={{ fontSize: 26, transform: 'rotate(-5deg) scaleX(-1)' }} />
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
                            <BookmarkBorder sx={{ fontSize: 26 }} />
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
                            <OutlinedFlag sx={{ fontSize: 26 }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        height: {
                            xs: "calc(100vh - 160px)",
                            sm: "85vh",
                        },
                    }}
                >
                    {/* Desktop side actions */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" }, // Show only on desktop
                            flexDirection: "column",
                            gap: 2,
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            height: "85vh",
                        }}
                    >
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

                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" }, // Show only on desktop
                                flexDirection: "column",
                                gap: 2,
                                alignItems: "flex-end",
                            }}
                        >

                            <Box sx={{ textAlign: "center" }}>
                                <IconButton
                                    onClick={handleLike}
                                    sx={{
                                        color: liked ? "#ff4444" : "#000000",
                                        backgroundColor: "rgba(0,0,0,0.05)",
                                        backdropFilter: "blur(10px)",
                                        "&:hover": {
                                            backgroundColor: "rgba(0,0,0,0.1)",
                                            transform: "scale(1.1)",
                                        },
                                        transition: "all 0.2s",
                                        width: 48,
                                        height: 48,
                                    }}
                                >
                                    {liked ? <Favorite sx={{ fontSize: 28 }} /> : <FavoriteBorder sx={{ fontSize: 28 }} />}
                                </IconButton>
                                {/* {likeCount > 0 && (
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
 )} */}
                            </Box>

                            <IconButton
                                onClick={() => handleOpenLightbox(post)}
                                sx={{
                                    color: "#000000",
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
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
                                    color: "#000000",
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                        transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <ReplyOutlined sx={{ fontSize: 26, transform: 'rotate(-5deg) scaleX(-1)' }} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: "#000000",
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                        transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <BookmarkBorder sx={{ fontSize: 26 }} onClick={() => console.log("hello")} />
                            </IconButton>
                            <IconButton
                                sx={{
                                    color: "#000000",
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    backdropFilter: "blur(10px)",
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                        transform: "scale(1.1)",
                                    },
                                    transition: "all 0.2s",
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <OutlinedFlag sx={{ fontSize: 26 }} />
                            </IconButton>
                        </Box>
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
                    pt: { xs: '80px', md: 0 }, // Add padding top for mobile header
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

            {/* NEW: Floating arrows - placed so they don't overlap desktop action buttons */}
            {/* 🆕 Floating scroll arrows (center aligned on right side) */}
            {/* 🆕 Floating scroll arrows (center aligned, visible only >900px) */}
            <Box
                sx={{
                    position: "fixed",
                    right: 25,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: { xs: "none", sm: "none", md: "flex" }, // hides for <900px
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 200,
                    gap: 1.5,
                }}
            >
                {showUpArrow && (
                    <IconButton
                        onClick={handleScrollUp}
                        sx={{
                            backgroundColor: "rgba(0,0,0,0.05)",
                            color: "#000000",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                            width: 50,
                            height: 50,
                        }}
                    >
                        <ArrowUpward />
                    </IconButton>
                )}

                {showDownArrow && (
                    <IconButton
                        onClick={handleScrollDown}
                        sx={{
                            backgroundColor: "rgba(0,0,0,0.05)",
                            color: "#000000",
                            "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" },
                            width: 50,
                            height: 50,
                        }}
                    >
                        <ArrowDownward />
                    </IconButton>
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
