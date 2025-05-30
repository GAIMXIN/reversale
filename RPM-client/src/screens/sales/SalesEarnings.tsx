import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

const SalesEarnings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 4 }}>
        Earnings
      </Typography>
      
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
            💰
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            This is the Earnings page
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Commission tracking and earnings analytics will be implemented here
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesEarnings; 