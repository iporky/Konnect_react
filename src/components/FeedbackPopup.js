import {
  Alert,
  Backdrop,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { feedbacksAPI } from '../services/api';

const FeedbackPopup = ({ open, onClose }) => {
  const [type, setType] = useState('suggest'); // like | dislike | suggest
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [wantReply, setWantReply] = useState(false);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess('');
    
    if (!message.trim()) {
      setSubmitError('Please enter feedback details');
      return;
    }
    
    if (!email.trim()) {
      setSubmitError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubmitError('Please enter a valid email address');
      return;
    }
    
    try {
      setSubmitting(true);
      await feedbacksAPI.submit({
        type,
        details: message.trim(),
        user_email: email.trim(),
        feedback_reply: wantReply,
        file: includeScreenshot ? file : null
      });
      setSuccess('Feedback submitted. Thank you!');
      setTimeout(() => {
        onClose?.();
        setMessage('');
        setEmail('');
        setFile(null);
        setIncludeScreenshot(false);
        setWantReply(false);
        setSuccess('');
      }, 1200);
    } catch (err) {
      console.error('Feedback submit failed', err);
      setSubmitError(err?.response?.data?.detail || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 200 } }}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          right: { xs: 12, md: 40 },
          transform: 'translateY(-50%)',
          width: { xs: 'calc(100% - 24px)', sm: 380 },
          maxHeight: 'calc(100vh - 32px)',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          outline: 'none',
          zIndex: 1600,
          '@media (max-height:500px)': {
            top: 8,
            transform: 'none',
            maxHeight: 'calc(100vh - 16px)'
          }
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2.5, py: 1.5, backgroundColor: '#3289C9', color: '#fff' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>Feedback</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, py: 2.5, overflowY: 'auto' }}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>
          )}
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>
          )}
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Please click on the specific area of the page that your feedback is related to.
          </Typography>

          {/* Type */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup row={false} value={type} onChange={(e) => setType(e.target.value)}>
              <FormControlLabel value="suggest" control={<Radio />} label="Suggest" />
              <FormControlLabel value="like" control={<Radio />} label="Like" />
              <FormControlLabel value="dislike" control={<Radio />} label="Dislike" />
            </RadioGroup>
          </FormControl>

          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Include details such as missing or incorrect links."
            fullWidth
            multiline
            minRows={4}
            sx={{ my: 1 }}
          />

          {/* Email field */}
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            fullWidth
            type="email"
            required
            sx={{ my: 1 }}
            helperText="Email is required for all feedback submissions"
          />

          {/* Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={includeScreenshot} onChange={(e) => { setIncludeScreenshot(e.target.checked); if (!e.target.checked) setFile(null); }} />}
              label="Add a file"
            />
            {includeScreenshot && (
              <Button
                variant="outlined"
                component="label"
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              >
                {file ? file.name : 'Choose image'}
                <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Button>
            )}
            <FormControlLabel
              control={<Checkbox checked={wantReply} onChange={(e) => setWantReply(e.target.checked)} />}
              label={"I'd like to hear back about my feedback"}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!message.trim() || !email.trim() || submitting}
              sx={{ borderRadius: 999, px: 5, boxShadow: '0 8px 18px rgba(0,0,0,0.12)' }}
            >
              {submitting ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeedbackPopup;
