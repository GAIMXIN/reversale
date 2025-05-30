import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Fab,
} from '@mui/material';
import {
  Person,
  Business,
  Phone,
  Email,
  Flag,
  Interests,
  Notifications,
  Settings,
  Assignment,
  AccountBalance,
  Payment,
  Receipt,
  Add as AddIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardData {
  activeRequests: number;
  fundsEscrow: number;
  totalPaid: number;
  pendingInvoices: number;
  recentRequests: Array<{
    id: string;
    date: string;
    name: string;
    status: 'FUNDS_HELD' | 'RELEASED' | 'COMPLETED' | 'PENDING';
  }>;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Mock dashboard data - similar to billing seed data
  const [dashboardData] = useState<DashboardData>({
    activeRequests: 2,
    fundsEscrow: 1250,
    totalPaid: 4250,
    pendingInvoices: 1,
    recentRequests: [
      {
        id: '1',
        date: '2024-06-01',
        name: 'Self-service Ordering System',
        status: 'FUNDS_HELD'
      },
      {
        id: '2',
        date: '2024-05-28',
        name: 'Therapist Notes Agent',
        status: 'RELEASED'
      },
      {
        id: '3',
        date: '2024-05-25',
        name: 'Customer Analytics Dashboard',
        status: 'COMPLETED'
      },
      {
        id: '4',
        date: '2024-05-20',
        name: 'Inventory Management System',
        status: 'RELEASED'
      },
      {
        id: '5',
        date: '2024-05-15',
        name: 'E-commerce Integration',
        status: 'PENDING'
      }
    ]
  });

  const statsCards = [
    {
      title: 'Active Requests',
      value: dashboardData.activeRequests,
      icon: Assignment,
      color: '#7442BF',
      format: 'number' as const
    },
    {
      title: 'Funds in Escrow',
      value: dashboardData.fundsEscrow,
      icon: AccountBalance,
      color: '#FF9800',
      format: 'currency' as const
    },
    {
      title: 'Total Paid',
      value: dashboardData.totalPaid,
      icon: Payment,
      color: '#4CAF50',
      format: 'currency' as const
    },
    {
      title: 'Pending Invoices',
      value: dashboardData.pendingInvoices,
      icon: Receipt,
      color: '#2196F3',
      format: 'number' as const
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatValue = (value: number, format: 'number' | 'currency') => {
    return format === 'currency' ? formatCurrency(value) : value.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FUNDS_HELD':
        return 'warning';
      case 'RELEASED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FUNDS_HELD':
        return 'Funds Held';
      case 'RELEASED':
        return 'Released';
      case 'COMPLETED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  const handleRequestClick = (requestId: string) => {
    // Navigate to request detail page (placeholder for now)
    console.log('Navigate to request:', requestId);
    // navigate(`/request/${requestId}`);
  };

  const handleNewRequest = () => {
    navigate('/');
  };

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <TrendingUp sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Overview of your business requests and financial status
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {statsCards.map((stat, index) => (
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
                  {formatValue(stat.value, stat.format)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Recent Activity Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Recent Activity
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your 5 most recent requests
          </Typography>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Request Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.recentRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  hover
                  onClick={() => handleRequestClick(request.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(116, 66, 191, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    {new Date(request.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {request.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(request.status)}
                      color={getStatusColor(request.status) as any}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Quick Action inside table container */}
        <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleNewRequest}
            sx={{ 
              background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
              boxShadow: '0 4px 15px rgba(116, 66, 191, 0.3)',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(135deg, #5e3399 0%, #7b1fa2 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(116, 66, 191, 0.4)',
              },
              transition: 'all 0.2s ease',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            New Request
          </Button>
        </Box>
      </Paper>

      {/* Floating Action Button (alternative quick action) */}
      <Fab
        color="primary"
        aria-label="new request"
        onClick={handleNewRequest}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
          boxShadow: '0 6px 20px rgba(116, 66, 191, 0.4)',
          '&:hover': { 
            background: 'linear-gradient(135deg, #5e3399 0%, #7b1fa2 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(116, 66, 191, 0.5)'
          },
          transition: 'all 0.2s ease',
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard; 