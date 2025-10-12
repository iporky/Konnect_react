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
  Add,
} from "@mui/icons-material";
import { buzzImagesAPI } from "../services/api";
import BuzzLightbox from "../components/BuzzLightbox";
import CommunityPostDialog from "../components/CommunityPostDialog";
import { useSelector } from "react-redux";
import { selectUser } from "../store";

const POSTS_PER_PAGE = 3;

const Buzz = () => {
  const [buzzImages, setBuzzImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postOpen, setPostOpen] = useState(false);
  const user = useSelector(selectUser);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    setLoading(true);
    try {
      const data = await buzzImagesAPI.list({ skip: 0, limit: POSTS_PER_PAGE });
      if (Array.isArray(data)) {
        setBuzzImages(data);
        setHasMore(data.length === POSTS_PER_PAGE);
      } else {
        setBuzzImages([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load initial posts:", error);
      setBuzzImages([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const skip = page * POSTS_PER_PAGE;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await buzzImagesAPI.list({ skip, limit: POSTS_PER_PAGE });
      if (Array.isArray(data) && data.length > 0) {
        setBuzzImages((prev) => [...prev, ...data]);
        setPage((p) => p + 1);
        setHasMore(data.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // --- Enhanced Skeleton Loader ---
  const PostSkeleton = () => (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "450px",
          height: "90vh",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: "#eee",
          position: "relative",
        }}
      >
        {/* Post Image Placeholder */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ borderRadius: 3 }}
        />

        {/* Username & Caption Placeholder (Bottom Left) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>

        {/* Action Buttons Placeholder (Bottom Right) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            right: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="circular"
              width={36}
              height={36}
              animation="wave"
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const toggleLike = () => {
      setLiked(!liked);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    };

    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scrollSnapAlign: "start",
          backgroundColor: "transparent",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "450px",
            height: "90vh",
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "#eee",
            boxShadow: "0 0 10px rgba(0,0,0,0.25)",
          }}
        >
          <img
            src={post.url}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onClick={() => {
              setSelectedPost(post);
              setLightboxOpen(true);
            }}
          />

          {/* Left bottom: username & description */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              color: "#fff",
              textShadow: "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 28, height: 28, fontSize: 14 }}>
                {post.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {post.username || "username"}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "#f5f5f5" }}>
              {post.description || "describing the moment"}
            </Typography>
          </Box>

          {/* Right bottom: Action buttons */}
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={toggleLike}
              sx={{ color: liked ? "red" : "gray", backgroundColor: "#d8d4db" }}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton sx={{ color: "gray", backgroundColor: "#d8d4db" }}>
              <ChatBubbleOutline />
            </IconButton>
            <IconButton sx={{ color: "gray", backgroundColor: "#d8d4db" }}>
              <Send />
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
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        "&::-webkit-scrollbar": { display: "none" },
        backgroundColor: "#fff",
      }}
    >
      <IconButton
        onClick={() => setPostOpen(true)}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: "#000",
          color: "#fff",
          "&:hover": { backgroundColor: "#333" },
          zIndex: 10,
        }}
      >
        <Add />
      </IconButton>

      {loading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </>
      ) : (
        <>
          {buzzImages.map((post, index) => {
            if (buzzImages.length === index + 1) {
              return (
                <div ref={lastPostElementRef} key={post.id}>
                  <PostCard post={post} />
                </div>
              );
            } else {
              return <PostCard key={post.id} post={post} />;
            }
          })}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
              minHeight: "60px",
            }}
          >
            {loadingMore && <CircularProgress color="inherit" size={24} />}
            {!hasMore && buzzImages.length > 0 && !loadingMore && (
              <Typography color="text.secondary">
                You've reached the end 👋
              </Typography>
            )}
          </Box>
        </>
      )}

      <BuzzLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        post={selectedPost}
      />
      <CommunityPostDialog open={postOpen} onClose={() => setPostOpen(false)} />
    </Box>
  );
};

export default Buzz;
