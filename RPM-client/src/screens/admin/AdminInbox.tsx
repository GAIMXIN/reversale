import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Badge,
  IconButton,
  Button,
  Drawer,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Stack,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Search as SearchIcon,
  SmartToy as AIIcon,
  TrendingUp as SalesIcon,
  Warning as AlertIcon,
  StickyNote2 as NotesIcon,
  StarBorder as StarIcon,
  Star as StarFilledIcon,
  Archive as ArchiveIcon,
  Label as TagIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Circle as UnreadIcon,
  CheckCircle as ReadIcon,
  Reply as ReplyIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  PriorityHigh as PriorityIcon,
  Notifications as NotificationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  Business as CompanyIcon,
} from '@mui/icons-material';

interface InboxMessage {
  id: string;
  type: 'ai-agent' | 'sales-update' | 'system-alert' | 'internal-note';
  title: string;
  content: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  relatedLead?: string;
  relatedDeal?: string;
  actionRequired?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const AdminInbox: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [messageMenuAnchorEl, setMessageMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuMessage, setMenuMessage] = useState<InboxMessage | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Mock inbox messages
  const [messages, setMessages] = useState<InboxMessage[]>([
    {
      id: 'msg-1',
      type: 'ai-agent',
      title: 'High-Value Lead Opportunity Detected',
      content: 'Lead Sarah Johnson from TechFlow Solutions showed strong reply likelihood (87% confidence). Her recent engagement patterns suggest she\'s ready for a closer assignment. Recommended action: Assign to top performer Sarah Chen for immediate follow-up.',
      sender: 'AI Assistant',
      timestamp: '2024-03-19T14:30:00Z',
      isRead: false,
      isStarred: true,
      isArchived: false,
      tags: ['lead-opportunity', 'high-value'],
      priority: 'high',
      relatedLead: 'Sarah Johnson',
      actionRequired: true,
    },
    {
      id: 'msg-2',
      type: 'sales-update',
      title: 'New Deal Submission: Robotics Dashboard Suite',
      content: 'Michael Chen submitted 2 new draft postings from lead David Kim at NextGen Robotics. Total project value: $120,000. Deal requires technical review before proposal generation.',
      sender: 'Michael Rodriguez',
      timestamp: '2024-03-19T12:15:00Z',
      isRead: false,
      isStarred: false,
      isArchived: false,
      tags: ['new-deal', 'technical-review'],
      priority: 'medium',
      relatedLead: 'David Kim',
      relatedDeal: 'Robotics Dashboard Suite',
      actionRequired: true,
    },
    {
      id: 'msg-3',
      type: 'ai-agent',
      title: 'Weekly Performance Summary',
      content: '3 closed deals generated $4,850 in commission this week. Top performer: Lisa Wang with 2 successful closures. Conversion rate increased by 12% compared to last week.',
      sender: 'AI Assistant',
      timestamp: '2024-03-19T09:00:00Z',
      isRead: true,
      isStarred: false,
      isArchived: false,
      tags: ['performance', 'weekly-summary'],
      priority: 'low',
    },
    {
      id: 'msg-4',
      type: 'system-alert',
      title: 'Email Sync Service Disruption',
      content: 'Email sync failed for 5 messages due to API rate limits. Automatic retry scheduled in 30 minutes. Click to manually retry now or check service status.',
      sender: 'System',
      timestamp: '2024-03-19T08:45:00Z',
      isRead: false,
      isStarred: false,
      isArchived: false,
      tags: ['system-error', 'email-sync'],
      priority: 'high',
      actionRequired: true,
    },
    {
      id: 'msg-5',
      type: 'sales-update',
      title: 'High-Value Call Completed',
      content: 'Lisa Wang completed a strategic call with GreenTech Innovations. Client confirmed interest in sustainability platform upgrade. Meeting notes and next steps available in lead profile.',
      sender: 'Lisa Wang',
      timestamp: '2024-03-18T16:20:00Z',
      isRead: true,
      isStarred: false,
      isArchived: false,
      tags: ['call-completed', 'client-interest'],
      priority: 'medium',
      relatedLead: 'Lisa Thompson',
    },
    {
      id: 'msg-6',
      type: 'internal-note',
      title: 'Q2 Commission Policy Update Required',
      content: 'Reminder: Q2 commission policy needs update before May 15. Finance team requires approval on new tier structure. PM Jenny has reviewed API deal specifications.',
      sender: 'Admin Team',
      timestamp: '2024-03-18T14:00:00Z',
      isRead: false,
      isStarred: true,
      isArchived: false,
      tags: ['policy-update', 'finance', 'deadline'],
      priority: 'high',
      actionRequired: true,
    },
    {
      id: 'msg-7',
      type: 'system-alert',
      title: 'Sales Dashboard Update Deployed',
      content: 'New version of Sales Dashboard successfully deployed with enhanced reporting features. All active sessions will auto-refresh within 5 minutes.',
      sender: 'System',
      timestamp: '2024-03-18T11:30:00Z',
      isRead: true,
      isStarred: false,
      isArchived: false,
      tags: ['deployment', 'dashboard-update'],
      priority: 'low',
    },
    {
      id: 'msg-8',
      type: 'ai-agent',
      title: 'Risk Alert: Deal Stagnation Detected',
      content: 'Deal "Data Analytics Platform" has been in negotiation phase for 14 days without progress. Recommended intervention: Schedule client check-in call within 48 hours.',
      sender: 'AI Assistant',
      timestamp: '2024-03-18T10:15:00Z',
      isRead: false,
      isStarred: false,
      isArchived: false,
      tags: ['risk-alert', 'deal-stagnation'],
      priority: 'medium',
      relatedDeal: 'Data Analytics Platform',
      actionRequired: true,
    },
  ]);

  const tabs = [
    { label: 'All', value: 'all', icon: InboxIcon },
    { label: 'AI Agent', value: 'ai-agent', icon: AIIcon },
    { label: 'Sales Updates', value: 'sales-update', icon: SalesIcon },
    { label: 'System Alerts', value: 'system-alert', icon: AlertIcon },
    { label: 'Internal Notes', value: 'internal-note', icon: NotesIcon },
  ];

  // Utility functions
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMessageIcon = (type: InboxMessage['type']) => {
    switch (type) {
      case 'ai-agent': return <AIIcon sx={{ color: '#7442BF' }} />;
      case 'sales-update': return <SalesIcon sx={{ color: '#2196f3' }} />;
      case 'system-alert': return <AlertIcon sx={{ color: '#ff9800' }} />;
      case 'internal-note': return <NotesIcon sx={{ color: '#4caf50' }} />;
      default: return <InboxIcon sx={{ color: '#666' }} />;
    }
  };

  const getPriorityColor = (priority: InboxMessage['priority']) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  // Filter messages
  const filteredMessages = useMemo(() => {
    let filtered = messages.filter(message => {
      // Tab filter
      const tabValue = tabs[currentTab]?.value;
      if (tabValue !== 'all' && message.type !== tabValue) return false;
      
      // Search filter
      if (searchQuery && !message.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !message.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !message.sender.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter !== 'all' && message.priority !== priorityFilter) return false;
      
      // Date filter
      if (dateFilter !== 'all') {
        const messageDate = new Date(message.timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dateFilter === 'today' && diffDays > 0) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
      }
      
      return !message.isArchived;
    });

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [messages, currentTab, searchQuery, priorityFilter, dateFilter]);

  // Count unread messages
  const unreadCount = messages.filter(m => !m.isRead && !m.isArchived).length;
  const unreadCountByTab = tabs.map(tab => {
    if (tab.value === 'all') return unreadCount;
    return messages.filter(m => m.type === tab.value && !m.isRead && !m.isArchived).length;
  });

  // Handle message actions
  const toggleMessageRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: !msg.isRead } : msg
    ));
  };

  const toggleMessageStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const archiveMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
  };

  const handleMessageClick = (message: InboxMessage) => {
    setSelectedMessage(message);
    setDrawerOpen(true);
    if (!message.isRead) {
      toggleMessageRead(message.id);
    }
  };

  const handleMessageMenu = (event: React.MouseEvent<HTMLElement>, message: InboxMessage) => {
    event.stopPropagation();
    setMessageMenuAnchorEl(event.currentTarget);
    setMenuMessage(message);
  };

  const closeMessageMenu = () => {
    setMessageMenuAnchorEl(null);
    setMenuMessage(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <InboxIcon sx={{ fontSize: 32, color: '#7442BF' }} />
          </Badge>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
            Admin Inbox
          </Typography>
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} unread`} 
              size="small" 
              sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 500 }}
            />
          )}
        </Box>
        
        {/* Top Bar Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7442BF' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <IconButton 
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{ color: '#7442BF' }}
          >
            <FilterIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs 
          value={currentTab} 
          onChange={(_, newValue) => setCurrentTab(newValue)}
          sx={{ 
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 }
          }}
        >
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <Tab
                key={tab.value}
                icon={
                  <Badge badgeContent={unreadCountByTab[index]} color="error">
                    <IconComponent />
                  </Badge>
                }
                label={tab.label}
                iconPosition="start"
              />
            );
          })}
        </Tabs>

        {/* Tab Content */}
        <CardContent sx={{ p: 0 }}>
          {tabs.map((_, index) => (
            <TabPanel key={index} value={currentTab} index={index}>
              <Box sx={{ minHeight: 400 }}>
                {filteredMessages.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <InboxIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      No messages found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                      {searchQuery ? 'Try adjusting your search criteria' : 'All caught up!'}
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {filteredMessages.map((message, index) => (
                      <React.Fragment key={message.id}>
                        <ListItem
                          onClick={() => handleMessageClick(message)}
                          sx={{
                            cursor: 'pointer',
                            p: 3,
                            '&:hover': { bgcolor: 'rgba(116, 66, 191, 0.04)' },
                            bgcolor: message.isRead ? 'transparent' : 'rgba(116, 66, 191, 0.02)',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 48 }}>
                            {getMessageIcon(message.type)}
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    {!message.isRead && (
                                      <UnreadIcon sx={{ fontSize: 8, color: '#7442BF' }} />
                                    )}
                                    <Typography variant="subtitle1" sx={{ 
                                      fontWeight: message.isRead ? 500 : 600,
                                      color: message.isRead ? 'text.primary' : '#333'
                                    }}>
                                      {message.title}
                                    </Typography>
                                    {message.isStarred && (
                                      <StarFilledIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                                    )}
                                    {message.actionRequired && (
                                      <Chip 
                                        label="Action Required" 
                                        size="small" 
                                        sx={{ 
                                          bgcolor: '#fff3e0', 
                                          color: '#f57c00',
                                          fontSize: '0.7rem',
                                          height: 20
                                        }} 
                                      />
                                    )}
                                  </Box>
                                  
                                  <Typography variant="body2" sx={{ 
                                    color: 'text.secondary',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    mb: 1
                                  }}>
                                    {message.content}
                                  </Typography>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                      {message.sender} • {formatTimestamp(message.timestamp)}
                                    </Typography>
                                    
                                    <Box 
                                      sx={{ 
                                        width: 6, 
                                        height: 6, 
                                        borderRadius: '50%',
                                        bgcolor: getPriorityColor(message.priority)
                                      }} 
                                    />
                                    
                                    {message.tags.slice(0, 2).map((tag) => (
                                      <Chip 
                                        key={tag}
                                        label={tag}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.65rem',
                                          height: 18,
                                          bgcolor: '#f5f5f5',
                                          color: 'text.secondary'
                                        }}
                                      />
                                    ))}
                                    
                                    {message.relatedLead && (
                                      <Chip 
                                        label={`Lead: ${message.relatedLead}`}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.65rem',
                                          height: 18,
                                          bgcolor: '#e3f2fd',
                                          color: '#1976d2'
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMessageStar(message.id);
                                    }}
                                    sx={{ color: message.isStarred ? '#ff9800' : '#ccc' }}
                                  >
                                    {message.isStarred ? <StarFilledIcon fontSize="small" /> : <StarIcon fontSize="small" />}
                                  </IconButton>
                                  
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMessageMenu(e, message)}
                                    sx={{ color: '#666' }}
                                  >
                                    <MoreVertIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        
                        {index < filteredMessages.length - 1 && (
                          <Divider sx={{ borderColor: '#f0f0f0' }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </TabPanel>
          ))}
        </CardContent>
      </Card>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { minWidth: 200, p: 1 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Priority
          </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High Priority</MenuItem>
              <MenuItem value="medium">Medium Priority</MenuItem>
              <MenuItem value="low">Low Priority</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Date Range
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Menu>

      {/* Message Context Menu */}
      <Menu
        anchorEl={messageMenuAnchorEl}
        open={Boolean(messageMenuAnchorEl)}
        onClose={closeMessageMenu}
      >
        <MenuItem onClick={() => {
          if (menuMessage) toggleMessageRead(menuMessage.id);
          closeMessageMenu();
        }}>
          <ListItemIcon>
            {menuMessage?.isRead ? <UnreadIcon fontSize="small" /> : <ReadIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={menuMessage?.isRead ? 'Mark as Unread' : 'Mark as Read'} />
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (menuMessage) toggleMessageStar(menuMessage.id);
          closeMessageMenu();
        }}>
          <ListItemIcon>
            {menuMessage?.isStarred ? <StarIcon fontSize="small" /> : <StarFilledIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={menuMessage?.isStarred ? 'Remove Star' : 'Add Star'} />
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (menuMessage) archiveMessage(menuMessage.id);
          closeMessageMenu();
        }}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Archive" />
        </MenuItem>
      </Menu>

      {/* Message Detail Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', md: 500 } }
        }}
      >
        {selectedMessage && (
          <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getMessageIcon(selectedMessage.type)}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedMessage.title}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    From: {selectedMessage.sender}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    • {formatTimestamp(selectedMessage.timestamp)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={selectedMessage.priority}
                    size="small"
                    sx={{ 
                      bgcolor: getPriorityColor(selectedMessage.priority),
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                  
                  {selectedMessage.actionRequired && (
                    <Chip 
                      label="Action Required" 
                      size="small" 
                      sx={{ bgcolor: '#fff3e0', color: '#f57c00' }} 
                    />
                  )}
                  
                  {selectedMessage.tags.map((tag) => (
                    <Chip 
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ bgcolor: '#f5f5f5', color: 'text.secondary' }}
                    />
                  ))}
                </Box>
              </Box>
              
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Message Content */}
            <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
              <Typography variant="body1" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedMessage.content}
              </Typography>
            </Paper>

            {/* Related Information */}
            {(selectedMessage.relatedLead || selectedMessage.relatedDeal) && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                    Related Information
                  </Typography>
                  
                  {selectedMessage.relatedLead && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <PersonIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Lead: {selectedMessage.relatedLead}
                        </Typography>
                        <Button size="small" sx={{ color: '#7442BF', p: 0, textTransform: 'none' }}>
                          View Lead Profile
                        </Button>
                      </Box>
                    </Box>
                  )}
                  
                  {selectedMessage.relatedDeal && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <MoneyIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Deal: {selectedMessage.relatedDeal}
                        </Typography>
                        <Button size="small" sx={{ color: '#7442BF', p: 0, textTransform: 'none' }}>
                          View Deal Details
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7442BF' }}>
                  Actions
                </Typography>
                
                <Stack spacing={1}>
                  {selectedMessage.actionRequired && (
                    <Button
                      variant="contained"
                      startIcon={<PriorityIcon />}
                      sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
                    >
                      Take Action
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<ReplyIcon />}
                    sx={{ color: '#7442BF', borderColor: '#7442BF' }}
                  >
                    Reply / Comment
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={selectedMessage.isStarred ? <StarIcon /> : <StarFilledIcon />}
                    onClick={() => toggleMessageStar(selectedMessage.id)}
                    sx={{ color: '#ff9800', borderColor: '#ff9800' }}
                  >
                    {selectedMessage.isStarred ? 'Remove Star' : 'Add Star'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<ArchiveIcon />}
                    onClick={() => {
                      archiveMessage(selectedMessage.id);
                      setDrawerOpen(false);
                    }}
                    sx={{ color: '#666', borderColor: '#666' }}
                  >
                    Archive Message
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default AdminInbox; 