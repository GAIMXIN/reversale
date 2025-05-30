import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Chip,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Person as PersonIcon,
  SmartToy as BotIcon,
  Settings as SystemIcon,
  Inbox as InboxIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';

// Notification data model
export interface InboxNotification {
  id: string;
  type: 'response' | 'status' | 'agent';
  postId: string;
  postTitle: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

// Mock notifications data
const mockNotifications: InboxNotification[] = [
  {
    id: '1',
    type: 'response',
    postId: 'sent-1',
    postTitle: 'Restaurant Self-Service Ordering System',
    message: 'You received a new proposal with timeline and pricing details',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: '2',
    type: 'status',
    postId: 'ongoing-1',
    postTitle: 'Custom CRM for Fitness Studio',
    message: 'Your project has been matched and moved to Ongoing status',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
  },
  {
    id: '3',
    type: 'agent',
    postId: 'draft-2',
    postTitle: 'Therapist Notes Documentation Agent',
    message: 'We optimized your post description to attract more qualified providers',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: false,
  },
  {
    id: '4',
    type: 'status',
    postId: 'completed-1',
    postTitle: 'Appointment Scheduling Bot for Dental Office',
    message: 'Your project has been completed and invoice is ready',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: '5',
    type: 'response',
    postId: 'sent-3',
    postTitle: 'Real Estate Lead Qualification Bot',
    message: 'A service provider sent you questions about your requirements',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
  },
];

const Inbox: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<InboxNotification[]>(mockNotifications);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'response':
        return <PersonIcon sx={{ color: '#2196f3' }} />;
      case 'agent':
        return <BotIcon sx={{ color: '#7442BF' }} />;
      case 'status':
        return <SystemIcon sx={{ color: '#ff9800' }} />;
      default:
        return <InboxIcon />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'response':
        return 'Response';
      case 'agent':
        return 'AI Agent';
      case 'status':
        return 'Status Update';
      default:
        return 'Notification';
    }
  };

  const handleNotificationClick = (notification: InboxNotification) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navigate to post detail
    navigate(`/posts/${notification.postId}`);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: '#000000', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InboxIcon sx={{ fontSize: 40, color: 'white' }} />
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
              Inbox
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              startIcon={<MarkReadIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              variant="outlined"
            >
              Mark All Read
            </Button>
          )}
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9, color: 'white' }}>
          Stay updated with responses, status changes, and AI suggestions for your posts
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8, mt: 1, color: 'white' }}>
          {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
        </Typography>
      </Paper>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <InboxIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            No messages yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            When you receive responses or updates to your posts, they'll appear here.
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ overflow: 'hidden' }}>
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      p: 3,
                      bgcolor: notification.read ? 'inherit' : 'rgba(116, 66, 191, 0.02)',
                      borderLeft: notification.read ? 'none' : '3px solid #7442BF',
                      '&:hover': {
                        bgcolor: 'rgba(116, 66, 191, 0.05)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 56 }}>
                      <Avatar sx={{ 
                        bgcolor: 'transparent', 
                        border: '2px solid #e0e0e0',
                        width: 40, 
                        height: 40 
                      }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Chip
                            label={getNotificationTypeLabel(notification.type)}
                            size="small"
                            color={notification.type === 'response' ? 'primary' : 
                                   notification.type === 'agent' ? 'secondary' : 'default'}
                            sx={{ fontWeight: 500 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(notification.createdAt)}
                          </Typography>
                          {!notification.read && (
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#7442BF',
                              ml: 'auto'
                            }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: notification.read ? 400 : 600,
                              color: notification.read ? 'text.primary' : '#000',
                              mb: 0.5,
                              lineHeight: 1.4
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 500 }}
                          >
                            Related to: "{notification.postTitle}"
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Inbox; 