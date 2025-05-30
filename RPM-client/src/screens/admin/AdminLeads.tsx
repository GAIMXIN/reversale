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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TableSortLabel,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fab,
  Collapse,
  List,
  ListItem,
} from '@mui/material';
import {
  Contacts as LeadsIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  SwapHoriz as ReassignIcon,
  Archive as ArchiveIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  FileUpload as UploadIcon,
  Add as AddIcon,
  Business as CompanyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  salesperson: string;
  salespersonId: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiating' | 'Closed' | 'Lost';
  lastContacted: string;
  createdAt: string;
  deals: number;
  notes?: string;
}

interface Deal {
  id: string;
  title: string;
  amount: number;
  status: string;
}

type SortField = 'name' | 'company' | 'salesperson' | 'status' | 'lastContacted' | 'createdAt' | 'deals';
type SortOrder = 'asc' | 'desc';

const AdminLeads: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string; lead: Lead | null }>({
    open: false,
    type: '',
    lead: null
  });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuLead, setMenuLead] = useState<Lead | null>(null);
  const [expandedDeals, setExpandedDeals] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Mock salespeople data
  const salespeople = [
    { id: 'sp-1', name: 'Sarah Chen' },
    { id: 'sp-2', name: 'Michael Rodriguez' },
    { id: 'sp-3', name: 'Emily Johnson' },
    { id: 'sp-4', name: 'David Park' },
    { id: 'sp-5', name: 'Lisa Wang' },
    { id: 'sp-6', name: 'James Miller' },
  ];

  // Mock leads data - expanded for admin view
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'lead-1',
      name: 'Sarah Johnson',
      company: 'TechFlow Solutions',
      email: 'sarah.johnson@techflow.com',
      phone: '+1 (555) 123-4567',
      salesperson: 'Sarah Chen',
      salespersonId: 'sp-1',
      status: 'Proposal Sent',
      lastContacted: '2024-03-15',
      createdAt: '2024-01-15',
      deals: 2,
      notes: 'High-value prospect, very interested in our QR ordering system.'
    },
    {
      id: 'lead-2',
      name: 'Michael Chen',
      company: 'DataVision Corp',
      email: 'm.chen@datavision.com',
      phone: '+1 (555) 234-5678',
      salesperson: 'Michael Rodriguez',
      salespersonId: 'sp-2',
      status: 'Negotiating',
      lastContacted: '2024-03-14',
      createdAt: '2024-01-20',
      deals: 1,
    },
    {
      id: 'lead-3',
      name: 'Emily Rodriguez',
      company: 'CloudSync Inc',
      email: 'emily.r@cloudsync.com',
      phone: '+1 (555) 345-6789',
      salesperson: 'Emily Johnson',
      salespersonId: 'sp-3',
      status: 'Contacted',
      lastContacted: '2024-03-13',
      createdAt: '2024-02-01',
      deals: 0,
    },
    {
      id: 'lead-4',
      name: 'David Kim',
      company: 'NextGen Robotics',
      email: 'david.kim@nextgenrobot.com',
      phone: '+1 (555) 456-7890',
      salesperson: 'David Park',
      salespersonId: 'sp-4',
      status: 'New',
      lastContacted: '2024-03-12',
      createdAt: '2024-02-15',
      deals: 3,
    },
    {
      id: 'lead-5',
      name: 'Lisa Thompson',
      company: 'GreenTech Innovations',
      email: 'l.thompson@greentech.com',
      phone: '+1 (555) 567-8901',
      salesperson: 'Lisa Wang',
      salespersonId: 'sp-5',
      status: 'Closed',
      lastContacted: '2024-03-10',
      createdAt: '2024-01-05',
      deals: 1,
    },
    {
      id: 'lead-6',
      name: 'James Wilson',
      company: 'FinanceFirst Ltd',
      email: 'james.wilson@financefirst.com',
      phone: '+1 (555) 678-9012',
      salesperson: 'James Miller',
      salespersonId: 'sp-6',
      status: 'Lost',
      lastContacted: '2024-03-08',
      createdAt: '2024-01-25',
      deals: 0,
    },
  ]);

  // Mock deals data
  const mockDeals: { [leadId: string]: Deal[] } = {
    'lead-1': [
      { id: 'deal-1', title: 'QR Ordering System', amount: 45000, status: 'Proposal Sent' },
      { id: 'deal-2', title: 'CRM Integration', amount: 25000, status: 'Negotiating' },
    ],
    'lead-2': [
      { id: 'deal-3', title: 'Data Analytics Platform', amount: 75000, status: 'Negotiating' },
    ],
    'lead-4': [
      { id: 'deal-4', title: 'Robotics Dashboard', amount: 120000, status: 'New' },
      { id: 'deal-5', title: 'IoT Integration', amount: 85000, status: 'New' },
      { id: 'deal-6', title: 'Maintenance Portal', amount: 35000, status: 'New' },
    ],
    'lead-5': [
      { id: 'deal-7', title: 'Sustainability Platform', amount: 95000, status: 'Closed' },
    ],
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Contacted':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Proposal Sent':
        return { bgcolor: '#eef4fd', color: '#5a7ba7' };
      case 'Negotiating':
        return { bgcolor: '#fdf6ed', color: '#b8956b' };
      case 'Closed':
        return { bgcolor: '#f8f3ff', color: '#7442BF' };
      case 'Lost':
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

  // Handle menu actions
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, lead: Lead) => {
    setAnchorEl(event.currentTarget);
    setMenuLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuLead(null);
  };

  const handleMenuAction = (type: string) => {
    if (menuLead) {
      if (type === 'view') {
        setSelectedLead(menuLead);
        setDrawerOpen(true);
      } else {
        setActionDialog({ open: true, type, lead: menuLead });
      }
    }
    handleMenuClose();
  };

  // Handle deals expansion
  const handleDealsClick = (leadId: string) => {
    setExpandedDeals(expandedDeals === leadId ? null : leadId);
  };

  // Handle field editing
  const handleFieldEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleFieldSave = () => {
    if (selectedLead && editingField) {
      const updatedLeads = leads.map(lead => {
        if (lead.id === selectedLead.id) {
          return { ...lead, [editingField]: editValue };
        }
        return lead;
      });
      setLeads(updatedLeads);
      setSelectedLead({ ...selectedLead, [editingField]: editValue } as Lead);
    }
    setEditingField(null);
    setEditValue('');
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSalesperson = salespersonFilter === 'All' || lead.salespersonId === salespersonFilter;
      return matchesSearch && matchesStatus && matchesSalesperson;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'lastContacted') {
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
  }, [leads, searchQuery, statusFilter, salespersonFilter, sortField, sortOrder]);

  // Execute actions
  const executeAction = () => {
    const { type, lead } = actionDialog;
    console.log(`Executing ${type} action for ${lead?.name}`);
    // TODO: Implement actual API calls here
    setActionDialog({ open: false, type: '', lead: null });
  };

  // Status counts
  const statusCounts = {
    All: leads.length,
    New: leads.filter(l => l.status === 'New').length,
    Contacted: leads.filter(l => l.status === 'Contacted').length,
    'Proposal Sent': leads.filter(l => l.status === 'Proposal Sent').length,
    Negotiating: leads.filter(l => l.status === 'Negotiating').length,
    Closed: leads.filter(l => l.status === 'Closed').length,
    Lost: leads.filter(l => l.status === 'Lost').length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LeadsIcon sx={{ fontSize: 32, color: '#7442BF' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
            Leads Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ color: '#7442BF', borderColor: '#7442BF' }}
          >
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
                {count}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, 
            gap: 2,
            alignItems: 'end'
          }}>
            {/* Search */}
            <TextField
              fullWidth
              placeholder="Search by name, company, or email..."
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
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Proposal Sent">Proposal Sent</MenuItem>
                <MenuItem value="Negotiating">Negotiating</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
              </Select>
            </FormControl>

            {/* Salesperson Filter */}
            <FormControl fullWidth>
              <InputLabel>Salesperson</InputLabel>
              <Select
                value={salespersonFilter}
                label="Salesperson"
                onChange={(e) => setSalespersonFilter(e.target.value)}
              >
                <MenuItem value="All">All Salespeople</MenuItem>
                {salespeople.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {person.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Leads Table */}
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
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'company'}
                      direction={sortField === 'company' ? sortOrder : 'desc'}
                      onClick={() => handleSort('company')}
                      sx={{ fontWeight: 600 }}
                    >
                      Company
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'salesperson'}
                      direction={sortField === 'salesperson' ? sortOrder : 'desc'}
                      onClick={() => handleSort('salesperson')}
                      sx={{ fontWeight: 600 }}
                    >
                      Salesperson
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'deals'}
                      direction={sortField === 'deals' ? sortOrder : 'desc'}
                      onClick={() => handleSort('deals')}
                      sx={{ fontWeight: 600 }}
                    >
                      Deals
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'lastContacted'}
                      direction={sortField === 'lastContacted' ? sortOrder : 'desc'}
                      onClick={() => handleSort('lastContacted')}
                      sx={{ fontWeight: 600 }}
                    >
                      Last Contacted
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'createdAt'}
                      direction={sortField === 'createdAt' ? sortOrder : 'desc'}
                      onClick={() => handleSort('createdAt')}
                      sx={{ fontWeight: 600 }}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((lead) => (
                  <React.Fragment key={lead.id}>
                    <TableRow 
                      sx={{ 
                        '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => {
                            setSelectedLead(lead);
                            setDrawerOpen(true);
                          }}
                          sx={{ 
                            textTransform: 'none', 
                            fontWeight: 600, 
                            color: '#7442BF',
                            justifyContent: 'flex-start',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                          }}
                        >
                          {lead.name}
                        </Button>
                      </TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{lead.email}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{lead.phone}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          sx={{ 
                            textTransform: 'none', 
                            color: '#7442BF',
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                          }}
                        >
                          {lead.salesperson}
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={lead.status}
                          size="small"
                          sx={{
                            ...getStatusColor(lead.status),
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {lead.deals > 0 ? (
                          <Button
                            variant="text"
                            onClick={() => handleDealsClick(lead.id)}
                            sx={{ 
                              textTransform: 'none', 
                              color: '#7442BF',
                              p: 0,
                              minWidth: 'auto',
                              '&:hover': { bgcolor: 'transparent' }
                            }}
                            endIcon={expandedDeals === lead.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          >
                            {lead.deals} Deal{lead.deals !== 1 ? 's' : ''}
                          </Button>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            0 Deals
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'text.secondary' }}>
                        {formatDate(lead.lastContacted)}
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'text.secondary' }}>
                        {formatDate(lead.createdAt)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuOpen(e, lead)}
                          sx={{ color: '#7442BF' }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Deals Row */}
                    {expandedDeals === lead.id && mockDeals[lead.id] && (
                      <TableRow>
                        <TableCell colSpan={10} sx={{ py: 0, bgcolor: '#f8f9fa' }}>
                          <Collapse in={expandedDeals === lead.id}>
                            <Box sx={{ p: 2 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#7442BF' }}>
                                Associated Deals
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {mockDeals[lead.id].map((deal) => (
                                  <Box key={deal.id} sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    p: 1,
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                    border: '1px solid #e0e0e0'
                                  }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {deal.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Typography variant="body2" sx={{ color: '#5d8160', fontWeight: 600 }}>
                                        {formatCurrency(deal.amount)}
                                      </Typography>
                                      <Chip 
                                        label={deal.status} 
                                        size="small" 
                                        sx={{ fontSize: '0.7rem' }}
                                      />
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
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
        
        <MenuItem onClick={() => handleMenuAction('reassign')}>
          <ListItemIcon>
            <ReassignIcon fontSize="small" sx={{ color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText primary="Reassign Salesperson" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('archive')}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" sx={{ color: '#666' }} />
          </ListItemIcon>
          <ListItemText primary="Archive Lead" />
        </MenuItem>
      </Menu>

      {/* Lead Profile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', md: 500 } }
        }}
      >
        {selectedLead && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Lead Profile
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
                {selectedLead.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {selectedLead.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {selectedLead.company}
              </Typography>
              <Chip 
                label={selectedLead.status}
                size="small"
                sx={{
                  ...getStatusColor(selectedLead.status),
                  fontWeight: 500,
                }}
              />
            </Box>

            {/* Contact Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Contact Information
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <EmailIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText primary={selectedLead.email} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <PhoneIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText primary={selectedLead.phone} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <PersonIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText primary={`Assigned to: ${selectedLead.salesperson}`} />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <CalendarIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText 
                      primary={`Created: ${formatDate(selectedLead.createdAt)}`}
                      secondary={`Last contacted: ${formatDate(selectedLead.lastContacted)}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Admin Edit Section */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Admin Controls
                </Typography>
                
                {/* Status Edit */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Status
                  </Typography>
                  {editingField === 'status' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        >
                          {['New', 'Contacted', 'Proposal Sent', 'Negotiating', 'Closed', 'Lost'].map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <IconButton size="small" onClick={handleFieldSave} sx={{ color: '#4caf50' }}>
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={handleFieldCancel} sx={{ color: '#f44336' }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip 
                        label={selectedLead.status}
                        size="small"
                        sx={{ ...getStatusColor(selectedLead.status), fontWeight: 500 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleFieldEdit('status', selectedLead.status)}
                        sx={{ color: '#7442BF' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Notes Section */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Admin Notes
                  </Typography>
                  {editingField === 'notes' ? (
                    <Box sx={{ mt: 0.5 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Add admin notes..."
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button size="small" onClick={handleFieldCancel}>Cancel</Button>
                        <Button size="small" variant="contained" onClick={handleFieldSave}>Save</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" sx={{ 
                        color: selectedLead.notes ? 'text.primary' : 'text.disabled',
                        fontStyle: selectedLead.notes ? 'normal' : 'italic'
                      }}>
                        {selectedLead.notes || 'No notes added'}
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleFieldEdit('notes', selectedLead.notes || '')}
                        sx={{ mt: 1, color: '#7442BF' }}
                      >
                        {selectedLead.notes ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Associated Deals */}
            {selectedLead.deals > 0 && mockDeals[selectedLead.id] && (
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                    Associated Deals ({selectedLead.deals})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {mockDeals[selectedLead.id].map((deal) => (
                      <Box key={deal.id} sx={{ 
                        p: 2,
                        bgcolor: '#f8f9fa',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          {deal.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: '#5d8160', fontWeight: 600 }}>
                            {formatCurrency(deal.amount)}
                          </Typography>
                          <Chip 
                            label={deal.status} 
                            size="small" 
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Drawer>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '', lead: null })}>
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to {actionDialog.type} {actionDialog.lead?.name}?
          </Alert>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {actionDialog.type === 'reassign' && 'This will transfer the lead to a different salesperson.'}
            {actionDialog.type === 'archive' && 'This will move the lead to the archived section.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, type: '', lead: null })}>
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

export default AdminLeads; 