import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import {
  NotificationsActive as ReminderIcon,
  Send as SendIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Chat as ChatIcon,
  Description as ProposalIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const SalesDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard modules
  const nextActions = [
    { id: 1, icon: <ReminderIcon />, text: 'Follow up with Gabriele W.', detail: '2 days idle' },
    { id: 2, icon: <SendIcon />, text: 'Send proposal to Milo L.', detail: 'Waiting for response' },
    { id: 3, icon: <CalendarIcon />, text: 'Meeting with Alice Chen', detail: 'Today at 3:00 PM' },
  ];

  const overdueFollowups = [
    { id: 1, client: 'Bluewater Café', lastActivity: '3 days ago', action: 'Send Follow-up' },
    { id: 2, client: 'Luna Bakery', lastActivity: '2 days ago', action: 'Submit Quote' },
  ];

  const weeklyStats = [
    { label: 'Closed Deals', value: '3' },
    { label: 'Revenue Earned', value: '$480' },
    { label: 'Closing Rate', value: '67%' },
    { label: 'Avg Response Time', value: '4.2 hrs' },
  ];

  const recentActivities = [
    { id: 1, icon: <CheckIcon />, text: 'Deal closed with Bluewater Café', detail: 'earned $160', time: '2 hours ago' },
    { id: 2, icon: <ChatIcon />, text: 'Client Joe replied: "Let\'s move forward."', detail: 'in deal pipeline', time: '4 hours ago' },
    { id: 3, icon: <ProposalIcon />, text: 'You submitted a proposal to Luna Bakery', detail: 'waiting for approval', time: '1 day ago' },
  ];

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Welcome, {user?.name || 'Sales Rep'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your leads, track deals, and maximize your earnings.
        </Typography>
      </Box>

      {/* Dashboard Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Total Leads
              </Typography>
              <Typography variant="h3" sx={{ color: '#7442BF', fontWeight: 700 }}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Active Deals
              </Typography>
              <Typography variant="h3" sx={{ color: '#7442BF', fontWeight: 700 }}>
                5
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 200 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                This Month Earnings
              </Typography>
              <Typography variant="h3" sx={{ color: '#7442BF', fontWeight: 700 }}>
                $1,840
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Key Information Modules */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Left Column */}
        <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
          {/* 1. Your Next Action */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Your Next Action
              </Typography>
              <List sx={{ p: 0 }}>
                {nextActions.map((action, index) => (
                  <ListItem key={action.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ color: '#7442BF', minWidth: 36 }}>
                      {action.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={action.text}
                      secondary={action.detail}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* 2. Overdue Follow-ups */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Overdue Follow-ups
                <Chip 
                  label={overdueFollowups.length} 
                  size="small" 
                  sx={{ ml: 2, bgcolor: '#ff6b6b', color: 'white' }}
                />
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Last Activity</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {overdueFollowups.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WarningIcon sx={{ color: '#ff6b6b', mr: 1, fontSize: 18 }} />
                            {item.client}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {item.lastActivity}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            sx={{ 
                              fontSize: '0.75rem',
                              px: 2,
                              borderColor: '#7442BF',
                              color: '#7442BF',
                              '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.1)' }
                            }}
                          >
                            {item.action}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: '1 1 400px', minWidth: 300 }}>
          {/* 3. This Week's Performance */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                This Week's Performance
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {weeklyStats.map((stat, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      flex: '1 1 120px', 
                      textAlign: 'center',
                      p: 2,
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#7442BF' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* 4. Recent Activity Feed */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
                Recent Activity
              </Typography>
              <List sx={{ p: 0 }}>
                {recentActivities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ color: '#28a745', minWidth: 36, mt: 0.5 }}>
                        {activity.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.detail}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {activity.time}
                            </Typography>
                          </Box>
                        }
                        primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider sx={{ ml: 4 }} />
                    )}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Note about mock data */}
      <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          💡 Note: All data shown above is mock data for demonstration purposes. 
          These modules will be connected to live data in future updates.
        </Typography>
      </Box>
    </Box>
  );
};

export default SalesDashboard; 