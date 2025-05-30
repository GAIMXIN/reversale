import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Avatar,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Container,
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  
  // Form state
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving profile changes:', {
        displayName,
        emailNotifications,
      });
      setIsLoading(false);
      // TODO: Implement actual save functionality with backend
    }, 1000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: '#333'
        }}
      >
        Profile & Settings
      </Typography>

      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          bgcolor: 'white'
        }}
      >
        {/* User Info Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: '#444'
            }}
          >
            User Information
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            mb: 3
          }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#7442BF',
                fontSize: '2rem',
                fontWeight: 600,
              }}
            >
              {user?.name ? 
                user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                <Person />
              }
            </Avatar>
            
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  color: '#333'
                }}
              >
                {user?.name || 'User Name'}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666',
                  mt: 0.5
                }}
              >
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Account Settings Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              fontWeight: 600,
              color: '#444'
            }}
          >
            Account Settings
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3
          }}>
            {/* Display Name Input */}
            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#7442BF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7442BF',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7442BF',
                },
              }}
            />

            {/* Email Notifications Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#7442BF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#7442BF',
                    },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Receive email updates about your posts and responses
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start', ml: 0 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Save Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={isLoading}
            startIcon={<Save />}
            sx={{
              bgcolor: '#7442BF',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              '&:hover': {
                bgcolor: '#5a2d99',
              },
              '&:disabled': {
                bgcolor: '#ccc',
              },
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileSettings; 