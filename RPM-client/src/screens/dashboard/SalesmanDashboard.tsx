import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  ListItemButton,
  LinearProgress,
} from '@mui/material';
import {
  Restaurant,
  LocalHospital,
  Store,
  Business,
  Computer,
  Build,
  School,
  DirectionsCar,
  Home,
  Spa,
  Chat,
  Assignment,
  TrendingUp,
  Groups,
  Notifications,
  Message,
  Circle,
  Person,
  AttachMoney,
  Timeline,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Salesperson performance interface
interface SalespersonPerformance {
  name: string;
  role: string;
  currentRevenue: number;
  targetRevenue: number;
  leadsGenerated: number;
  conversionRate: number;
  strategies: string[];
  performance: 'excellent' | 'good' | 'needs_improvement';
  monthlyGrowth: number;
  clientSatisfaction: number;
  avgDealSize: number;
  closingRate: number;
}

const SalesmanDashboard: React.FC = () => {
  const theme = useTheme();
  const { user, updateSelectedField } = useAuth();
  const navigate = useNavigate();
  const [fieldSelectionOpen, setFieldSelectionOpen] = useState(!user?.selectedField);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  // Salesperson performance data
  const [salespersonData] = useState<SalespersonPerformance>({
    name: user?.name || "Alex Johnson",
    role: "Senior Sales Representative",
    currentRevenue: 285000,
    targetRevenue: 400000,
    leadsGenerated: 156,
    conversionRate: 24.5,
    strategies: ["Digital Marketing", "Extended Hours", "Loyalty Program", "Mobile App", "Client Referrals"],
    performance: "good",
    monthlyGrowth: 12.5,
    clientSatisfaction: 4.7,
    avgDealSize: 8500,
    closingRate: 68
  });

  // Available service fields
  const serviceFields = [
    { id: 'restaurant', name: 'Restaurant & Food Service', icon: Restaurant, color: '#FF6B6B' },
    { id: 'healthcare', name: 'Healthcare & Medical', icon: LocalHospital, color: '#4ECDC4' },
    { id: 'retail', name: 'Retail & E-commerce', icon: Store, color: '#45B7D1' },
    { id: 'business', name: 'Business Services', icon: Business, color: '#96CEB4' },
    { id: 'technology', name: 'Technology & Software', icon: Computer, color: '#FFEAA7' },
    { id: 'manufacturing', name: 'Manufacturing & Industrial', icon: Build, color: '#DDA0DD' },
    { id: 'education', name: 'Education & Training', icon: School, color: '#98D8C8' },
    { id: 'automotive', name: 'Automotive & Transportation', icon: DirectionsCar, color: '#F7DC6F' },
    { id: 'realestate', name: 'Real Estate & Property', icon: Home, color: '#BB8FCE' },
    { id: 'wellness', name: 'Wellness & Beauty', icon: Spa, color: '#85C1E9' },
  ];

  // Statistics data
  const statsData = [
    { label: 'Active Clients', value: '8', icon: Groups, color: '#7442BF' },
    { label: 'Consultations Today', value: '3', icon: Chat, color: '#9C27B0' },
    { label: 'Success Rate', value: '96%', icon: TrendingUp, color: '#E91E63' },
    { label: 'Completed Projects', value: '12', icon: Assignment, color: '#FF6B6B' },
  ];

  // Mock client message data
  const [clientMessages] = useState([
    {
      id: '1',
      clientName: 'John Smith',
      clientAvatar: 'JS',
      lastMessage: 'Hi, I need help with my restaurant operations...',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      unread: true,
      field: 'restaurant'
    },
    {
      id: '2',
      clientName: 'Sarah Chen',
      clientAvatar: 'SC',
      lastMessage: 'Can you help me with e-commerce strategy?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: true,
      field: 'retail'
    },
    {
      id: '3',
      clientName: 'Mike Johnson',
      clientAvatar: 'MJ',
      lastMessage: 'Thank you for the consultation yesterday!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: false,
      field: 'technology'
    }
  ]);

  // Calculate unread message count
  const unreadCount = clientMessages.filter(msg => msg.unread).length;

  const handleFieldSelect = (fieldId: string) => {
    updateSelectedField(fieldId);
    setFieldSelectionOpen(false);
  };

  const handleStartChat = () => {
    if (user?.selectedField) {
      navigate('/salesman-chat');
    } else {
      setFieldSelectionOpen(true);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleClientChatOpen = (clientId: string) => {
    // Navigate to specific client chat page
    navigate(`/salesman-client-chat/${clientId}`);
    handleNotificationClose();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedFieldInfo = serviceFields.find(field => field.id === user?.selectedField);

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
                {user?.name?.split(' ').map(n => n[0]).join('') || 'S'}
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
                  Welcome, {user?.name || 'Salesman'}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Sales Representative
                  </Typography>
                  <Chip 
                    label={salespersonData.performance === 'excellent' ? 'Excellent' : 
                           salespersonData.performance === 'good' ? 'Good Performance' : 'Needs Improvement'}
                    color={salespersonData.performance === 'excellent' ? 'success' : 
                           salespersonData.performance === 'good' ? 'primary' : 'warning'}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>

            {/* Notification Bell */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={handleNotificationClick}
                sx={{ 
                  bgcolor: 'white',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications color="primary" />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Performance Analysis Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Person color="primary" />
            Performance Analysis & Metrics
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
            {/* Revenue Progress */}
            <Box sx={{ flex: { xs: '1', lg: '0 0 50%' } }}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid #dee2e6'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney />
                    Revenue Performance
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Revenue
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {formatCurrency(salespersonData.currentRevenue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target: {formatCurrency(salespersonData.targetRevenue)}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(salespersonData.currentRevenue / salespersonData.targetRevenue) * 100}
                      sx={{ 
                        mt: 1,
                        height: 10,
                        borderRadius: 5,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #7442BF, #9C27B0)',
                          borderRadius: 5
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((salespersonData.currentRevenue / salespersonData.targetRevenue) * 100)}% of target achieved
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Monthly Growth</Typography>
                      <Typography variant="h6" color="success.main">+{salespersonData.monthlyGrowth}%</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Avg Deal Size</Typography>
                      <Typography variant="h6" color="info.main">{formatCurrency(salespersonData.avgDealSize)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Sales Metrics */}
            <Box sx={{ flex: { xs: '1', lg: '0 0 50%' } }}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid #dee2e6'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp />
                    Sales Metrics
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Leads Generated</Typography>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        {salespersonData.leadsGenerated}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion: {salespersonData.conversionRate}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={salespersonData.conversionRate}
                        sx={{ 
                          mt: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="body2" color="text.secondary">Closing Rate</Typography>
                      <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                        {salespersonData.closingRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Client Satisfaction: {salespersonData.clientSatisfaction}/5.0
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            sx={{ 
                              fontSize: 16,
                              color: star <= Math.floor(salespersonData.clientSatisfaction) ? '#ffc107' : '#e0e0e0'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Active Strategies */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timeline />
              Active Sales Strategies
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {salespersonData.strategies.map((strategy, idx) => (
                <Chip 
                  key={idx}
                  label={strategy}
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { bgcolor: 'primary.light', color: 'white' }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Performance Note */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, borderLeft: '4px solid #7442BF' }}>
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#495057' }}>
              <strong>Performance Note:</strong> Your current performance shows strong results with room for growth. 
              Focus on increasing conversion rates and expanding your client base in your selected service field to reach your revenue target.
            </Typography>
          </Box>
        </Paper>

        {/* Statistics Cards */}
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

        {/* Current Field Info */}
        {selectedFieldInfo && (
          <Card sx={{ 
            mb: 4,
            background: `linear-gradient(135deg, ${selectedFieldInfo.color}15 0%, ${selectedFieldInfo.color}05 100%)`,
            border: `1px solid ${selectedFieldInfo.color}20`,
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <selectedFieldInfo.icon sx={{ fontSize: 32, color: selectedFieldInfo.color }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: selectedFieldInfo.color }}>
                  Current Service Field: {selectedFieldInfo.name}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                You are currently configured to provide AI-powered consultation services for the {selectedFieldInfo.name.toLowerCase()} industry. 
                You can now start chatting with AI to help clients in this field with their business challenges and solutions.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Getting Started
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to your sales dashboard! Here's how to get started:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                {user?.selectedField ? 'You have already selected your service field' : 'Select your service field to specialize in'}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Use the AI chat to help clients with business consultation
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Monitor your performance metrics and client feedback
              </Typography>
              <Typography component="li" variant="body2">
                Track your progress towards revenue targets
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartChat}
            disabled={!user?.selectedField}
            sx={{
              background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a2d9f 0%, #7b1fa2 100%)',
              }
            }}
          >
            Start AI Chat
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => setFieldSelectionOpen(true)}
            sx={{
              borderColor: '#7442BF',
              color: '#7442BF',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#5a2d9f',
                bgcolor: '#7442BF10',
              }
            }}
          >
            {user?.selectedField ? 'Change Field' : 'Select Field'}
          </Button>
        </Box>

        {/* Field Selection Dialog */}
        <Dialog 
          open={fieldSelectionOpen} 
          onClose={() => setFieldSelectionOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            Select Your Service Field
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Choose the industry you want to specialize in for AI-powered client consultation:
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2
            }}>
              {serviceFields.map((field) => (
                <Card 
                  key={field.id}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: user?.selectedField === field.id ? `2px solid ${field.color}` : '1px solid #e0e0e0',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${field.color}40`,
                      border: `2px solid ${field.color}`,
                    }
                  }}
                  onClick={() => handleFieldSelect(field.id)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <field.icon sx={{ fontSize: 40, color: field.color, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: field.color }}>
                      {field.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button 
              onClick={() => setFieldSelectionOpen(false)}
              disabled={!user?.selectedField}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
                px: 4
              }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: { width: 350, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="primary">
              Client Messages ({unreadCount} unread)
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {clientMessages.map((message) => (
              <ListItemButton
                key={message.id}
                onClick={() => handleClientChatOpen(message.id)}
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  bgcolor: message.unread ? '#f8f9fa' : 'transparent'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#7442BF', fontSize: '0.9rem' }}>
                    {message.clientAvatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {message.clientName}
                      </Typography>
                      {message.unread && (
                        <Circle sx={{ fontSize: 8, color: '#7442BF' }} />
                      )}
                      <Chip 
                        label={message.field} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          height: 20,
                          bgcolor: '#7442BF20',
                          color: '#7442BF'
                        }} 
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200
                      }}>
                        {message.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
          </List>
        </Menu>
      </Container>
    </Box>
  );
};

export default SalesmanDashboard; 