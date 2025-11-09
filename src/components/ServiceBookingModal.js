import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Fade,
  Slide
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import bookingServices from '../services/bookingServices';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ServiceBookingModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1: service selection, 2: thank you
  const [selectedService, setSelectedService] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+82'); // Default to South Korea
  const [serviceOfferings, setServiceOfferings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load service offerings when modal opens
  useEffect(() => {
    const loadServiceOfferings = async () => {
      try {
        setLoading(true);
        const offerings = await bookingServices.getServiceOfferings();
        setServiceOfferings(bookingServices.formatServiceOfferings(offerings));
      } catch (error) {
        console.error('Failed to load service offerings:', error);
        setError('Failed to load service offerings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      loadServiceOfferings();
    }
  }, [open]);

  const handleServiceSubmit = async () => {
    if (!selectedService) {
      setError('Please select a service');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Prepare booking data
      const hasEmail = emailInput.trim().length > 0;
      const hasPhone = phoneInput.trim().length > 0;
      const fullPhone = hasPhone ? `${countryCode}${phoneInput.trim()}` : '';
      const bookingData = {
        service_name: selectedService,
        requirements: serviceDescription.trim() || 'No specific requirements provided',
        email: hasEmail ? emailInput.trim() : 'BTEST1PPPP880@konnect.kr',
        phone: fullPhone,
        need_callback: hasEmail || hasPhone,
        status: 'PENDING'
      };

      // Submit booking request
      const result = await bookingServices.submitBookingRequest(bookingData);
      console.log('Booking submitted successfully:', result);
      
      // Move to thank you step
      setStep(2);
    } catch (error) {
      console.error('Failed to submit booking request:', error);
      setError('Failed to submit booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset modal state
    setStep(1);
    setSelectedService('');
    setServiceDescription('');
    setEmailInput('');
    setPhoneInput('');
    setCountryCode('+82');
    setError('');
    onClose();
  };



  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      scroll="body"
      PaperProps={{
        sx: {
          borderRadius: 3,
          m: 1,
          maxHeight: '90vh',
          height: 'auto',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        pt: 2,
        px: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#6F95BD' }}>
          Book a Service
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ 
        pt: 0, 
        px: 2, 
        pb: 2,
        overflow: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}>
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <Fade in={true}>
            <Box>
              <DialogContentText sx={{ mb: 1, fontSize: '14px', lineHeight: 1.4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>
                  The Superapp for Foreigners
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  We are in the beta stage of our app and are building the perfect services for you. Let us know which service you need in Korea! Your voice will be heard!
                </Typography>
              </DialogContentText>

              {/* Service Selection Dropdown */}
              {serviceOfferings.length > 0 && (
                <FormControl fullWidth sx={{ mb: 1.5 }} size="small">
                  <InputLabel>Select a Service</InputLabel>
                  <Select
                    value={selectedService}
                    label="Select a Service"
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                    }}
                    disabled={loading}
                  >
                    {serviceOfferings.map((service) => (
                      <MenuItem key={service.id} value={service.value}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {service.label}
                          </Typography>
                          {service.description && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {service.description}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Service Description Text Box */}
              {selectedService && (
                <TextField
                  fullWidth
                  label="Describe your needs"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  multiline
                  rows={2}
                  placeholder="Describe what you need help with..."
                  sx={{ mb: 1.5 }}
                  size="small"
                  helperText="Brief description of your service needs"
                />
              )}

              {/* Optional Email Field */}
              {selectedService && (
                <TextField
                  fullWidth
                  type="email"
                  label="Email (Optional)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  sx={{ mb: 1.5 }}
                  size="small"
                  helperText="For CEO Ravi to contact you personally"
                />
              )}

              {/* Optional Phone Field */}
              {selectedService && (
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                  <FormControl sx={{ minWidth: 100 }} size="small">
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={countryCode}
                      label="Country"
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <MenuItem value="+82">🇰🇷 +82</MenuItem>
                      <MenuItem value="+1">🇺🇸 +1</MenuItem>
                      <MenuItem value="+44">🇬🇧 +44</MenuItem>
                      <MenuItem value="+81">🇯🇵 +81</MenuItem>
                      <MenuItem value="+86">🇨🇳 +86</MenuItem>
                      <MenuItem value="+91">🇮🇳 +91</MenuItem>
                      <MenuItem value="+49">🇩🇪 +49</MenuItem>
                      <MenuItem value="+33">🇫🇷 +33</MenuItem>
                      <MenuItem value="+39">🇮🇹 +39</MenuItem>
                      <MenuItem value="+34">🇪🇸 +34</MenuItem>
                      <MenuItem value="+61">🇦🇺 +61</MenuItem>
                      <MenuItem value="+55">🇧🇷 +55</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    type="tel"
                    label="Phone Number (Optional)"
                    value={phoneInput}
                    onChange={(e) => {
                      // Remove any non-digit characters except spaces and dashes
                      const cleaned = e.target.value.replace(/[^\d\s-]/g, '');
                      setPhoneInput(cleaned);
                    }}
                    size="small"
                    placeholder="10-1234-5678"
                    helperText="Alternative contact method"
                  />
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 1.5 }} variant="outlined">
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                <Button onClick={handleClose} disabled={loading} size="small">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleServiceSubmit}
                  disabled={loading || !selectedService}
                  size="small"
                  sx={{
                    backgroundColor: '#6F95BD',
                    '&:hover': {
                      backgroundColor: '#5A7BA3'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={16} color="inherit" /> : 'Submit'}
                </Button>
              </Box>
            </Box>
          </Fade>
        )}

        {/* Step 2: Thank You */}
        {step === 2 && (
          <Fade in={true}>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#6F95BD' }}>
                Thank You! 🎉
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2.5, color: 'text.secondary' }}>
                We have received your request for "{selectedService}".
                <br />
                {emailInput.trim() || phoneInput.trim() ? (
                  <>
                    Ravi will reach out to you 
                    {emailInput.trim() && ` at ${emailInput}`}
                    {emailInput.trim() && phoneInput.trim() && ' or'}
                    {phoneInput.trim() && ` at ${countryCode}${phoneInput}`} soon!
                  </>
                ) : 
                  'Your request has been submitted and will be processed shortly!'
                }
              </Typography>

              <Button
                variant="contained"
                onClick={handleClose}
                size="small"
                sx={{
                  backgroundColor: '#6F95BD',
                  '&:hover': {
                    backgroundColor: '#5A7BA3'
                  },
                  px: 3
                }}
              >
                Close
              </Button>
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;