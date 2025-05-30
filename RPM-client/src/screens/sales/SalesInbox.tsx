import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Badge,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  SmartToy as AIIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  TrendingUp as LeadIcon,
  Close as CloseIcon,
  OpenInNew as OpenIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';

interface Message {
  id: string;
  sender: 'AI Agent' | 'System' | 'Admin' | 'Lead Update';
  senderAvatar?: string;
  subject: string;
  snippet: string;
  fullBody: string;
  timestamp: string;
  isRead: boolean;
  type: 'all' | 'ai' | 'lead' | 'admin';
  linkedLeadId?: string;
  linkedDealId?: string;
  linkedLeadName?: string;
  linkedDealName?: string;
}

const SalesInbox: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

  // Mock message data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg1',
      sender: 'AI Agent',
      subject: 'Weekly Lead Performance Summary',
      snippet: 'Your lead Sarah Johnson from TechFlow Solutions shows high engagement...',
      fullBody: 'Your lead Sarah Johnson from TechFlow Solutions shows high engagement based on recent meeting notes and deal progression. Recommended actions: 1) Schedule follow-up call within 2 days, 2) Send personalized proposal with QR ordering system focus, 3) Address timeline concerns raised in last meeting.',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      type: 'ai',
      linkedLeadId: '1',
      linkedLeadName: 'Sarah Johnson',
    },
    {
      id: 'msg2',
      sender: 'Lead Update',
      subject: 'New deal created for Michael Chen',
      snippet: 'Mobile App Development deal has been created and is pending review...',
      fullBody: 'A new deal "Mobile App Development" has been created for lead Michael Chen from DataVision Corp. The deal is currently in "Reviewing" status with a quote amount of $22,000. Your commission potential is $4,400.',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      type: 'lead',
      linkedLeadId: '2',
      linkedDealId: 'deal3',
      linkedLeadName: 'Michael Chen',
      linkedDealName: 'Mobile App Development',
    },
    {
      id: 'msg3',
      sender: 'Admin',
      subject: 'Q1 Sales Targets Updated',
      snippet: 'Your quarterly sales targets have been updated. New target: $125,000...',
      fullBody: 'Your quarterly sales targets have been updated based on market analysis and team performance. New target: $125,000 in closed deals. Current progress: $33,750 (27%). Focus areas: Enterprise clients, long-term contracts, and recurring revenue deals.',
      timestamp: '2024-01-14T16:45:00Z',
      isRead: true,
      type: 'admin',
    },
    {
      id: 'msg4',
      sender: 'AI Agent',
      subject: 'Lead Scoring Alert: High Priority',
      snippet: 'Emily Rodriguez lead score increased to 95/100. Immediate follow-up recommended...',
      fullBody: 'Emily Rodriguez from CloudSync Inc lead score has increased to 95/100 based on recent activity: opened proposal email 5 times, visited pricing page, and downloaded case study. Immediate follow-up recommended within 24 hours for maximum conversion probability.',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      type: 'ai',
      linkedLeadId: '3',
      linkedLeadName: 'Emily Rodriguez',
    },
    {
      id: 'msg5',
      sender: 'System',
      subject: 'Deal Status Changed: Negotiation',
      snippet: 'QR Ordering System Implementation moved to Negotiation phase...',
      fullBody: 'The deal "QR Ordering System Implementation" for Sarah Johnson has moved to Negotiation phase. Recent activities: Client requested scope adjustments, timeline discussion ongoing. Recommended: Prepare revised proposal with adjusted timeline and feature prioritization.',
      timestamp: '2024-01-14T11:30:00Z',
      isRead: true,
      type: 'lead',
      linkedLeadId: '1',
      linkedDealId: 'deal1',
      linkedLeadName: 'Sarah Johnson',
      linkedDealName: 'QR Ordering System Implementation',
    },
    {
      id: 'msg6',
      sender: 'AI Agent',
      subject: 'Weekly Commission Summary',
      snippet: 'This week you earned $2,350 in commissions from 2 closed deals...',
      fullBody: 'This week you earned $2,350 in commissions from 2 closed deals. Total commissions this month: $8,200. Top performing deal: Mobile App Development ($4,400). Pipeline analysis: 5 deals in negotiation worth potential $12,300 in commissions.',
      timestamp: '2024-01-13T18:00:00Z',
      isRead: true,
      type: 'ai',
    },
    {
      id: 'msg7',
      sender: 'Admin',
      subject: 'New Sales Training Available',
      snippet: 'Advanced Negotiation Techniques course is now available in the learning portal...',
      fullBody: 'Advanced Negotiation Techniques course is now available in the learning portal. Duration: 3 hours, includes practical exercises and role-playing scenarios. Completion by end of month required for all sales team members. Benefits: Improved closing rates, better deal terms, enhanced client relationships.',
      timestamp: '2024-01-13T10:15:00Z',
      isRead: true,
      type: 'admin',
    },
    {
      id: 'msg8',
      sender: 'Lead Update',
      subject: 'Lead Status Update: David Kim',
      snippet: 'David Kim from NextGen Robotics status changed to "Negotiating"...',
      fullBody: 'David Kim from NextGen Robotics status has been updated to "Negotiating" based on recent interactions. He has 3 active deals in various stages. Priority deal: E-commerce Platform Migration ($18,500). Recent activity: Requested technical specifications and implementation timeline.',
      timestamp: '2024-01-12T15:45:00Z',
      isRead: true,
      type: 'lead',
      linkedLeadId: '4',
      linkedLeadName: 'David Kim',
    },
  ]);

  const getTabData = () => {
    const tabCounts = {
      all: messages.length,
      ai: messages.filter(m => m.type === 'ai').length,
      lead: messages.filter(m => m.type === 'lead').length,
      admin: messages.filter(m => m.type === 'admin').length,
    };

    const unreadCounts = {
      all: messages.filter(m => !m.isRead).length,
      ai: messages.filter(m => m.type === 'ai' && !m.isRead).length,
      lead: messages.filter(m => m.type === 'lead' && !m.isRead).length,
      admin: messages.filter(m => m.type === 'admin' && !m.isRead).length,
    };

    return { tabCounts, unreadCounts };
  };

  const { tabCounts, unreadCounts } = getTabData();

  const getSenderIcon = (sender: Message['sender']) => {
    switch (sender) {
      case 'AI Agent':
        return <AIIcon sx={{ color: '#7442BF' }} />;
      case 'Admin':
        return <AdminIcon sx={{ color: '#f57c00' }} />;
      case 'Lead Update':
        return <LeadIcon sx={{ color: '#2e7d32' }} />;
      case 'System':
        return <PersonIcon sx={{ color: '#1976d2' }} />;
      default:
        return <PersonIcon />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || message.type === selectedTab;
    return matchesSearch && matchesTab;
  });

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setShowMessageDetail(true);
    
    // Mark as read
    if (!message.isRead) {
      setMessages(prev => 
        prev.map(m => m.id === message.id ? { ...m, isRead: true } : m)
      );
    }
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
    );
  };

  const handleGoToLead = () => {
    if (selectedMessage?.linkedLeadId) {
      navigate(`/sales/leads`);
      setShowMessageDetail(false);
    }
  };

  const handleGoToDeal = () => {
    if (selectedMessage?.linkedDealId) {
      navigate(`/sales/deals?highlight=${selectedMessage.linkedDealId}`);
      setShowMessageDetail(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
          Inbox
        </Typography>
        {unreadCounts.all > 0 && (
          <Chip 
            label={`${unreadCounts.all} unread`}
            size="small"
            sx={{ 
              bgcolor: '#7442BF', 
              color: 'white',
              fontWeight: 600
            }} 
          />
        )}
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 0 }}>
          {/* Search Bar */}
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search messages..."
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
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)}
              sx={{ px: 3 }}
            >
              <Tab 
                label={
                  <Badge badgeContent={unreadCounts.all || null} color="error">
                    All ({tabCounts.all})
                  </Badge>
                } 
                value="all" 
              />
              <Tab 
                label={
                  <Badge badgeContent={unreadCounts.ai || null} color="error">
                    AI Agent ({tabCounts.ai})
                  </Badge>
                } 
                value="ai" 
              />
              <Tab 
                label={
                  <Badge badgeContent={unreadCounts.lead || null} color="error">
                    Lead Updates ({tabCounts.lead})
                  </Badge>
                } 
                value="lead" 
              />
              <Tab 
                label={
                  <Badge badgeContent={unreadCounts.admin || null} color="error">
                    Admin Notes ({tabCounts.admin})
                  </Badge>
                } 
                value="admin" 
              />
            </Tabs>
          </Box>

          {/* Messages List */}
          <List sx={{ p: 0 }}>
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem
                    component="div"
                    onClick={() => handleMessageClick(message)}
                    sx={{
                      py: 2,
                      px: 3,
                      cursor: 'pointer',
                      bgcolor: message.isRead ? 'transparent' : 'rgba(116, 66, 191, 0.04)',
                      borderLeft: message.isRead ? 'none' : '4px solid #7442BF',
                      '&:hover': {
                        bgcolor: 'rgba(116, 66, 191, 0.08)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#f5f5f5' }}>
                        {getSenderIcon(message.sender)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: message.isRead ? 500 : 700,
                            color: '#333',
                            flex: 1,
                            mr: 2
                          }}>
                            {message.subject}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                              {formatTimestamp(message.timestamp)}
                            </Typography>
                            {!message.isRead && (
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: '#7442BF' 
                              }} />
                            )}
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
                            {message.sender}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                            {message.snippet}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredMessages.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                  No messages found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'All caught up!'}
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>

      {/* Message Detail Drawer */}
      <Drawer
        anchor="right"
        open={showMessageDetail}
        onClose={() => setShowMessageDetail(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '50%',
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
        {selectedMessage && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
                  Message Details
                </Typography>
                <IconButton onClick={() => setShowMessageDetail(false)}>
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Content */}
            <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
              {/* Message Header */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: '#f5f5f5' }}>
                      {getSenderIcon(selectedMessage.sender)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {selectedMessage.subject}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        From: {selectedMessage.sender}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    {!selectedMessage.isRead && (
                      <Button
                        size="small"
                        startIcon={<MarkReadIcon />}
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        sx={{ color: '#7442BF' }}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Message Body */}
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {selectedMessage.fullBody}
                  </Typography>
                </CardContent>
              </Card>

              {/* Linked Items */}
              {(selectedMessage.linkedLeadId || selectedMessage.linkedDealId) && (
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                      Related Items
                    </Typography>
                    
                    {selectedMessage.linkedLeadId && (
                      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Lead: {selectedMessage.linkedLeadName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              ID: {selectedMessage.linkedLeadId}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<OpenIcon />}
                            onClick={handleGoToLead}
                            sx={{ color: '#7442BF' }}
                          >
                            Go to Lead
                          </Button>
                        </Box>
                      </Paper>
                    )}

                    {selectedMessage.linkedDealId && (
                      <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Deal: {selectedMessage.linkedDealName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              ID: {selectedMessage.linkedDealId}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            startIcon={<OpenIcon />}
                            onClick={handleGoToDeal}
                            sx={{ color: '#7442BF' }}
                          >
                            Go to Deal
                          </Button>
                        </Box>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default SalesInbox; 