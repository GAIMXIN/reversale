import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assests/img/logo.png';

const steps = ['Business Information', 'Goals & Interests', 'Contact Details'];

export default function Onboarding() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    businessDescription: '',
    goals: '',
    interests: '',
    preferredContact: 'email',
    additionalInfo: '',
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Save data to localStorage
      localStorage.setItem('onboardingData', JSON.stringify(formData));
      navigate('/login');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Do you currently have a business or company?</FormLabel>
              <RadioGroup
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes, I have a business" />
                <FormControlLabel value="no" control={<Radio />} label="No, I don't have a business" />
                <FormControlLabel value="planning" control={<Radio />} label="I'm planning to start one" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Business Name (if applicable)"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Brief Description of Your Business/Plans"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              label="What are your main goals?"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
              helperText="Tell us about your business or personal goals"
            />

            <TextField
              fullWidth
              label="What are your interests?"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
              helperText="What areas are you most interested in?"
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">Preferred Contact Method</FormLabel>
              <RadioGroup
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleInputChange}
              >
                <FormControlLabel value="email" control={<Radio />} label="Email" />
                <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                <FormControlLabel value="both" control={<Radio />} label="Both" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
              helperText="Any other information you'd like to share"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            mb: 4
          }}
        >
          <Box component="img" src={logo} alt="reversale" sx={{ width: 40, height: 40, mr: 1 }} />
          Reversale
        </Typography>

        <Box width="100%" mb={4}>
          <Stepper activeStep={activeStep} sx={{
            '& .MuiStepIcon-root.Mui-active': { color: '#7442BF' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#7442BF' },
            '& .MuiStepConnector-line': { borderColor: '#7442BF' }
          }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box width="100%" bgcolor="#7442BF" p={3} borderRadius={2} mb={4}>
          <Typography variant="h5" color="white" gutterBottom>
            Welcome to Reversale
          </Typography>
          <Typography variant="body1" color="white">
            Let's get to know you better before we begin
          </Typography>
        </Box>

        {renderStepContent(activeStep)}

        <Box display="flex" justifyContent="space-between" width="100%" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ borderRadius: 50, px: 5, bgcolor: '#7442BF', borderColor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 