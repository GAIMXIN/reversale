import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Tooltip,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Link,
  Avatar,
  Collapse,
  Paper,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  OpenInNew as OpenIcon,
  Close as CloseIcon,
  LaunchOutlined as LaunchIcon,
  LinkedIn as LinkedInIcon,
  KeyboardArrowDown as ArrowDownIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';

interface Deal {
  id: string;
  subject: string;
  leadName: string;
  leadId: string;
  company: string;
  email: string;
  phone: string;
  progress: 'New' | 'Reviewing' | 'Proposal Sent' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  quoteAmount: number;
  createdAt: string;
  lastUpdated: string;
  // Additional fields for the drawer
  desiredOutcome: string;
  expectedImpact: string;
  preferredTech: string;
  budgetRange: string;
  timelinePreference: string;
  timelineLogs: Array<{
    date: string;
    event: string;
    description: string;
  }>;
}

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

interface MeetingNote {
  id: string;
  leadId: string;
  date: string;
  time: string;
  title: string;
  preview: string;
  fullContent: string;
}

const SalesDeals: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [progressFilter, setProgressFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetailPanel, setShowLeadDetailPanel] = useState(false);
  const [highlightedDealId, setHighlightedDealId] = useState<string | null>(null);

  // Mock leads data
  const mockLeads: Lead[] = [
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
      deals: 1,
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

  // Mock deals data with enhanced fields
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal1',
      subject: 'QR Ordering System Implementation',
      leadName: 'Sarah Johnson',
      leadId: '1',
      company: 'TechFlow Solutions',
      email: 'sarah.johnson@techflow.com',
      phone: '+1 (555) 123-4567',
      progress: 'Negotiation',
      quoteAmount: 12500,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-15',
      desiredOutcome: 'Implement a seamless QR code ordering system that integrates with existing POS and inventory management',
      expectedImpact: 'Reduce order processing time by 40% and improve customer satisfaction scores',
      preferredTech: 'React Native, Node.js, MySQL',
      budgetRange: '$10,000 - $15,000',
      timelinePreference: '6-8 weeks',
      timelineLogs: [
        { date: '2024-01-10', event: 'Deal Created', description: 'Initial project proposal submitted' },
        { date: '2024-01-12', event: 'Quote Sent', description: 'Detailed quote sent to client' },
        { date: '2024-01-15', event: 'Negotiation Started', description: 'Client requested scope adjustments' },
      ],
    },
    {
      id: 'deal2',
      subject: 'CRM Integration & Customization',
      leadName: 'Sarah Johnson',
      leadId: '1',
      company: 'TechFlow Solutions',
      email: 'sarah.johnson@techflow.com',
      phone: '+1 (555) 123-4567',
      progress: 'Proposal Sent',
      quoteAmount: 8750,
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-14',
      desiredOutcome: 'Customize existing CRM to match company workflows and integrate with third-party tools',
      expectedImpact: 'Streamline sales processes and improve lead conversion rates by 25%',
      preferredTech: 'Salesforce, REST APIs, JavaScript',
      budgetRange: '$8,000 - $12,000',
      timelinePreference: '4-6 weeks',
      timelineLogs: [
        { date: '2024-01-08', event: 'Deal Created', description: 'CRM customization requirements gathered' },
        { date: '2024-01-14', event: 'Proposal Sent', description: 'Comprehensive proposal with timeline submitted' },
      ],
    },
    {
      id: 'deal3',
      subject: 'Mobile App Development',
      leadName: 'Michael Chen',
      leadId: '2',
      company: 'DataVision Corp',
      email: 'm.chen@datavision.com',
      phone: '+1 (555) 234-5678',
      progress: 'Closed Won',
      quoteAmount: 22000,
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-12',
      desiredOutcome: 'Cross-platform mobile app with real-time data visualization and offline capabilities',
      expectedImpact: 'Enable field teams to access critical data anywhere, improving productivity by 35%',
      preferredTech: 'React Native, Firebase, D3.js',
      budgetRange: '$20,000 - $25,000',
      timelinePreference: '8-10 weeks',
      timelineLogs: [
        { date: '2024-01-05', event: 'Deal Created', description: 'Mobile app requirements defined' },
        { date: '2024-01-07', event: 'Quote Sent', description: 'Detailed quote with feature breakdown' },
        { date: '2024-01-12', event: 'Closed Won', description: 'Contract signed, project kickoff scheduled' },
      ],
    },
    {
      id: 'deal4',
      subject: 'Website Redesign & SEO',
      leadName: 'Emily Rodriguez',
      leadId: '3',
      company: 'CloudSync Inc',
      email: 'emily.r@cloudsync.com',
      phone: '+1 (555) 345-6789',
      progress: 'Reviewing',
      quoteAmount: 6500,
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-13',
      desiredOutcome: 'Modern, responsive website with improved SEO and user experience',
      expectedImpact: 'Increase organic traffic by 50% and improve conversion rates',
      preferredTech: 'Next.js, Tailwind CSS, Google Analytics',
      budgetRange: '$5,000 - $8,000',
      timelinePreference: 'ASAP (3-4 weeks)',
      timelineLogs: [
        { date: '2024-01-12', event: 'Deal Created', description: 'Website redesign proposal submitted' },
        { date: '2024-01-13', event: 'Under Review', description: 'Client reviewing proposal and timeline' },
      ],
    },
    {
      id: 'deal5',
      subject: 'POS System Integration',
      leadName: 'David Kim',
      leadId: '4',
      company: 'NextGen Robotics',
      email: 'david.kim@nextgenrobot.com',
      phone: '+1 (555) 456-7890',
      progress: 'New',
      quoteAmount: 15000,
      createdAt: '2024-01-14',
      lastUpdated: '2024-01-14',
      desiredOutcome: 'Integrate new POS system with existing inventory and accounting software',
      expectedImpact: 'Automate inventory tracking and reduce manual data entry by 80%',
      preferredTech: 'REST APIs, SQL Server, .NET',
      budgetRange: '$12,000 - $18,000',
      timelinePreference: '6-8 weeks',
      timelineLogs: [
        { date: '2024-01-14', event: 'Deal Created', description: 'POS integration requirements documented' },
      ],
    },
    {
      id: 'deal6',
      subject: 'Analytics Dashboard Development',
      leadName: 'David Kim',
      leadId: '4',
      company: 'NextGen Robotics',
      email: 'david.kim@nextgenrobot.com',
      phone: '+1 (555) 456-7890',
      progress: 'Proposal Sent',
      quoteAmount: 9200,
      createdAt: '2024-01-11',
      lastUpdated: '2024-01-13',
      desiredOutcome: 'Business intelligence dashboard with real-time analytics and custom reporting',
      expectedImpact: 'Improve decision-making speed and accuracy through data visualization',
      preferredTech: 'Power BI, SQL Server, Python',
      budgetRange: '$8,000 - $12,000',
      timelinePreference: '4-6 weeks',
      timelineLogs: [
        { date: '2024-01-11', event: 'Deal Created', description: 'Analytics dashboard requirements gathered' },
        { date: '2024-01-13', event: 'Proposal Sent', description: 'Dashboard mockups and proposal delivered' },
      ],
    },
    {
      id: 'deal7',
      subject: 'E-commerce Platform Migration',
      leadName: 'David Kim',
      leadId: '4',
      company: 'NextGen Robotics',
      email: 'david.kim@nextgenrobot.com',
      phone: '+1 (555) 456-7890',
      progress: 'Negotiation',
      quoteAmount: 18500,
      createdAt: '2024-01-09',
      lastUpdated: '2024-01-15',
      desiredOutcome: 'Migrate from legacy e-commerce platform to modern solution with enhanced features',
      expectedImpact: 'Increase online sales by 30% and improve customer experience',
      preferredTech: 'Shopify Plus, React, GraphQL',
      budgetRange: '$15,000 - $20,000',
      timelinePreference: '8-10 weeks',
      timelineLogs: [
        { date: '2024-01-09', event: 'Deal Created', description: 'E-commerce migration scope defined' },
        { date: '2024-01-11', event: 'Quote Sent', description: 'Migration plan and quote submitted' },
        { date: '2024-01-15', event: 'Negotiation Started', description: 'Discussing timeline and feature priorities' },
      ],
    },
    {
      id: 'deal8',
      subject: 'Inventory Management System',
      leadName: 'Lisa Thompson',
      leadId: '5',
      company: 'GreenTech Innovations',
      email: 'l.thompson@greentech.com',
      phone: '+1 (555) 567-8901',
      progress: 'Closed Won',
      quoteAmount: 11750,
      createdAt: '2024-01-06',
      lastUpdated: '2024-01-10',
      desiredOutcome: 'Automated inventory tracking system with barcode scanning and alerts',
      expectedImpact: 'Reduce inventory errors by 90% and optimize stock levels',
      preferredTech: 'Node.js, MongoDB, React',
      budgetRange: '$10,000 - $15,000',
      timelinePreference: '6-8 weeks',
      timelineLogs: [
        { date: '2024-01-06', event: 'Deal Created', description: 'Inventory system requirements documented' },
        { date: '2024-01-08', event: 'Quote Sent', description: 'Detailed proposal with system architecture' },
        { date: '2024-01-10', event: 'Closed Won', description: 'Contract signed, development started' },
      ],
    },
    {
      id: 'deal9',
      subject: 'Customer Support Portal',
      leadName: 'Maria Garcia',
      leadId: '7',
      company: 'HealthSync Systems',
      email: 'maria.garcia@healthsync.com',
      phone: '+1 (555) 789-0123',
      progress: 'Reviewing',
      quoteAmount: 7800,
      createdAt: '2024-01-13',
      lastUpdated: '2024-01-14',
      desiredOutcome: 'Self-service customer portal with ticket tracking and knowledge base',
      expectedImpact: 'Reduce support workload by 40% and improve customer satisfaction',
      preferredTech: 'React, Node.js, PostgreSQL',
      budgetRange: '$7,000 - $10,000',
      timelinePreference: '5-7 weeks',
      timelineLogs: [
        { date: '2024-01-13', event: 'Deal Created', description: 'Customer portal requirements defined' },
        { date: '2024-01-14', event: 'Under Review', description: 'Client reviewing proposal and features' },
      ],
    },
    {
      id: 'deal10',
      subject: 'API Integration Suite',
      leadName: 'Maria Garcia',
      leadId: '7',
      company: 'HealthSync Systems',
      email: 'maria.garcia@healthsync.com',
      phone: '+1 (555) 789-0123',
      progress: 'Proposal Sent',
      quoteAmount: 5600,
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-13',
      desiredOutcome: 'Custom API integrations with healthcare providers and insurance systems',
      expectedImpact: 'Automate data exchange and reduce manual processing by 70%',
      preferredTech: 'REST APIs, Node.js, Docker',
      budgetRange: '$5,000 - $8,000',
      timelinePreference: '3-4 weeks',
      timelineLogs: [
        { date: '2024-01-12', event: 'Deal Created', description: 'API integration requirements gathered' },
        { date: '2024-01-13', event: 'Proposal Sent', description: 'Integration plan and timeline submitted' },
      ],
    },
    {
      id: 'deal11',
      subject: 'Cloud Migration Services',
      leadName: 'Anna Martinez',
      leadId: '9',
      company: 'SmartLogistics Pro',
      email: 'anna.martinez@smartlogistics.com',
      phone: '+1 (555) 901-2345',
      progress: 'Closed Lost',
      quoteAmount: 24000,
      createdAt: '2024-01-04',
      lastUpdated: '2024-01-11',
      desiredOutcome: 'Migrate legacy systems to cloud infrastructure with improved scalability',
      expectedImpact: 'Reduce infrastructure costs by 50% and improve system reliability',
      preferredTech: 'AWS, Docker, Kubernetes',
      budgetRange: '$20,000 - $30,000',
      timelinePreference: '10-12 weeks',
      timelineLogs: [
        { date: '2024-01-04', event: 'Deal Created', description: 'Cloud migration assessment completed' },
        { date: '2024-01-06', event: 'Quote Sent', description: 'Migration plan and cost estimate provided' },
        { date: '2024-01-11', event: 'Closed Lost', description: 'Client chose different vendor due to timeline' },
      ],
    },
  ]);

  const handleSubjectClick = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) {
      setSelectedDeal(deal);
      setShowDetailPanel(true);
    }
  };

  const handleOpenFullPage = () => {
    if (selectedDeal) {
      navigate(`/sales/deals/${selectedDeal.id}`);
    }
  };

  const handleLeadClick = (leadId: string) => {
    const lead = mockLeads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowLeadDetailPanel(true);
    }
  };

  const handleOpenLeadFullPage = () => {
    if (selectedLead) {
      navigate(`/sales/leads/${selectedLead.id}`);
    }
  };

  // Handle URL parameters for highlighting specific deals
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightDeal = params.get('highlight');
    if (highlightDeal) {
      setHighlightedDealId(highlightDeal);
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedDealId(null);
      }, 3000);
    }
  }, [location.search]);

  const getLeadMeetingNotes = (leadId: string) => {
    return mockMeetingNotes.filter(note => note.leadId === leadId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const calculateCommission = (quoteAmount: number): number => {
    return Math.round(quoteAmount * 0.2);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getProgressColor = (progress: Deal['progress']) => {
    switch (progress) {
      case 'New':
        return { bgcolor: '#f0f6fc', color: '#5a7ba7' };
      case 'Reviewing':
        return { bgcolor: '#fdf6ed', color: '#b8956b' };
      case 'Proposal Sent':
        return { bgcolor: '#f3e5f5', color: '#7b1fa2' };
      case 'Negotiation':
        return { bgcolor: '#f0f5f0', color: '#6b906b' };
      case 'Closed Won':
        return { bgcolor: '#f0f5f0', color: '#5d8160' };
      case 'Closed Lost':
        return { bgcolor: '#fdf2f2', color: '#b87070' };
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  // Filter deals based on search and progress
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgress = progressFilter === 'All' || deal.progress === progressFilter;
    return matchesSearch && matchesProgress;
  });

  // Calculate summary stats
  const totalDeals = deals.length;
  const closedWonDeals = deals.filter(deal => deal.progress === 'Closed Won').length;
  const totalCommissionEarned = deals
    .filter(deal => deal.progress === 'Closed Won')
    .reduce((sum, deal) => sum + calculateCommission(deal.quoteAmount), 0);
  const totalPotentialCommission = deals
    .filter(deal => deal.progress !== 'Closed Lost')
    .reduce((sum, deal) => sum + calculateCommission(deal.quoteAmount), 0);

  return (
    <Box>
      {/* Header with Title */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 4,
        flexWrap: 'wrap',
        gap: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Deals
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
            placeholder="Search deals..."
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
            <InputLabel>Progress</InputLabel>
            <Select
              value={progressFilter}
              label="Progress"
              onChange={(e) => setProgressFilter(e.target.value)}
              sx={{ 
                bgcolor: 'white',
                borderRadius: 2,
              }}
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
        </Box>

        {/* Right Side - Summary Stats */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${totalDeals} Total`}
            sx={{ 
              bgcolor: '#f8f9fa', 
              color: '#7442BF',
              fontWeight: 600,
              px: 1
            }} 
          />
          <Chip 
            label={`${closedWonDeals} Won`}
            sx={{ 
              bgcolor: '#f0f5f0', 
              color: '#5d8160',
              fontWeight: 600,
              px: 1
            }} 
          />
          <Chip 
            label={`${formatCurrency(totalCommissionEarned)} Earned`}
            sx={{ 
              bgcolor: '#f0f5f0', 
              color: '#5d8160',
              fontWeight: 600,
              px: 1
            }} 
          />
          <Chip 
            label={`${formatCurrency(totalPotentialCommission)} Potential`}
            sx={{ 
              bgcolor: '#fdf6ed', 
              color: '#b8956b',
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
            <Table sx={{ minWidth: 1100 }}>
              <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Lead Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Quote Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Commission Earned</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals.map((deal) => (
                  <TableRow 
                    key={deal.id}
                    onMouseEnter={() => setHoveredRow(deal.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    sx={{ 
                      '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                      borderBottom: '1px solid #e0e0e0',
                      bgcolor: highlightedDealId === deal.id ? 'rgba(116, 66, 191, 0.15)' : 'transparent',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell 
                      sx={{ py: 2, cursor: 'pointer' }}
                      onClick={() => handleSubjectClick(deal.id)}
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
                          {deal.subject}
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
                    <TableCell 
                      sx={{ py: 2, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeadClick(deal.leadId);
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            color: '#7442BF',
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {deal.leadName}
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
                        {deal.company}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={deal.progress}
                        size="small"
                        sx={{
                          ...getProgressColor(deal.progress),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(deal.quoteAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          flex: 1, 
                          fontWeight: 600,
                          color: deal.progress === 'Closed Won' ? '#5d8160' : '#b8956b'
                        }}
                      >
                        {formatCurrency(calculateCommission(deal.quoteAmount))}
                        {deal.progress !== 'Closed Won' && (
                          <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
                            (potential)
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(deal.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(deal.lastUpdated)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Results summary */}
      {searchTerm || progressFilter !== 'All' ? (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredDeals.length} of {totalDeals} deals
            {searchTerm && ` matching "${searchTerm}"`}
            {progressFilter !== 'All' && ` with progress "${progressFilter}"`}
          </Typography>
        </Box>
      ) : null}

      {/* Deal Detail Drawer */}
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
        {selectedDeal && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  {selectedDeal.subject}
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
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              {/* Project Summary */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Project Summary
                  </Typography>
                  
                  {/* Subject */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Subject
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
                      {selectedDeal.subject}
                    </Typography>
                  </Box>

                  {/* Company */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Company
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {selectedDeal.company}
                    </Typography>
                  </Box>

                  {/* Contact */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Contact
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {selectedDeal.leadName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        {selectedDeal.email} • {selectedDeal.phone}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Created At */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Created At
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {formatDate(selectedDeal.createdAt)}
                    </Typography>
                  </Box>

                  {/* Last Updated */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {formatDate(selectedDeal.lastUpdated)}
                    </Typography>
                  </Box>

                  {/* Quote Amount */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Quote Amount
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1, fontWeight: 600, color: '#7442BF' }}>
                      {formatCurrency(selectedDeal.quoteAmount)}
                    </Typography>
                  </Box>

                  {/* Commission Earned */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Commission
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        flex: 1, 
                        fontWeight: 600,
                        color: selectedDeal.progress === 'Closed Won' ? '#5d8160' : '#b8956b'
                      }}
                    >
                      {formatCurrency(calculateCommission(selectedDeal.quoteAmount))}
                      {selectedDeal.progress !== 'Closed Won' && (
                        <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
                          (potential)
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {/* Progress */}
                  <Box sx={{ display: 'flex', py: 1.5 }}>
                    <Typography variant="body2" sx={{ width: 140, fontWeight: 500, color: 'text.secondary' }}>
                      Progress
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={selectedDeal.progress}
                        size="small"
                        sx={{
                          ...getProgressColor(selectedDeal.progress),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Project Requirements */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Project Requirements
                  </Typography>
                  
                  {/* Desired Outcome */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                      Desired Outcome
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedDeal.desiredOutcome}
                    </Typography>
                  </Box>

                  {/* Expected Impact */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                      Expected Impact
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedDeal.expectedImpact}
                    </Typography>
                  </Box>

                  {/* Preferred Tech/Platform */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                      Preferred Tech / Platform
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedDeal.preferredTech}
                    </Typography>
                  </Box>

                  {/* Budget Range */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                      Budget Range
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 600, color: '#5d8160' }}>
                      {selectedDeal.budgetRange}
                    </Typography>
                  </Box>

                  {/* Timeline Preference */}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                      Timeline Preference
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 600, color: '#7442BF' }}>
                      {selectedDeal.timelinePreference}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Timeline Info */}
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Timeline & Activity
                  </Typography>
                  
                  {selectedDeal.timelineLogs.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {selectedDeal.timelineLogs.map((log, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 3 }}>
                          {/* Date */}
                          <Box sx={{ minWidth: 80 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              {formatDate(log.date)}
                            </Typography>
                          </Box>
                          
                          {/* Event and Description */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                              {log.event}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                              {log.description}
                            </Typography>
                          </Box>
                        </Box>
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
                        No timeline activity recorded yet.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* Lead Detail Drawer */}
      <Drawer
        anchor="right"
        open={showLeadDetailPanel}
        onClose={() => setShowLeadDetailPanel(false)}
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
                    onClick={handleOpenLeadFullPage}
                    sx={{ 
                      color: '#7442BF', 
                      borderColor: '#7442BF',
                      textTransform: 'none'
                    }}
                  >
                    Open in Full Page
                  </Button>
                  <IconButton onClick={() => setShowLeadDetailPanel(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Content */}
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
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

                  {/* Status */}
                  <Box sx={{ display: 'flex', py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Status
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Chip
                        label={selectedLead.status}
                        size="small"
                        sx={{
                          ...getStatusColor(selectedLead.status),
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Last Contacted */}
                  <Box sx={{ display: 'flex', py: 1.5 }}>
                    <Typography variant="body2" sx={{ width: 120, fontWeight: 500, color: 'text.secondary' }}>
                      Last Contacted
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {formatDate(selectedLead.lastContacted)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Meeting Notes */}
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    Meeting Notes
                  </Typography>
                  
                  {getLeadMeetingNotes(selectedLead.id).length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {getLeadMeetingNotes(selectedLead.id).map((note) => (
                        <Card
                          key={note.id}
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
                        No meeting notes yet.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default SalesDeals; 