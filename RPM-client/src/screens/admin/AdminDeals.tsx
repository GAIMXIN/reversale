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
  List,
  ListItem,
  Paper,
} from '@mui/material';
import {
  Assessment as DealsIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  SwapHoriz as AssignIcon,
  FileUpload as UploadIcon,
  Archive as ArchiveIcon,
  Timeline as TimelineIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Business as CompanyIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Description as ProposalIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as SentIcon,
  PendingActions as PendingIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';

interface Deal {
  id: string;
  subject: string;
  leadName: string;
  leadId: string;
  company: string;
  salesperson?: string;
  salespersonId?: string;
  progress: 'New' | 'Reviewing' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  quoteAmount: number;
  commissionRate: number;
  proposalSent: boolean;
  proposalDocument?: string;
  createdAt: string;
  lastUpdated: string;
  internalNotes?: string;
  timeline: TimelineEntry[];
}

interface TimelineEntry {
  id: string;
  date: string;
  action: string;
  details: string;
  user: string;
  type: 'status' | 'assignment' | 'proposal' | 'note';
}

type SortField = 'subject' | 'leadName' | 'company' | 'salesperson' | 'progress' | 'quoteAmount' | 'createdAt' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

const AdminDeals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState<string>('All');
  const [salespersonFilter, setSalespersonFilter] = useState<string>('All');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string; deal: Deal | null }>({
    open: false,
    type: '',
    deal: null
  });
  const [sortField, setSortField] = useState<SortField>('lastUpdated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuDeal, setMenuDeal] = useState<Deal | null>(null);
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

  // Mock deals data
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal-1',
      subject: 'QR Ordering System Implementation',
      leadName: 'Sarah Johnson',
      leadId: 'lead-1',
      company: 'TechFlow Solutions',
      salesperson: 'Sarah Chen',
      salespersonId: 'sp-1',
      progress: 'Proposal Sent',
      quoteAmount: 45000,
      commissionRate: 0.15,
      proposalSent: true,
      proposalDocument: 'qr-system-proposal.pdf',
      createdAt: '2024-01-15',
      lastUpdated: '2024-03-18',
      internalNotes: 'High-priority client, fast implementation timeline required.',
      timeline: [
        { id: 't1', date: '2024-01-15', action: 'Deal Created', details: 'Initial deal created from lead', user: 'System', type: 'status' },
        { id: 't2', date: '2024-02-01', action: 'Assigned Salesperson', details: 'Assigned to Sarah Chen', user: 'Admin', type: 'assignment' },
        { id: 't3', date: '2024-03-18', action: 'Proposal Sent', details: 'Comprehensive proposal document sent', user: 'Sarah Chen', type: 'proposal' },
      ]
    },
    {
      id: 'deal-2',
      subject: 'Data Analytics Platform',
      leadName: 'Michael Chen',
      leadId: 'lead-2',
      company: 'DataVision Corp',
      salesperson: 'Michael Rodriguez',
      salespersonId: 'sp-2',
      progress: 'Negotiation',
      quoteAmount: 75000,
      commissionRate: 0.12,
      proposalSent: true,
      createdAt: '2024-01-20',
      lastUpdated: '2024-03-19',
      timeline: [
        { id: 't4', date: '2024-01-20', action: 'Deal Created', details: 'Enterprise analytics solution', user: 'System', type: 'status' },
        { id: 't5', date: '2024-03-19', action: 'Status Updated', details: 'Moved to negotiation phase', user: 'Michael Rodriguez', type: 'status' },
      ]
    },
    {
      id: 'deal-3',
      subject: 'Robotics Dashboard Suite',
      leadName: 'David Kim',
      leadId: 'lead-4',
      company: 'NextGen Robotics',
      salesperson: 'David Park',
      salespersonId: 'sp-4',
      progress: 'Reviewing',
      quoteAmount: 120000,
      commissionRate: 0.10,
      proposalSent: false,
      createdAt: '2024-02-15',
      lastUpdated: '2024-03-17',
      internalNotes: 'Complex multi-phase project, requires technical review.',
      timeline: [
        { id: 't6', date: '2024-02-15', action: 'Deal Created', details: 'Large enterprise project', user: 'System', type: 'status' },
        { id: 't7', date: '2024-03-17', action: 'Internal Review', details: 'Technical feasibility assessment completed', user: 'Admin', type: 'note' },
      ]
    },
    {
      id: 'deal-4',
      subject: 'Sustainability Platform',
      leadName: 'Lisa Thompson',
      leadId: 'lead-5',
      company: 'GreenTech Innovations',
      salesperson: 'Lisa Wang',
      salespersonId: 'sp-5',
      progress: 'Closed Won',
      quoteAmount: 95000,
      commissionRate: 0.18,
      proposalSent: true,
      createdAt: '2024-01-05',
      lastUpdated: '2024-03-10',
      timeline: [
        { id: 't8', date: '2024-01-05', action: 'Deal Created', details: 'Green technology solution', user: 'System', type: 'status' },
        { id: 't9', date: '2024-03-10', action: 'Deal Closed', details: 'Successfully closed - project starting next month', user: 'Lisa Wang', type: 'status' },
      ]
    },
    {
      id: 'deal-5',
      subject: 'CRM Integration Project',
      leadName: 'Emily Rodriguez',
      leadId: 'lead-3',
      company: 'CloudSync Inc',
      progress: 'New',
      quoteAmount: 25000,
      commissionRate: 0.15,
      proposalSent: false,
      createdAt: '2024-03-01',
      lastUpdated: '2024-03-15',
      internalNotes: 'Unassigned - needs salesperson allocation.',
      timeline: [
        { id: 't10', date: '2024-03-01', action: 'Deal Created', details: 'CRM modernization project', user: 'System', type: 'status' },
      ]
    },
  ]);

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

  const calculateCommission = (amount: number, rate: number) => {
    return formatCurrency(amount * rate);
  };

  const getProgressColor = (progress: Deal['progress']) => {
    switch (progress) {
      case 'New':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Reviewing':
        return { bgcolor: '#eef4fd', color: '#5a7ba7' };
      case 'Proposal Sent':
        return { bgcolor: '#fdf6ed', color: '#b8956b' };
      case 'Negotiation':
        return { bgcolor: '#fef4e6', color: '#b8956b' };
      case 'Closed Won':
        return { bgcolor: '#f8f3ff', color: '#7442BF' };
      case 'Closed Lost':
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
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, deal: Deal) => {
    setAnchorEl(event.currentTarget);
    setMenuDeal(deal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuDeal(null);
  };

  const handleMenuAction = (type: string) => {
    if (menuDeal) {
      if (type === 'view') {
        setSelectedDeal(menuDeal);
        setDrawerOpen(true);
      } else {
        setActionDialog({ open: true, type, deal: menuDeal });
      }
    }
    handleMenuClose();
  };

  // Handle field editing
  const handleFieldEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleFieldSave = () => {
    if (selectedDeal && editingField) {
      const updatedDeals = deals.map(deal => {
        if (deal.id === selectedDeal.id) {
          const updatedDeal = { ...deal, [editingField]: editValue, lastUpdated: new Date().toISOString().split('T')[0] };
          
          // Add timeline entry for changes
          if (editingField === 'progress') {
            updatedDeal.timeline = [...deal.timeline, {
              id: `t${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              action: 'Status Updated',
              details: `Changed from ${deal.progress} to ${editValue}`,
              user: 'Admin',
              type: 'status'
            }];
          }
          
          return updatedDeal;
        }
        return deal;
      });
      setDeals(updatedDeals);
      setSelectedDeal({ ...selectedDeal, [editingField]: editValue } as Deal);
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
    let filtered = deals.filter(deal => {
      const matchesSearch = deal.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProgress = progressFilter === 'All' || deal.progress === progressFilter;
      const matchesSalesperson = salespersonFilter === 'All' || 
                                deal.salespersonId === salespersonFilter ||
                                (salespersonFilter === 'unassigned' && !deal.salespersonId);
      return matchesSearch && matchesProgress && matchesSalesperson;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'lastUpdated') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortField === 'quoteAmount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [deals, searchQuery, progressFilter, salespersonFilter, sortField, sortOrder]);

  // Execute actions
  const executeAction = () => {
    const { type, deal } = actionDialog;
    console.log(`Executing ${type} action for ${deal?.subject}`);
    // TODO: Implement actual API calls here
    setActionDialog({ open: false, type: '', deal: null });
  };

  // Progress counts
  const progressCounts = {
    All: deals.length,
    New: deals.filter(d => d.progress === 'New').length,
    Reviewing: deals.filter(d => d.progress === 'Reviewing').length,
    'Proposal Sent': deals.filter(d => d.progress === 'Proposal Sent').length,
    Negotiation: deals.filter(d => d.progress === 'Negotiation').length,
    'Closed Won': deals.filter(d => d.progress === 'Closed Won').length,
    'Closed Lost': deals.filter(d => d.progress === 'Closed Lost').length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DealsIcon sx={{ fontSize: 32, color: '#7442BF' }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
            Deals Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
        >
          Create Deal
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, 
        gap: 2, 
        mb: 3 
      }}>
        {Object.entries(progressCounts).map(([status, count]) => (
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
              placeholder="Search by deal, lead name, or company..."
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

            {/* Progress Filter */}
            <FormControl fullWidth>
              <InputLabel>Progress Filter</InputLabel>
              <Select
                value={progressFilter}
                label="Progress Filter"
                onChange={(e) => setProgressFilter(e.target.value)}
              >
                <MenuItem value="All">All Progress</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Reviewing">Reviewing</MenuItem>
                <MenuItem value="Proposal Sent">Proposal Sent</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Closed Won">Closed Won</MenuItem>
                <MenuItem value="Closed Lost">Closed Lost</MenuItem>
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
                <MenuItem value="unassigned">Unassigned</MenuItem>
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

      {/* Deals Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'subject'}
                      direction={sortField === 'subject' ? sortOrder : 'desc'}
                      onClick={() => handleSort('subject')}
                      sx={{ fontWeight: 600 }}
                    >
                      Subject
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'leadName'}
                      direction={sortField === 'leadName' ? sortOrder : 'desc'}
                      onClick={() => handleSort('leadName')}
                      sx={{ fontWeight: 600 }}
                    >
                      Lead Name
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
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Progress</TableCell>
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'quoteAmount'}
                      direction={sortField === 'quoteAmount' ? sortOrder : 'desc'}
                      onClick={() => handleSort('quoteAmount')}
                      sx={{ fontWeight: 600 }}
                    >
                      Quote Amount
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Commission Est.</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Proposal</TableCell>
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
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortField === 'lastUpdated'}
                      direction={sortField === 'lastUpdated' ? sortOrder : 'desc'}
                      onClick={() => handleSort('lastUpdated')}
                      sx={{ fontWeight: 600 }}
                    >
                      Last Updated
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((deal) => (
                  <TableRow 
                    key={deal.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="text"
                          onClick={() => {
                            setSelectedDeal(deal);
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
                          {deal.subject}
                        </Button>
                        <OpenIcon sx={{ fontSize: 16, color: '#7442BF', opacity: 0.7 }} />
                      </Box>
                    </TableCell>
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
                        {deal.leadName}
                      </Button>
                    </TableCell>
                    <TableCell>{deal.company}</TableCell>
                    <TableCell>
                      {deal.salesperson ? (
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
                          {deal.salesperson}
                        </Button>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                          Unassigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={deal.progress}
                        size="small"
                        sx={{
                          ...getProgressColor(deal.progress),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#5d8160' }}>
                      {formatCurrency(deal.quoteAmount)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#b8956b' }}>
                      {calculateCommission(deal.quoteAmount, deal.commissionRate)}
                    </TableCell>
                    <TableCell align="center">
                      {deal.proposalSent ? (
                        <Chip 
                          icon={<SentIcon />}
                          label="Sent" 
                          size="small" 
                          sx={{ bgcolor: '#f0f5f0', color: '#5d8160' }}
                        />
                      ) : (
                        <Chip 
                          icon={<PendingIcon />}
                          label="Pending" 
                          size="small" 
                          sx={{ bgcolor: '#fdf6ed', color: '#b8956b' }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary' }}>
                      {formatDate(deal.createdAt)}
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary' }}>
                      {formatDate(deal.lastUpdated)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleMenuOpen(e, deal)}
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
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => handleMenuAction('view')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" sx={{ color: '#7442BF' }} />
          </ListItemIcon>
          <ListItemText primary="View Deal Details" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('assign')}>
          <ListItemIcon>
            <AssignIcon fontSize="small" sx={{ color: '#ff9800' }} />
          </ListItemIcon>
          <ListItemText primary="Assign Salesperson" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('upload')}>
          <ListItemIcon>
            <UploadIcon fontSize="small" sx={{ color: '#2196f3' }} />
          </ListItemIcon>
          <ListItemText primary="Upload Proposal" />
        </MenuItem>

        <MenuItem onClick={() => handleMenuAction('timeline')}>
          <ListItemIcon>
            <TimelineIcon fontSize="small" sx={{ color: '#9c27b0' }} />
          </ListItemIcon>
          <ListItemText primary="View Timeline" />
        </MenuItem>
        
        <MenuItem onClick={() => handleMenuAction('archive')}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" sx={{ color: '#666' }} />
          </ListItemIcon>
          <ListItemText primary="Archive Deal" />
        </MenuItem>
      </Menu>

      {/* Deal Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', md: 600 } }
        }}
      >
        {selectedDeal && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Deal Details
              </Typography>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Deal Overview */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {selectedDeal.subject}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Quote Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#5d8160' }}>
                      {formatCurrency(selectedDeal.quoteAmount)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      Commission Est.
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#b8956b' }}>
                      {calculateCommission(selectedDeal.quoteAmount, selectedDeal.commissionRate)}
                    </Typography>
                  </Box>
                </Box>
                <Chip 
                  label={selectedDeal.progress}
                  sx={{ ...getProgressColor(selectedDeal.progress), fontWeight: 500 }}
                />
              </CardContent>
            </Card>

            {/* Lead & Assignment Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Lead & Assignment
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <PersonIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText 
                      primary={`${selectedDeal.leadName} (${selectedDeal.company})`}
                      secondary="Lead contact"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <AssignIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText 
                      primary={selectedDeal.salesperson || 'Unassigned'}
                      secondary="Assigned salesperson"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <CalendarIcon sx={{ mr: 2, color: '#666', fontSize: 20 }} />
                    <ListItemText 
                      primary={`Created: ${formatDate(selectedDeal.createdAt)}`}
                      secondary={`Last updated: ${formatDate(selectedDeal.lastUpdated)}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Admin Controls */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Admin Controls
                </Typography>
                
                {/* Progress Edit */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Progress Status
                  </Typography>
                  {editingField === 'progress' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <FormControl size="small" sx={{ minWidth: 180 }}>
                        <Select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        >
                          {['New', 'Reviewing', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'].map((status) => (
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
                        label={selectedDeal.progress}
                        size="small"
                        sx={{ ...getProgressColor(selectedDeal.progress), fontWeight: 500 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleFieldEdit('progress', selectedDeal.progress)}
                        sx={{ color: '#7442BF' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Proposal Status */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Proposal Document
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {selectedDeal.proposalSent ? (
                      <>
                        <Chip 
                          icon={<ProposalIcon />}
                          label={selectedDeal.proposalDocument || 'Document Sent'} 
                          size="small" 
                          sx={{ bgcolor: '#f0f5f0', color: '#5d8160' }}
                        />
                        <Button size="small" sx={{ color: '#7442BF' }}>
                          Replace
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<UploadIcon />}
                        sx={{ color: '#7442BF', borderColor: '#7442BF' }}
                      >
                        Upload Proposal
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Internal Notes */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Internal Notes
                  </Typography>
                  {editingField === 'internalNotes' ? (
                    <Box sx={{ mt: 0.5 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="Add internal notes..."
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button size="small" onClick={handleFieldCancel}>Cancel</Button>
                        <Button size="small" variant="contained" onClick={handleFieldSave}>Save</Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="body2" sx={{ 
                        color: selectedDeal.internalNotes ? 'text.primary' : 'text.disabled',
                        fontStyle: selectedDeal.internalNotes ? 'normal' : 'italic',
                        mb: 1
                      }}>
                        {selectedDeal.internalNotes || 'No internal notes added'}
                      </Typography>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleFieldEdit('internalNotes', selectedDeal.internalNotes || '')}
                        sx={{ color: '#7442BF' }}
                      >
                        {selectedDeal.internalNotes ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Deal Timeline
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedDeal.timeline.map((entry) => (
                    <Paper key={entry.id} sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {entry.action}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {entry.details}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        {formatDate(entry.date)} • {entry.user}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Drawer>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: '', deal: null })}>
        <DialogTitle>
          Confirm Action
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to {actionDialog.type} this deal?
          </Alert>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {actionDialog.type === 'assign' && 'This will assign or reassign the deal to a different salesperson.'}
            {actionDialog.type === 'upload' && 'This will open the proposal upload interface.'}
            {actionDialog.type === 'archive' && 'This will move the deal to the archived section.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, type: '', deal: null })}>
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

export default AdminDeals; 