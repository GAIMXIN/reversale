import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  AccountBalance as CommissionsIcon,
} from '@mui/icons-material';

const AdminCommissions: React.FC = () => {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CommissionsIcon sx={{ fontSize: 32, color: '#7442BF' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Commission & Payments
        </Typography>
      </Box>

      {/* Placeholder Content */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <CommissionsIcon sx={{ fontSize: 64, color: '#7442BF', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Commission & Payments
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mx: 'auto' }}>
            Manage commission structures, payment processing, and earnings tracking 
            for all sales team members with detailed analytics and reporting.
          </Typography>
          <Typography variant="body2" sx={{ color: '#7442BF', mt: 2, fontWeight: 500 }}>
            Coming Soon
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminCommissions; 