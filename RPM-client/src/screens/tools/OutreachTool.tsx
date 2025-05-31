import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const OutreachTool: React.FC = () => {
  const navigate = useNavigate();

  const outreachFeatures = [
    {
      id: 'mass-email',
      title: 'Mass Email Sending',
      description: 'Send personalized emails to multiple potential clients',
      icon: <EmailIcon sx={{ fontSize: 40, color: '#7442BF' }} />,
      path: '/sales/outreach/email-sender',
      isActive: true,
    },
    {
      id: 'email-sequences',
      title: 'Email Sequences',
      description: 'Set up automated email follow-up sequences',
      icon: <ScheduleIcon sx={{ fontSize: 40, color: '#7442BF' }} />,
      path: '/sales/tools/outreach/sequences',
      isActive: false,
    },
    {
      id: 'outreach-analytics',
      title: 'Outreach Analytics',
      description: 'Track email open rates, reply rates and conversion rates',
      icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#7442BF' }} />,
      path: '/sales/tools/outreach/analytics',
      isActive: false,
    },
    {
      id: 'template-manager',
      title: 'Template Manager',
      description: 'Create and manage email template library',
      icon: <SettingsIcon sx={{ fontSize: 40, color: '#7442BF' }} />,
      path: '/sales/tools/outreach/templates',
      isActive: false,
    },
  ];

  const quickStats = [
    { label: 'Emails Sent', value: '1,234', color: '#2196f3' },
    { label: 'Open Rate', value: '68%', color: '#4caf50' },
    { label: 'Reply Rate', value: '12%', color: '#ff9800' },
    { label: 'New Leads', value: '89', color: '#7442BF' },
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.isActive) {
      navigate(feature.path);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Outreach Tool
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Powerful email outreach tool suite to help you efficiently manage customer relationships and business development.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Outreach Statistics Overview
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3 
        }}>
          {quickStats.map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Feature Cards */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
        Feature Modules
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
        gap: 3 
      }}>
        {outreachFeatures.map((feature) => (
          <Card 
            key={feature.id}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: feature.isActive ? 'pointer' : 'default',
              opacity: feature.isActive ? 1 : 0.7,
              '&:hover': feature.isActive ? {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              } : {},
            }}
            onClick={() => handleFeatureClick(feature)}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box sx={{ flexShrink: 0 }}>
                  {feature.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  label={feature.isActive ? 'Available' : 'Coming Soon'}
                  size="small"
                  sx={{ 
                    bgcolor: feature.isActive ? '#e8f5e8' : '#f3e5f5',
                    color: feature.isActive ? '#2e7d32' : '#7442BF',
                    fontWeight: 500,
                  }}
                />
                {feature.isActive && (
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{ 
                      color: '#7442BF',
                      borderColor: '#7442BF',
                      '&:hover': {
                        backgroundColor: 'rgba(116, 66, 191, 0.04)',
                        borderColor: '#7442BF',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Recent Activity */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Recent Activity
        </Typography>
        
        <List sx={{ p: 0 }}>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <SendIcon sx={{ color: '#4caf50' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Mass Email Campaign Successful"
              secondary="Sent product introduction emails to 45 potential clients - 2 hours ago"
            />
          </ListItem>
          
          <Divider />
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <GroupIcon sx={{ color: '#2196f3' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Added 8 New Leads"
              secondary="Converted 8 new potential clients through email outreach - 4 hours ago"
            />
          </ListItem>
          
          <Divider />
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <TimelineIcon sx={{ color: '#ff9800' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Email Open Rate Improved"
              secondary="This week's email open rate increased by 15% compared to last week - 1 day ago"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default OutreachTool; 