import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TableSortLabel,
  Menu,
  ListItemIcon,
} from '@mui/material';
import {
  People as SalesTeamIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Block as SuspendIcon,
  CheckCircle as ActivateIcon,
  VpnKey as ResetPasswordIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon,
  PersonOff as TerminateIcon,
} from '@mui/icons-material';

interface SalesPerson {
  id: string;
  name: string;
  email: string;
  totalLeads: number;
  dealsClosedrn: number;
  commissionEarned: number;
  status: 'Active' | 'Paused' | 'Terminated';
  joinedDate: string;
  lastActivity: string;
  phone?: string;
  avatar?: string;
  conversionRate: number;
  avgDealTime: number;
}

type SortField = 'name' | 'totalLeads' | 'dealsClosedrn' | 'commissionEarned' | 'joinedDate' | 'lastActivity';
type SortOrder = 'asc' | 'desc';

const AdminSalesTeam: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPerson, setSelectedPerson] = useState<SalesPerson | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string; person: SalesPerson | null }>({
    open: false,
    type: '',
    person: null
  });
  const [sortField, setSortField] = useState<SortField>('commissionEarned');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPerson, setMenuPerson] = useState<SalesPerson | null>(null);

  // Mock data for sales team
  const salesTeam: SalesPerson[] = [
    {
      id: 'sp-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@reversale.com',
      totalLeads: 45,
      dealsClosedrn: 12,
      commissionEarned: 15420,
      status: 'Active',
      joinedDate: '2024-01-15',
      lastActivity: '2024-03-18 14:30',
      phone: '+1 (555) 123-4567',
      conversionRate: 26.7,
      avgDealTime: 18,
    },
    {
      id: 'sp-2',
      name: 'Michael Rodriguez',
      email: 'michael.r@reversale.com',
      totalLeads: 38,
      dealsClosedrn: 8,
      commissionEarned: 11850,
      status: 'Active',
      joinedDate: '2024-02-01',
      lastActivity: '2024-03-19 09:15',
      phone: '+1 (555) 234-5678',
      conversionRate: 21.1,
      avgDealTime: 22,
    },
    {
      id: 'sp-3',
      name: 'Emily Johnson',
      email: 'emily.johnson@reversale.com',
      totalLeads: 52,
      dealsClosedrn: 15,
      commissionEarned: 18750,
      status: 'Active',
      joinedDate: '2023-11-20',
      lastActivity: '2024-03-19 16:45',
      phone: '+1 (555) 345-6789',
      conversionRate: 28.8,
      avgDealTime: 16,
    },
    {
      id: 'sp-4',
      name: 'David Park',
      email: 'david.park@reversale.com',
      totalLeads: 23,
      dealsClosedrn: 4,
      commissionEarned: 6200,
      status: 'Paused',
      joinedDate: '2024-03-01',
      lastActivity: '2024-03-15 11:20',
      phone: '+1 (555) 456-7890',
      conversionRate: 17.4,
      avgDealTime: 28,
    },
    {
      id: 'sp-5',
      name: 'Lisa Wang',
      email: 'lisa.wang@reversale.com',
      totalLeads: 67,
      dealsClosedrn: 18,
      commissionEarned: 22950,
      status: 'Active',
      joinedDate: '2023-09-10',
      lastActivity: '2024-03-19 13:10',
      phone: '+1 (555) 567-8901',
      conversionRate: 26.9,
      avgDealTime: 19,
    },
    {
      id: 'sp-6',
      name: 'James Miller',
      email: 'james.miller@reversale.com',
      totalLeads: 15,
      dealsClosedrn: 1,
      commissionEarned: 1250,
      status: 'Terminated',
      joinedDate: '2024-01-05',
      lastActivity: '2024-02-28 10:00',
      phone: '+1 (555) 678-9012',
      conversionRate: 6.7,
      avgDealTime: 35,
    },
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: SalesPerson['status']) => {
    switch (status) {
      case 'Active':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Paused':
        return { bgcolor: '#fdf6ed', color: '#b8956b' };
      case 'Terminated':
        return { bgcolor: '#fdf2f2', color: '#b87070' };
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = salesTeam.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           person.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || person.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'joinedDate' || sortField === 'lastActivity') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [salesTeam, searchQuery, statusFilter, sortField, sortOrder]);

  // Handle actions
  const handleAction = (type: string, person: SalesPerson) => {
    if (type === 'view') {
      setSelectedPerson(person);
      setDrawerOpen(true);
    } else {
      setActionDialog({ open: true, type, person });
    }
  };

  const executeAction = () => {
    const { type, person } = actionDialog;
    console.log(`Executing ${type} action for ${person?.name}`);
    // TODO: Implement actual API calls here
    setActionDialog({ open: false, type: '', person: null });
  };

  const statusCounts = {
    All: salesTeam.length,
    Active: salesTeam.filter(p => p.status === 'Active').length,
    Paused: salesTeam.filter(p => p.status === 'Paused').length,
    Terminated: salesTeam.filter(p => p.status === 'Terminated').length,
  };

  // Handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, person: SalesPerson) => {
    setAnchorEl(event.currentTarget);
    setMenuPerson(person);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPerson(null);
  };

  // Handle actions from menu
  const handleMenuAction = (type: string) => {
    if (menuPerson) {
      handleAction(type, menuPerson);
    }
    handleMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SalesTeamIcon sx={{ fontSize: 32, color: '#7442BF' }} />
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Sales Team
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
                {count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters and Search */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
            gap: 2,
            alignItems: 'end'
          }}>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#7442BF' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Status Filter */}
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
                <MenuItem value="Terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Sales Team Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'name'}
                      direction={sortField === 'name' ? sortOrder : 'desc'}
                      onClick={() => handleSort('name')}
                      sx={{ fontWeight: 600 }}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'totalLeads'}
                      direction={sortField === 'totalLeads' ? sortOrder : 'desc'}
                      onClick={() => handleSort('totalLeads')}
                      sx={{ fontWeight: 600 }}
                    >
                      Total Leads
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'dealsClosedrn'}
                      direction={sortField === 'dealsClosedrn' ? sortOrder : 'desc'}
                      onClick={() => handleSort('dealsClosedrn')}
                      sx={{ fontWeight: 600 }}
                    >
                      Deals Closed
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'commissionEarned'}
                      direction={sortField === 'commissionEarned' ? sortOrder : 'desc'}
                      onClick={() => handleSort('commissionEarned')}
                      sx={{ fontWeight: 600 }}
                    >
                      Commission Earned
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'joinedDate'}
                      direction={sortField === 'joinedDate' ? sortOrder : 'desc'}
                      onClick={() => handleSort('joinedDate')}
                      sx={{ fontWeight: 600 }}
                    >
                      Joined Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'lastActivity'}
                      direction={sortField === 'lastActivity' ? sortOrder : 'desc'}
                      onClick={() => handleSort('lastActivity')}
                      sx={{ fontWeight: 600 }}
                    >
                      Last Activity
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((person) => (
                  <TableRow 
                    key={person.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#7442BF', width: 32, height: 32, fontSize: '0.9rem' }}>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Button
                          variant="text"
                          onClick={() => handleAction('view', person)}
                          sx={{ 
                            textTransform: 'none', 
                            fontWeight: 600, 
                            color: '#7442BF',
                            justifyContent: 'flex-start',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': { bgcolor: 'transparent' }
                          }}
                        >
                          {person.name}
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{person.email}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{person.totalLeads}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{person.dealsClosedrn}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#5d8160' }}>
                      {formatCurrency(person.commissionEarned)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={person.status}
                        size="small"
                        sx={{
                          ...getStatusColor(person.status),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary' }}>
                      {formatDate(person.joinedDate)}
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary' }}>
                      {formatDateTime(person.lastActivity)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, person)}
                        sx={{ color: '#7442BF' }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: 2,
            minWidth: 180,
          }
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: '#7442BF' }} />
          </ListItemIcon>
          <ListItemText primary="View Profile" />
        </MenuItem>
        
        {menuPerson?.status !== 'Terminated' && (
          <MenuItem onClick={() => handleMenuAction(menuPerson?.status === 'Active' ? 'suspend' : 'activate')}>
            <ListItemIcon>
              {menuPerson?.status === 'Active' ? (
                <SuspendIcon fontSize="small" sx={{ color: '#ff9800' }} />
              ) : (
                <ActivateIcon fontSize="small" sx={{ color: '#4caf50' }} />
              )}
            </ListItemIcon>
            <ListItemText primary={menuPerson?.status === 'Active' ? 'Suspend Account' : 'Activate Account'} />
          </MenuItem>
        )}

        {menuPerson?.status !== 'Terminated' && (
          <MenuItem onClick={() => handleMenuAction('terminate')}>
            <ListItemIcon>
              <TerminateIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText primary="Terminate Account" />
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={() => handleMenuAction('reset-password')}>
          <ListItemIcon>
            <ResetPasswordIcon fontSize="small" sx={{ color: '#666' }} />
          </ListItemIcon>
          <ListItemText primary="Reset Password" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('message')}>
          <ListItemIcon>
            <MessageIcon fontSize="small" sx={{ color: '#2196f3' }} />
          </ListItemIcon>
          <ListItemText primary="Send Message" />
        </MenuItem>
      </Menu>

      {/* Sales Profile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', md: 400 } }
        }}
      >
        {selectedPerson && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sales Profile
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Profile Info */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ 
                bgcolor: '#7442BF', 
                width: 80, 
                height: 80, 
                fontSize: '1.5rem',
                mx: 'auto',
                mb: 2 
              }}>
                {selectedPerson.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedPerson.name}
              </Typography>
              <Chip 
                label={selectedPerson.status}
                size="small"
                sx={{
                  ...getStatusColor(selectedPerson.status),
                  fontWeight: 500,
                }}
              />
            </Box>

            {/* Contact Details */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                Contact Information
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <EmailIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                  <ListItemText primary={selectedPerson.email} />
                </ListItem>
                {selectedPerson.phone && (
                  <ListItem sx={{ px: 0 }}>
                    <Typography sx={{ mr: 2, color: '#666', fontSize: 20 }}>📞</Typography>
                    <ListItemText primary={selectedPerson.phone} />
                  </ListItem>
                )}
                <ListItem sx={{ px: 0 }}>
                  <CalendarIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                  <ListItemText 
                    primary={`Joined ${formatDate(selectedPerson.joinedDate)}`}
                    secondary={`Last active: ${formatDateTime(selectedPerson.lastActivity)}`}
                  />
                </ListItem>
              </List>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Performance Metrics */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                Performance Overview
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2 
              }}>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
                    {selectedPerson.totalLeads}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Total Leads
                  </Typography>
                </Card>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#5d8160' }}>
                    {selectedPerson.dealsClosedrn}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Deals Closed
                  </Typography>
                </Card>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#b8956b' }}>
                    {selectedPerson.conversionRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Conversion Rate
                  </Typography>
                </Card>
                <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f8f9fa' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#666' }}>
                    {selectedPerson.avgDealTime}d
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Avg Deal Time
                  </Typography>
                </Card>
              </Box>
            </Box>

            {/* Commission Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                Commission Summary
              </Typography>
              <Card sx={{ p: 2, bgcolor: '#f0f5f0' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#5d8160', mb: 1 }}>
                  {formatCurrency(selectedPerson.commissionEarned)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total commissions earned
                </Typography>
              </Card>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ResetPasswordIcon />}
                onClick={() => handleAction('reset-password', selectedPerson)}
                sx={{ color: '#7442BF', borderColor: '#7442BF' }}
              >
                Reset Password
              </Button>
              <Button
                variant="outlined"
                startIcon={<MessageIcon />}
                onClick={() => handleAction('message', selectedPerson)}
                sx={{ color: '#2196f3', borderColor: '#2196f3' }}
              >
                Send Message
              </Button>
              {selectedPerson.status !== 'Terminated' && (
                <Button
                  variant="contained"
                  startIcon={selectedPerson.status === 'Active' ? <SuspendIcon /> : <ActivateIcon />}
                  onClick={() => handleAction(selectedPerson.status === 'Active' ? 'suspend' : 'activate', selectedPerson)}
                  sx={{ 
                    bgcolor: selectedPerson.status === 'Active' ? '#ff9800' : '#4caf50',
                    '&:hover': { bgcolor: selectedPerson.status === 'Active' ? '#f57c00' : '#388e3c' }
                  }}
                >
                  {selectedPerson.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '', person: null })}>
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to {actionDialog.type} {actionDialog.person?.name}?
          </Alert>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {actionDialog.type === 'suspend' && 'This will temporarily disable their account access.'}
            {actionDialog.type === 'activate' && 'This will restore their account access.'}
            {actionDialog.type === 'terminate' && 'This will permanently disable their account. This action cannot be undone.'}
            {actionDialog.type === 'reset-password' && 'A new password will be sent to their email.'}
            {actionDialog.type === 'message' && 'This will open the messaging interface.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, type: '', person: null })}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={executeAction}
            sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSalesTeam; 