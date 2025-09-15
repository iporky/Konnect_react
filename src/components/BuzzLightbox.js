import React from 'react';
import { Modal, Box, IconButton, Typography, Avatar, TextField } from '@mui/material';
import { Close, Send } from '@mui/icons-material';

const BuzzLightbox = ({ open, onClose, post, comments, newComment, setNewComment, handleSubmitComment, loadingComments, submittingComment }) => {
  if (!post) return null;
  const title = post.title || 'Buzz';
  const description = post.description || '';
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95vw', md: '95vw' },
        height: { xs: '600px', md: '90vh' },
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
      }}>
        {/* Left: Enlarged Image */}
        <Box sx={{
          flex: 2.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#90949C',
          minWidth: 0,
          height: '100%',
        }}>
          {post.url ? (
            <img
              src={post.url}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadiusLeft: '8px',
                background: '#90949C',
                display: 'block',
              }}
            />
          ) : (
            <Box sx={{ color: '#fff', fontSize: 18 }}>No Image</Box>
          )}
        </Box>
        {/* Right: Comments */}
        <Box sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          minWidth: 0,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
            <IconButton onClick={onClose}><Close /></IconButton>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>{description}</Typography>
          {/* Add comment form */}
          <Box component="form" onSubmit={handleSubmitComment} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <TextField
              size="small"
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <IconButton type="submit" size="small" disabled={!newComment.trim() || submittingComment}>
              <Send fontSize="small" />
            </IconButton>
          </Box>
          {/* Comments list */}
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            {loadingComments ? (
              <Typography variant="body2" color="text.secondary">Loading comments...</Typography>
            ) : (
              comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No comments yet</Typography>
              ) : (
                comments.map((comment, index) => (
                  <Box key={comment.id || index} sx={{ mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 13 }}>{comment.user?.name?.[0] || 'U'}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{comment.user?.name || 'Anonymous'}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{comment.content}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuzzLightbox;
