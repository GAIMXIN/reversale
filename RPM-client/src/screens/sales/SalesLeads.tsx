import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  IconButton,
  Link,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Avatar,
  Fab,
  Popover,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemText,
  Collapse,
  Paper,
  Grid,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  OpenInNew as OpenIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  Close as CloseIcon,
  LaunchOutlined as LaunchIcon,
  SmartToy as AIIcon,
  Check as CheckIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AutoAwesome as GenerateIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  linkedin?: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Negotiating' | 'Closed' | 'Lost';
  lastContacted: string;
  deals: number;
}

interface Deal {
  id: string;
  title: string;
  leadId: string;
}

interface MeetingNote {
  id: string;
  leadId: string;
  date: string;
  time: string;
  title: string;
  preview: string;
  fullContent: string;
}

interface DraftPosting {
  id: string;
  leadId: string;
  title: string;
  description: string;
  expectedOutcome: string;
  budget: number;
  status: 'draft' | 'sent' | 'submitted';
  createdAt: string;
  sentAt?: string;
  submittedAt?: string;
  publicLink?: string;
}

const SalesLeads: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock draft postings data
  const mockDraftPostings: DraftPosting[] = [
    {
      id: 'draft1',
      leadId: '2',
      title: 'Mobile App Development for DataVision Corp',
      description: 'We need a comprehensive mobile application that integrates with our existing data visualization platform. The app should provide real-time analytics and reporting capabilities for field teams.',
      expectedOutcome: 'A cross-platform mobile app with offline capabilities, real-time data sync, and intuitive dashboard interface',
      budget: 22000,
      status: 'sent',
      createdAt: '2024-01-12',
      sentAt: '2024-01-13',
      publicLink: 'https://app.reversale.com/owner/postings/drafts/draft1'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [recordingLead, setRecordingLead] = useState<Lead | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState<HTMLElement | null>(null);
  const [dealsAnchorEl, setDealsAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDealsLead, setSelectedDealsLead] = useState<string | null>(null);
  const [expandedDeals, setExpandedDeals] = useState<string | null>(null);
  const [showDraftSection, setShowDraftSection] = useState<string | null>(null);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [draftPostings, setDraftPostings] = useState<DraftPosting[]>(mockDraftPostings);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);

  // Mock data for leads
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechFlow Solutions',
      email: 'sarah.johnson@techflow.com',
      phone: '+1 (555) 123-4567',
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      status: 'Proposal Sent',
      lastContacted: '2024-01-15',
      deals: 2,
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'DataVision Corp',
      email: 'm.chen@datavision.com',
      phone: '+1 (555) 234-5678',
      linkedin: 'https://linkedin.com/in/michaelchen',
      status: 'Negotiating',
      lastContacted: '2024-01-14',
      deals: 1,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      company: 'CloudSync Inc',
      email: 'emily.r@cloudsync.com',
      phone: '+1 (555) 345-6789',
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      status: 'Contacted',
      lastContacted: '2024-01-13',
      deals: 0,
    },
    {
      id: '4',
      name: 'David Kim',
      company: 'NextGen Robotics',
      email: 'david.kim@nextgenrobot.com',
      phone: '+1 (555) 456-7890',
      status: 'New',
      lastContacted: '2024-01-12',
      deals: 3,
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      company: 'GreenTech Innovations',
      email: 'l.thompson@greentech.com',
      phone: '+1 (555) 567-8901',
      linkedin: 'https://linkedin.com/in/lisathompson',
      status: 'Closed',
      lastContacted: '2024-01-10',
      deals: 1,
    },
    {
      id: '6',
      name: 'James Wilson',
      company: 'FinanceFirst Ltd',
      email: 'james.wilson@financefirst.com',
      phone: '+1 (555) 678-9012',
      status: 'Lost',
      lastContacted: '2024-01-08',
      deals: 0,
    },
    {
      id: '7',
      name: 'Maria Garcia',
      company: 'HealthSync Systems',
      email: 'maria.garcia@healthsync.com',
      phone: '+1 (555) 789-0123',
      linkedin: 'https://linkedin.com/in/mariagarcia',
      status: 'Contacted',
      lastContacted: '2024-01-07',
      deals: 2,
    },
    {
      id: '8',
      name: 'Robert Brown',
      company: 'EduTech Solutions',
      email: 'robert.brown@edutech.com',
      phone: '+1 (555) 890-1234',
      status: 'New',
      lastContacted: '2024-01-05',
      deals: 0,
    },
    {
      id: '9',
      name: 'Anna Martinez',
      company: 'SmartLogistics Pro',
      email: 'anna.martinez@smartlogistics.com',
      phone: '+1 (555) 901-2345',
      linkedin: 'https://linkedin.com/in/annamartinez',
      status: 'Negotiating',
      lastContacted: '2024-01-04',
      deals: 1,
    },
    {
      id: '10',
      name: 'Thomas Lee',
      company: 'InnovateLab',
      email: 'thomas.lee@innovatelab.com',
      phone: '+1 (555) 012-3456',
      status: 'Proposal Sent',
      lastContacted: '2024-01-03',
      deals: 0,
    },
  ]);

  // Mock deal data
  const mockDeals: Deal[] = [
    { id: 'deal1', title: 'QR Ordering System', leadId: '1' },
    { id: 'deal2', title: 'CRM Revamp', leadId: '1' },
    { id: 'deal3', title: 'Mobile App Development', leadId: '2' },
    { id: 'deal4', title: 'Website Redesign', leadId: '3' },
    { id: 'deal5', title: 'POS Integration', leadId: '4' },
    { id: 'deal6', title: 'Analytics Dashboard', leadId: '4' },
    { id: 'deal7', title: 'E-commerce Platform', leadId: '4' },
    { id: 'deal8', title: 'Inventory Management', leadId: '5' },
    { id: 'deal9', title: 'Customer Portal', leadId: '7' },
    { id: 'deal10', title: 'API Integration', leadId: '7' },
    { id: 'deal11', title: 'Cloud Migration', leadId: '9' },
  ];

  // Mock meeting notes data
  const mockMeetingNotes: MeetingNote[] = [
    {
      id: 'note1',
      leadId: '1',
      date: '2024-01-15',
      time: '2:30 PM',
      title: 'Initial Discovery Call',
      preview: 'Discussed current QR ordering system challenges and integration requirements...',
      fullContent: 'Had a comprehensive discussion about their current QR ordering system challenges. They mentioned issues with slow response times and limited customization options. Interested in our solution for restaurant integration.'
    },
    {
      id: 'note2',
      leadId: '1',
      date: '2024-01-10',
      time: '10:15 AM',
      title: 'Follow-up Meeting',
      preview: 'Reviewed proposal details and discussed implementation timeline...',
      fullContent: 'Went through the proposal in detail. Sarah asked about implementation timeline and training requirements. She seems very interested and mentioned they have budget approved for Q1.'
    },
    {
      id: 'note3',
      leadId: '2',
      date: '2024-01-14',
      time: '3:45 PM',
      title: 'Technical Deep Dive',
      preview: 'Explored API integration capabilities and data migration process...',
      fullContent: 'Michael was interested in the technical aspects of our platform. We discussed API endpoints, data migration from their current system, and security protocols.'
    },
  ];

  const handleNameClick = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowDetailPanel(true);
    }
  };

  const handleOpenFullPage = () => {
    if (selectedLead) {
      navigate(`/sales/leads/${selectedLead.id}`);
    }
  };

  const handleAIClick = () => {
    if (selectedLead) {
      setRecordingLead(selectedLead);
      setShowRecordingModal(true);
      setRecordingTime(0);
    }
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    event.stopPropagation();
    setEditingStatus(leadId);
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    setEditingStatus(null);
    setStatusAnchorEl(null);
  };

  const handleDealsClick = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    event.stopPropagation();
    setSelectedDealsLead(leadId);
    setDealsAnchorEl(event.currentTarget);
  };

  const handleDealClick = (dealId: string) => {
    navigate(`/sales/deals?highlight=${dealId}`);
  };

  const getLeadDeals = (leadId: string) => {
    return mockDeals.filter(deal => deal.leadId === leadId);
  };

  const getLeadMeetingNotes = (leadId: string) => {
    return mockMeetingNotes.filter(note => note.leadId === leadId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleDetailStatusChange = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    // Update selected lead if it's the one being edited
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDealsToggle = (leadId: string) => {
    setExpandedDeals(expandedDeals === leadId ? null : leadId);
  };

  const handleMeetingNoteClick = (leadId: string, noteId: string) => {
    navigate(`/sales/leads/${leadId}/meeting/${noteId}`);
  };

  const getLeadDraftPosting = (leadId: string): DraftPosting | null => {
    return mockDraftPostings.find(draft => draft.leadId === leadId) || null;
  };

  const handleGenerateDraft = async (leadId: string) => {
    setGeneratingDraft(true);
    const leadNotes = getLeadMeetingNotes(leadId);
    const lead = leads.find(l => l.id === leadId);
    
    // Simulate GPT generation delay
    setTimeout(() => {
      if (lead && leadNotes.length > 0) {
        const newDraft: DraftPosting = {
          id: `draft_${Date.now()}`,
          leadId: leadId,
          title: `${leadNotes[0].title.replace('Meeting', 'Project')} for ${lead.company}`,
          description: `Based on our recent discussions, we understand that ${lead.company} is looking to ${leadNotes[0].preview.toLowerCase()} This project would involve comprehensive planning, development, and implementation to meet your specific business requirements.`,
          expectedOutcome: 'A fully functional solution that addresses the identified challenges and improves operational efficiency',
          budget: 15000,
          status: 'draft',
          createdAt: new Date().toISOString().split('T')[0],
        };
        
        setDraftPostings(prev => [...prev.filter(d => d.leadId !== leadId), newDraft]);
        setShowDraftSection(leadId);
        
        // Show success message (you could add a toast notification here)
        console.log(`Draft generated for ${lead.name}. Draft created and marked as active.`);
      }
      setGeneratingDraft(false);
    }, 2000);
  };

  const handleSaveDraft = (draft: DraftPosting) => {
    setDraftPostings(prev => 
      prev.map(d => d.id === draft.id ? draft : d)
    );
    setShowDraftSection(null);
  };

  const handleSendToLead = (draftId: string) => {
    const publicLink = `https://app.reversale.com/owner/postings/drafts/${draftId}`;
    setDraftPostings(prev =>
      prev.map(draft =>
        draft.id === draftId
          ? {
              ...draft,
              status: 'sent' as const,
              sentAt: new Date().toISOString().split('T')[0],
              publicLink
            }
          : draft
      )
    );
    // In real implementation, would send email to lead here
    console.log(`Draft sent to lead with public link: ${publicLink}`);
  };

  const handleToggleDraftSection = (leadId: string) => {
    setShowDraftSection(showDraftSection === leadId ? null : leadId);
  };

  const handleRecordClick = (lead: Lead, event: React.MouseEvent) => {
    event.stopPropagation();
    setRecordingLead(lead);
    setShowRecordingModal(true);
    setRecordingTime(0);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Auto-stop recording after 30 seconds (for demo)
    setTimeout(() => {
      clearInterval(timer);
      stopRecording();
    }, 30000);

    // Store timer ID for cleanup
    (window as any).recordingTimer = timer;
  };

  const stopRecording = () => {
    setIsRecording(false);
    if ((window as any).recordingTimer) {
      clearInterval((window as any).recordingTimer);
    }

    // Simulate processing and update last contacted date
    if (recordingLead) {
      const today = new Date().toISOString().split('T')[0];
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === recordingLead.id 
            ? { ...lead, lastContacted: today, status: 'Contacted' as const }
            : lead
        )
      );

      // Simulate transcription processing
      setTimeout(() => {
        setShowRecordingModal(false);
        setRecordingLead(null);
        setRecordingTime(0);
        
        // Show success message (you could add a toast notification here)
        console.log(`Recording completed for ${recordingLead.name}. Last contacted updated to ${today}.`);
      }, 2000);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return { bgcolor: '#f0f6fc', color: '#5a7ba7' };
      case 'Contacted':
        return { bgcolor: '#fdf6ed', color: '#b8956b' };
      case 'Proposal Sent':
        return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
      case 'Negotiating':
        return { bgcolor: '#f0f5f0', color: '#6b906b' };
      case 'Closed':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Lost':
        return { bgcolor: '#fdf2f2', color: '#b87070' };
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalLeads = leads.length;
  const closedDeals = leads.filter(lead => lead.status === 'Closed').length;
  const totalDeals = leads.reduce((sum, lead) => sum + lead.deals, 0);

  return (
    <Box>
      {/* Header with Title Only */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        flexWrap: 'wrap',
        gap: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Leads
        </Typography>
      </Box>

      {/* Toolbar Section with Summary Stats */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        mb: 3,
        p: 2,
        bgcolor: '#f8f9fa',
        borderRadius: 2,
        flexWrap: 'wrap'
      }}>
        {/* Left Side - Search, Filter, and Add Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: 200,
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {/* Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
              }}
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

          {/* Add New Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddModal(true)}
            sx={{
              bgcolor: '#7442BF',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#5e3399' }
            }}
          >
            New Lead
          </Button>
        </Box>

        {/* Right Side - Summary Stats */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${totalLeads} Total`}
            sx={{ 
              bgcolor: '#f8f9fa', 
              color: '#7442BF',
              fontWeight: 600,
              px: 1
            }} 
          />
          <Chip 
            label={`${totalDeals} Deals`}
            sx={{ 
              bgcolor: '#f8f9fa', 
              color: '#7442BF',
              fontWeight: 600,
              px: 1
            }} 
          />
          <Chip 
            label={`${closedDeals} Closed`}
            sx={{ 
              bgcolor: '#f0f5f0', 
              color: '#5d8160',
              fontWeight: 600,
              px: 1
            }} 
          />
        </Box>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>LinkedIn</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Last Contacted</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Deals</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2, textAlign: 'center' }}>Record</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id}
                    onMouseEnter={() => setHoveredRow(lead.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  >
                    <TableCell 
                      sx={{ py: 2, cursor: 'pointer' }}
                      onClick={() => handleNameClick(lead.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: '#7442BF',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {lead.name}
                        </Typography>
                        <OpenIcon 
                          sx={{ 
                            fontSize: 16, 
                            color: '#7442BF',
                            opacity: 0.7,
                            transition: 'opacity 0.2s ease',
                            '.MuiTableRow-root:hover &': {
                              opacity: 1
                            }
                          }} 
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2">
                        {lead.company}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {lead.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {lead.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {lead.linkedin ? (
                        <IconButton
                          component={Link}
                          href={lead.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            color: '#0077b5',
                            '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
                          }}
                        >
                          <LinkedInIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={lead.status}
                        size="small"
                        onClick={(e) => handleStatusClick(e, lead.id)}
                        sx={{
                          ...getStatusColor(lead.status),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(lead.lastContacted)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      {lead.deals > 0 ? (
                        <Box
                          onClick={(e) => handleDealsClick(e, lead.id)}
                          sx={{
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: '#7442BF',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {lead.deals} Deal{lead.deals !== 1 ? 's' : ''}
                          </Typography>
                          <ArrowDownIcon sx={{ fontSize: 16 }} />
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          0 Deals
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 2, textAlign: 'center' }}>
                      <Tooltip title="Record Meeting" arrow>
                        <IconButton
                          onClick={(e) => handleRecordClick(lead, e)}
                          size="small"
                          sx={{
                            color: '#7442BF',
                            '&:hover': { 
                              bgcolor: 'rgba(116, 66, 191, 0.1)',
                              transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <MicIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Results summary */}
      {searchTerm || statusFilter !== 'All' ? (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredLeads.length} of {totalLeads} leads
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== 'All' && ` with status "${statusFilter}"`}
          </Typography>
        </Box>
      ) : null}

      {/* Add New Lead Modal */}
      <Dialog 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Lead creation form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: '#7442BF' }}
            onClick={() => setShowAddModal(false)}
          >
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Recording Modal */}
      <Dialog 
        open={showRecordingModal} 
        onClose={() => {
          if (!isRecording) {
            setShowRecordingModal(false);
            setRecordingLead(null);
          }
        }}
        maxWidth="sm"
        fullWidth
        disableEscapeKeyDown={isRecording}
      >
        <DialogTitle>
          {isRecording ? `Recording with ${recordingLead?.name}` : `Start Recording with ${recordingLead?.name}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {!isRecording ? (
              <>
                <MicIcon sx={{ fontSize: 64, color: '#7442BF', mb: 2 }} />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Ready to start recording your meeting with {recordingLead?.name} from {recordingLead?.company}?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The recording will be automatically transcribed and the lead's "Last Contacted" date will be updated.
                </Typography>
              </>
            ) : (
              <>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={(recordingTime / 30) * 100}
                    size={80}
                    thickness={4}
                    sx={{ color: '#7442BF' }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StopIcon sx={{ fontSize: 32, color: '#7442BF' }} />
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ mb: 1, color: '#7442BF', fontWeight: 600 }}>
                  {formatRecordingTime(recordingTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recording in progress... Click "Stop Recording" when finished.
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {!isRecording ? (
            <>
              <Button onClick={() => setShowRecordingModal(false)}>Cancel</Button>
              <Button 
                variant="contained" 
                startIcon={<MicIcon />}
                sx={{ bgcolor: '#7442BF' }}
                onClick={startRecording}
              >
                Start Recording
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<StopIcon />}
              sx={{ bgcolor: '#d32f2f' }}
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Lead Detail Panel */}
      <Drawer
        anchor="right"
        open={showDetailPanel}
        onClose={() => setShowDetailPanel(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '66%',
            bgcolor: '#fafafa',
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            }
          }
        }}
      >
        {selectedLead && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  {selectedLead.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LaunchIcon />}
                    onClick={handleOpenFullPage}
                    sx={{ 
                      color: '#7442BF', 
                      borderColor: '#7442BF',
                      textTransform: 'none'
                    }}
                  >
                    Open in Full Page
                  </Button>
                  <IconButton onClick={() => setShowDetailPanel(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Content */}
            <Box sx={{ flex: 1, p: 3, overflow: 'auto', position: 'relative' }}>
              {/* Lead Information */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Lead Information
                  </Typography>
                  
                  {/* Company */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Company
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {selectedLead.company}
                    </Typography>
                  </Box>

                  {/* Email */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {selectedLead.email}
                    </Typography>
                  </Box>

                  {/* Phone */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
                      {selectedLead.phone}
                    </Typography>
                  </Box>

                  {/* LinkedIn */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      LinkedIn
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      {selectedLead.linkedin ? (
                        <Link
                          href={selectedLead.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            color: '#0077b5',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          <LinkedInIcon fontSize="small" />
                          View Profile
                        </Link>
                      ) : (
                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                          Not provided
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Status - Interactive */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Status
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                          value={selectedLead.status}
                          onChange={(e) => handleDetailStatusChange(selectedLead.id, e.target.value as Lead['status'])}
                          sx={{
                            height: 32,
                            '& .MuiSelect-select': {
                              py: 0.5,
                              display: 'flex',
                              alignItems: 'center',
                            }
                          }}
                        >
                          {(['New', 'Contacted', 'Proposal Sent', 'Negotiating', 'Closed', 'Lost'] as Lead['status'][]).map((status) => (
                            <MenuItem key={status} value={status}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: getStatusColor(status).bgcolor,
                                  }}
                                />
                                <Typography variant="body2">{status}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* Last Contacted */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Last Contacted
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {formatDate(selectedLead.lastContacted)}
                    </Typography>
                  </Box>

                  {/* Deals - Expandable */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                        Deals
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        {selectedLead.deals > 0 ? (
                          <Box
                            onClick={() => handleDealsToggle(selectedLead.id)}
                            sx={{
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              color: '#7442BF',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {selectedLead.deals} Deal{selectedLead.deals !== 1 ? 's' : ''}
                            </Typography>
                            <ArrowDownIcon 
                              sx={{ 
                                fontSize: 16, 
                                transform: expandedDeals === selectedLead.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease'
                              }} 
                            />
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            0 Deals
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Expanded Deals List */}
                    {expandedDeals === selectedLead.id && selectedLead.deals > 0 && (
                      <Box sx={{ ml: 15, mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {getLeadDeals(selectedLead.id).map((deal) => (
                          <Box
                            key={deal.id}
                            onClick={() => handleDealClick(deal.id)}
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              cursor: 'pointer',
                              bgcolor: '#f8f9fa',
                              border: '1px solid #e0e0e0',
                              '&:hover': {
                                bgcolor: 'rgba(116, 66, 191, 0.08)',
                                borderColor: '#7442BF',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 500,
                                color: '#7442BF',
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {deal.title}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Meeting Notes Timeline */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Meeting Notes
                  </Typography>
                  
                  {getLeadMeetingNotes(selectedLead.id).length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {getLeadMeetingNotes(selectedLead.id).map((note) => (
                        <Card
                          key={note.id}
                          onClick={() => handleMeetingNoteClick(selectedLead.id, note.id)}
                          sx={{
                            cursor: 'pointer',
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#7442BF',
                              boxShadow: '0 2px 8px rgba(116, 66, 191, 0.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                {note.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ml: 2 }}>
                                {formatDate(note.date)} – {note.time}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {note.preview}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 2,
                      border: '1px dashed #ddd',
                      textAlign: 'center'
                    }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                        No meeting notes yet. Use the AI assistant to record your first meeting.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Draft Posting Section */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    onClick={() => handleToggleDraftSection(selectedLead.id)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                      borderRadius: 1,
                      p: 1,
                      mx: -1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                      Draft Posting
                    </Typography>
                    <IconButton size="small">
                      {showDraftSection === selectedLead.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={showDraftSection === selectedLead.id}>
                    <Box sx={{ mt: 2 }}>
                      {(() => {
                        const existingDraft = getLeadDraftPosting(selectedLead.id) || 
                                            draftPostings.find(d => d.leadId === selectedLead.id);
                        
                        if (!existingDraft) {
                          return (
                            <Box sx={{ 
                              p: 3, 
                              bgcolor: '#f8f9fa', 
                              borderRadius: 2,
                              border: '1px dashed #ddd',
                              textAlign: 'center'
                            }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                                No draft created yet
                              </Typography>
                              <Button
                                variant="contained"
                                startIcon={generatingDraft ? <CircularProgress size={16} color="inherit" /> : <GenerateIcon />}
                                disabled={generatingDraft || getLeadMeetingNotes(selectedLead.id).length === 0}
                                onClick={() => handleGenerateDraft(selectedLead.id)}
                                sx={{
                                  bgcolor: '#7442BF',
                                  '&:hover': { bgcolor: '#5e3399' },
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                              >
                                {generatingDraft ? 'Generating...' : 'Generate from Meeting Notes'}
                              </Button>
                              {getLeadMeetingNotes(selectedLead.id).length === 0 && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.disabled' }}>
                                  Record a meeting first to generate a draft
                                </Typography>
                              )}
                            </Box>
                          );
                        }

                        return (
                          <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                                    {existingDraft.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip
                                      label={existingDraft.status.charAt(0).toUpperCase() + existingDraft.status.slice(1)}
                                      size="small"
                                      sx={{
                                        bgcolor: existingDraft.status === 'draft' ? '#f0f6fc' : 
                                                existingDraft.status === 'sent' ? '#fdf6ed' : '#f0f5f0',
                                        color: existingDraft.status === 'draft' ? '#5a7ba7' : 
                                               existingDraft.status === 'sent' ? '#b8956b' : '#5d8160',
                                        fontWeight: 500,
                                      }}
                                    />
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      Generated on {formatDate(existingDraft.createdAt)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {existingDraft.status === 'draft' && (
                                    <>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => {
                                          navigate(`/sales/leads/${selectedLead.id}/drafts/${existingDraft.id}`);
                                        }}
                                        sx={{ 
                                          color: '#7442BF', 
                                          borderColor: '#7442BF',
                                          textTransform: 'none'
                                        }}
                                      >
                                        Edit Posting
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="contained"
                                        startIcon={<SendIcon />}
                                        onClick={() => handleSendToLead(existingDraft.id)}
                                        sx={{
                                          bgcolor: '#7442BF',
                                          '&:hover': { bgcolor: '#5e3399' },
                                          textTransform: 'none'
                                        }}
                                      >
                                        Send to Lead
                                      </Button>
                                    </>
                                  )}
                                  {existingDraft.status === 'sent' && existingDraft.publicLink && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<LinkIcon />}
                                      onClick={() => window.open(existingDraft.publicLink, '_blank')}
                                      sx={{ 
                                        color: '#7442BF', 
                                        borderColor: '#7442BF',
                                        textTransform: 'none'
                                      }}
                                    >
                                      View Public Link
                                    </Button>
                                  )}
                                </Box>
                              </Box>

                              {/* Description - 2 lines max */}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary', 
                                  mb: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  lineHeight: 1.5,
                                }}
                              >
                                {existingDraft.description}
                              </Typography>

                              {/* Key Details Grid */}
                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                                <Box>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Budget
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#5d8160' }}>
                                    {formatCurrency(existingDraft.budget)}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                    Timeline
                                  </Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    6-8 weeks
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Expected Outcome */}
                              <Box>
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                  Expected Outcome
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 500,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {existingDraft.expectedOutcome}
                                </Typography>
                              </Box>

                              {/* Status-specific footer */}
                              {existingDraft.status === 'sent' && existingDraft.sentAt && (
                                <Box sx={{ 
                                  mt: 2, 
                                  pt: 2, 
                                  borderTop: '1px solid #e0e0e0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }}>
                                  <SendIcon sx={{ fontSize: 16, color: '#b8956b' }} />
                                  <Typography variant="caption" sx={{ color: '#b8956b', fontWeight: 500 }}>
                                    Sent to Lead on {formatDate(existingDraft.sentAt)}
                                  </Typography>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })()}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Floating AI Button */}
              <Fab
                color="primary"
                onClick={handleAIClick}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  bgcolor: '#7442BF',
                  '&:hover': { bgcolor: '#5e3399' },
                  zIndex: 1000,
                }}
              >
                <MicIcon />
              </Fab>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Status Editing Menu */}
      <Menu
        anchorEl={statusAnchorEl}
        open={Boolean(statusAnchorEl) && Boolean(editingStatus)}
        onClose={() => {
          setStatusAnchorEl(null);
          setEditingStatus(null);
        }}
        PaperProps={{
          sx: { 
            minWidth: 150,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        {(['New', 'Contacted', 'Proposal Sent', 'Negotiating', 'Closed', 'Lost'] as Lead['status'][]).map((status) => (
          <MuiMenuItem
            key={status}
            onClick={() => editingStatus && handleStatusChange(editingStatus, status)}
            sx={{
              py: 1,
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: 'rgba(116, 66, 191, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: getStatusColor(status).bgcolor,
                  border: `2px solid ${getStatusColor(status).color}`,
                }}
              />
              <Typography variant="body2">{status}</Typography>
            </Box>
          </MuiMenuItem>
        ))}
      </Menu>

      {/* Deals Popover */}
      <Popover
        open={Boolean(dealsAnchorEl) && Boolean(selectedDealsLead)}
        anchorEl={dealsAnchorEl}
        onClose={() => {
          setDealsAnchorEl(null);
          setSelectedDealsLead(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { 
            minWidth: 250,
            maxWidth: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#333' }}>
            Associated Deals
          </Typography>
          {selectedDealsLead && getLeadDeals(selectedDealsLead).length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {getLeadDeals(selectedDealsLead).map((deal) => (
                <Box
                  key={deal.id}
                  onClick={() => handleDealClick(deal.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: '#f8f9fa',
                    '&:hover': {
                      bgcolor: 'rgba(116, 66, 191, 0.08)',
                    },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 500,
                      color: '#7442BF',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {deal.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No deals associated with this lead yet.
            </Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default SalesLeads; 