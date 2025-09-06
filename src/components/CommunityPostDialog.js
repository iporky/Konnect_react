import React, { useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';
import { communityAPI } from '../services/communityAPI';

const MAX_FILES = 8;
const MAX_SIZE_MB = 8;
const DESC_LIMIT = 300;

const CommunityPostDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const textMuted = 'rgba(0, 0, 0, 0.40)';
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [posted, setPosted] = useState(false);
  const [postedResult, setPostedResult] = useState(null);

  const disabled = useMemo(() => {
    return !(title.trim() || desc.trim() || files.length);
  }, [title, desc, files]);

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const filtered = incoming.filter(
      (f) => f.size <= MAX_SIZE_MB * 1024 * 1024 && /^(image|video)\//.test(f.type)
    );
    const next = [...files, ...filtered].slice(0, MAX_FILES);
    setFiles(next);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || submitting) return;
    setSubmitError('');
    const payload = { title: title.trim(), description: desc.trim(), files };
    try {
      setSubmitting(true);
      const result = await communityAPI.uploadBuzzImage(payload);
      setPosted(true);
      setPostedResult(result);
      onSubmit?.(result);
    } catch (err) {
      console.error(err);
      setSubmitError(err?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
      {!posted && (
        <>
          <DialogTitle sx={{ pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Community Post</Typography>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 1 }}>
            <Typography variant="body2" sx={{ color: textMuted, mb: 2 }}>
              Share your Korean journey, post photos, videos...
            </Typography>
            {submitError && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>{submitError}</Typography>
            )}

        {/* Dropzone */}
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: dragOver ? 'action.hover' : 'transparent',
            cursor: 'pointer',
            mb: 2,
          }}
        >
          <CloudUploadOutlined sx={{ fontSize: 36, color: textMuted, mb: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: textMuted }}>Drag 'n' drop files here, or click to select files</Typography>
          <Typography variant="caption" sx={{ color: textMuted }}>
            You can upload up to {MAX_FILES} files, {MAX_SIZE_MB} MB each
          </Typography>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
        </Box>

        {/* Selected files list (simple) */}
        {files.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: textMuted }}>{files.length} file(s) selected</Typography>
          </Box>
        )}

          <Box component="form" onSubmit={handleSubmit}>
          <TextField
            placeholder="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 1.5,
              '& .MuiInputBase-input::placeholder, & textarea::placeholder': {
                color: textMuted,
                opacity: 1,
              },
            }}
          />
          <Box sx={{ position: 'relative' }}>
            <Box
              component="textarea"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, DESC_LIMIT))}
              rows={6}
              sx={{
                width: '100%',
                fontFamily: 'inherit',
                fontSize: 14,
                lineHeight: 1.5,
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                resize: 'vertical',
                backgroundColor: 'background.paper',
                color: 'text.primary',
                '&::placeholder': { color: textMuted, opacity: 1 },
                '&:focus': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 0 }
              }}
            />
            <Typography variant="caption" sx={{ position: 'absolute', right: 8, bottom: 4, color: textMuted }}>
              {desc.length}/{DESC_LIMIT}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" disabled={disabled || submitting} sx={{ width: 160, borderRadius: 999 }}>
              {submitting ? 'Uploading...' : 'Submit'}
            </Button>
          </Box>
        </Box>
          </DialogContent>
        </>
      )}
      {posted && (
        <>
          <DialogTitle sx={{ pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Posted Successfully</Typography>
            <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: 'success.dark', mb: 1 }}>✓</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Your post has been uploaded.</Typography>
            {postedResult?.title && <Typography variant="body2" color="text.secondary">{postedResult.title}</Typography>}
            <Button variant="contained" sx={{ mt: 2, borderRadius: 999, px: 4 }} onClick={() => { setPosted(false); setPostedResult(null); setFiles([]); setTitle(''); setDesc(''); onClose?.(); }}>
              Done
            </Button>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default CommunityPostDialog;
