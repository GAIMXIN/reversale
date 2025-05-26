import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Card,
  CardContent,
  useTheme,
  LinearProgress,
  Badge,
} from '@mui/material';
import {
  Person,
  Business,
  Phone,
  Email,
  Flag,
  Interests,
  TrendingUp,
  Groups,
  Analytics,
  Notifications,
  Settings,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { logout } = useAuth();

  // Mock user data
  const userData = {
    name: 'John Smith',
    email: 'test@example.com',
    phoneNumber: '+86 1234567890',
    hasCompany: 'yes',
    companyName: 'Tech Innovations Ltd',
    address: '123 Business District, Tech City',
    goals: ['Increase Sales', 'Improve Customer Service', 'Expand Market'],
    interests: ['E-commerce', 'Technology', 'AI Solutions'],
    profileCompletion: 85,
    connectionsCount: 12,
    activeProjects: 3,
  };

  // Mock stats data
  const statsData = [
    { label: 'Active Connections', value: '12', icon: Groups, color: '#7442BF' },
    { label: 'Projects Completed', value: '8', icon: Assignment, color: '#9C27B0' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: '#E91E63' },
    { label: 'Total Consultations', value: '24', icon: Analytics, color: '#FF6B6B' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8f9fa',
      pt: 2
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {userData.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 50%, #E91E63 100%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Welcome back, {userData.name.split(' ')[0]}!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {userData.companyName} • {userData.connectionsCount} active connections
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton sx={{ bgcolor: 'white', boxShadow: 1 }}>
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {statsData.map((stat, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
              border: `1px solid ${stat.color}20`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${stat.color}25`,
                border: `1px solid ${stat.color}40`,
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* User Profile Card */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          mb: 4
        }}>
          <Box sx={{ flex: 1 }}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              boxShadow: '0 8px 32px rgba(116, 66, 191, 0.1)',
              border: '1px solid rgba(116, 66, 191, 0.1)',
              borderRadius: 3
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#7442BF' }}>
                  Profile Overview
                </Typography>

                {/* Profile Completion */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Profile Completion
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                      {userData.profileCompletion}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={userData.profileCompletion} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #7442BF 0%, #9C27B0 100%)',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                {/* Contact Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Person sx={{ color: '#7442BF', fontSize: 20 }} />
                      <Typography variant="body2">{userData.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email sx={{ color: '#7442BF', fontSize: 20 }} />
                      <Typography variant="body2">{userData.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone sx={{ color: '#7442BF', fontSize: 20 }} />
                      <Typography variant="body2">{userData.phoneNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Business sx={{ color: '#7442BF', fontSize: 20 }} />
                      <Typography variant="body2">{userData.companyName}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Goals */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Goals
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userData.goals.map((goal, index) => (
                      <Chip
                        key={goal}
                        label={goal}
                        size="small"
                        sx={{ 
                          bgcolor: `hsl(${250 + index * 20}, 70%, 95%)`,
                          color: `hsl(${250 + index * 20}, 70%, 40%)`,
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Interests */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Interests
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userData.interests.map((interest, index) => (
                      <Chip
                        key={interest}
                        label={interest}
                        size="small"
                        sx={{ 
                          bgcolor: `hsl(${300 + index * 25}, 60%, 95%)`,
                          color: `hsl(${300 + index * 25}, 60%, 40%)`,
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 