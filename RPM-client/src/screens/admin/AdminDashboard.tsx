import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ContactMail as LeadsIcon,
  AttachMoney as RevenueIcon,
  AccountBalance as CommissionIcon,
  FiberNew as NewIcon,
  Visibility as ReviewIcon,
  Send as ProposalIcon,
  Handshake as NegotiationIcon,
  CheckCircle as WonIcon,
  Cancel as LostIcon,
  Assignment as AssignmentIcon,
  TrendingUp as ProgressIcon,
  NotificationImportant as AlertIcon,
  PersonAdd as JoinIcon,
  Description as DraftIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - would come from backend
  const topStats = {
    totalSalespeople: 6,
    totalLeads: 342,
    totalRevenue: 1847500, // Sum of closed won deals
    totalCommissionPaid: 284750, // Sum of commissions
  };

  const pipelineStats = [
    { label: 'New Deals', count: 12, color: '#5d8160', icon: <NewIcon />, filter: 'New' },
    { label: 'In Review', count: 8, color: '#5a7ba7', icon: <ReviewIcon />, filter: 'Reviewing' },
    { label: 'Proposal Sent', count: 5, color: '#b8956b', icon: <ProposalIcon />, filter: 'Proposal Sent' },
    { label: 'Negotiation', count: 3, color: '#b8956b', icon: <NegotiationIcon />, filter: 'Negotiation' },
    { label: 'Closed Won', count: 15, color: '#7442BF', icon: <WonIcon />, filter: 'Closed Won' },
    { label: 'Closed Lost', count: 7, color: '#b87070', icon: <LostIcon />, filter: 'Closed Lost' },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      icon: <AssignmentIcon sx={{ color: '#2196f3' }} />,
      title: 'New Deal: "QR Ordering System" assigned to Sarah Chen',
      time: '2 hours ago',
      details: 'TechFlow Solutions - $45,000 project value'
    },
    {
      id: 2,
      type: 'progress',
      icon: <ProgressIcon sx={{ color: '#4caf50' }} />,
      title: 'Deal moved to Negotiation phase',
      time: '4 hours ago',
      details: 'Data Analytics Platform - Michael Rodriguez'
    },
    {
      id: 3,
      type: 'alert',
      icon: <AlertIcon sx={{ color: '#ff9800' }} />,
      title: 'High commission alert: $18,750 earned',
      time: '6 hours ago',
      details: 'Sustainability Platform closed by Lisa Wang'
    },
    {
      id: 4,
      type: 'join',
      icon: <JoinIcon sx={{ color: '#9c27b0' }} />,
      title: 'New team member onboarded',
      time: 'Yesterday',
      details: 'James Miller joined Sales Team'
    },
    {
      id: 5,
      type: 'draft',
      icon: <DraftIcon sx={{ color: '#607d8b' }} />,
      title: 'Draft posting created: "CRM Integration"',
      time: 'Yesterday',
      details: 'CloudSync Inc - Emily Rodriguez'
    },
    {
      id: 6,
      type: 'progress',
      icon: <ProgressIcon sx={{ color: '#4caf50' }} />,
      title: 'Proposal sent to NextGen Robotics',
      time: '2 days ago',
      details: 'Robotics Dashboard Suite - David Park'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePipelineCardClick = (filter: string) => {
    navigate(`/admin/deals?filter=${encodeURIComponent(filter)}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Welcome back, {user?.name || 'Administrator'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here's what's happening with your sales team today
        </Typography>
      </Box>

      {/* 1. Top Stats Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 48, height: 48 }}>
                <PeopleIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
                  {topStats.totalSalespeople}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Salespeople
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2', width: 48, height: 48 }}>
                <LeadsIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 0.5 }}>
                  {topStats.totalLeads}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Leads
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#e8f5e8', color: '#388e3c', width: 48, height: 48 }}>
                <RevenueIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#5d8160', mb: 0.5 }}>
                  {formatCurrency(topStats.totalRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Revenue
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#fff3e0', color: '#f57c00', width: 48, height: 48 }}>
                <CommissionIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#b8956b', mb: 0.5 }}>
                  {formatCurrency(topStats.totalCommissionPaid)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Commission
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* 2. Pipeline Snapshot Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
          Sales Pipeline Overview
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, 
          gap: 2 
        }}>
          {pipelineStats.map((stat) => (
            <Card 
              key={stat.label}
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }
              }}
              onClick={() => handlePipelineCardClick(stat.filter)}
            >
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: `${stat.color}20`, 
                    color: stat.color, 
                    width: 40, 
                    height: 40, 
                    mx: 'auto', 
                    mb: 1 
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color, mb: 0.5 }}>
                  {stat.count}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* 3. Recent Activity Feed */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
        gap: 3 
      }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: 2 
            }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/admin/sales-team')}
                sx={{ py: 1.5, color: '#7442BF', borderColor: '#7442BF' }}
              >
                Manage Team
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/admin/leads')}
                sx={{ py: 1.5, color: '#7442BF', borderColor: '#7442BF' }}
              >
                View Leads
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/admin/deals')}
                sx={{ py: 1.5, color: '#7442BF', borderColor: '#7442BF' }}
              >
                View Deals
              </Button>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/admin/inbox')}
                sx={{ py: 1.5, color: '#7442BF', borderColor: '#7442BF' }}
              >
                Check Inbox
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Recent Activity
              </Typography>
              <Chip 
                icon={<TimeIcon />}
                label="Live" 
                size="small" 
                sx={{ bgcolor: '#e8f5e8', color: '#388e3c' }}
              />
            </Box>
            
            <List sx={{ py: 0 }}>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {activity.details}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7442BF', fontWeight: 500 }}>
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && (
                    <Box sx={{ borderBottom: '1px solid #f0f0f0', mx: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
            
            <Button 
              fullWidth 
              variant="text" 
              onClick={() => navigate('/admin/inbox')}
              sx={{ mt: 2, color: '#7442BF' }}
            >
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 