import {
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

const FeedbackPopup = ({ open, onClose }) => {
  const [type, setType] = useState('suggest');
  const [message, setMessage] = useState('');
  const [includeScreenshot, setIncludeScreenshot] = useState(false);
  const [wantReply, setWantReply] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to API/email. For now, just close if message exists
    if (!message.trim()) return;
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 200 } }}>
      <Box
        sx={{
          position: 'fixed',
          right: { xs: 12, md: 40 },
          bottom: { xs: 12, md: 110 },
          width: { xs: 'calc(100% - 24px)', sm: 360 },
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          outline: 'none',
          zIndex: 1600,
        }}
      >
  {/* Header */}
  <Box sx={{ px: 2.5, py: 1.5, backgroundColor: '#3289C9', color: '#fff' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Feedback</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ px: 2.5, py: 2.5 }}>
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
            placeholder="Include details such as missing or incorrect links. Don't include your name, email, or other personal info."
            fullWidth
            multiline
            minRows={4}
            sx={{ my: 1 }}
          />

          {/* Options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={<Checkbox checked={includeScreenshot} onChange={(e) => setIncludeScreenshot(e.target.checked)} />}
              label="Include a screenshot"
            />
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
              disabled={!message.trim()}
              sx={{ borderRadius: 999, px: 5, boxShadow: '0 8px 18px rgba(0,0,0,0.12)' }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeedbackPopup;
