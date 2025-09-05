import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';

// Password dialog that requests the search password each time
export default function SearchPasswordDialog({ open, onClose, onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const searchPassword = process.env.REACT_APP_SEARCH_PASSWORD || '';

  useEffect(() => {
    if (open) {
      setValue('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchPassword) {
      setError('Search password not configured.');
      return;
    }
    if (value === searchPassword) {
      onSuccess(); // parent will decide when to close
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 0 }}>Enter Search Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This feature is password protected. Enter the access password to continue.
          </Typography>
          <TextField
            type="password"
            fullWidth
            autoFocus
            margin="dense"
            label="Password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            error={!!error}
            helperText={error || ' '}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={onClose} variant="text">Cancel</Button>
          <Button type="submit" variant="contained" disabled={!value}>Submit</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
