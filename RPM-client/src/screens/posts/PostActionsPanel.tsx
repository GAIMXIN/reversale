import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RepostIcon,
  Payment as PaymentIcon,
  Receipt as InvoiceIcon,
  Download as DownloadIcon,
  Cancel as CancelIcon,
  Support as SupportIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { RequestSummary, useRequest } from '../../contexts/RequestContext';

interface PostActionsPanelProps {
  post: RequestSummary;
  onUpdate: (post: RequestSummary) => void;
}

const PostActionsPanel: React.FC<PostActionsPanelProps> = ({ post, onUpdate }) => {
  const navigate = useNavigate();
  const { updateRequestStatus } = useRequest();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [repostTitle, setRepostTitle] = useState(`${post.title} (Repost)`);

  const handleEdit = () => {
    navigate(`/request-review/${post.id}`);
  };

  const handleRepost = () => {
    setShowRepostDialog(true);
  };

  const handleConfirmRepost = () => {
    // TODO: Implement repost functionality
    console.log('Reposting with title:', repostTitle);
    setShowRepostDialog(false);
    // Navigate to new post creation with pre-filled data
    navigate('/', { 
      state: { 
        repostData: { ...post, title: repostTitle } 
      } 
    });
  };

  const handleViewPayment = () => {
    // TODO: Navigate to payment details
    navigate('/billing');
  };

  const handleViewInvoice = () => {
    // TODO: Download or view invoice
    console.log('Viewing invoice for post:', post.id);
  };

  const handleDownloadAssets = () => {
    // TODO: Download delivery assets
    console.log('Downloading assets for post:', post.id);
  };

  const handleCancel = () => {
    // TODO: Cancel post
    if (post.status === 'draft' || post.status === 'sent') {
      updateRequestStatus(post.id, 'cancelled' as any);
      navigate('/posts/draft');
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting post:', post.id);
    setShowDeleteDialog(false);
    navigate('/posts/draft');
  };

  const handleContactSupport = () => {
    navigate('/support', { 
      state: { 
        postId: post.id, 
        subject: `Support for post: ${post.title}` 
      } 
    });
  };

  const handleSendPost = () => {
    updateRequestStatus(post.id, 'sent');
    const updatedPost = { ...post, status: 'sent' as any };
    onUpdate(updatedPost);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Determine available actions based on post status
  const getAvailableActions = () => {
    const actions = [];

    // Common actions
    actions.push({
      label: 'Contact Support',
      icon: <SupportIcon />,
      onClick: handleContactSupport,
      variant: 'outlined' as const,
      color: 'inherit' as const,
    });

    switch (post.status) {
      case 'draft':
        actions.unshift(
          {
            label: 'Edit Post',
            icon: <EditIcon />,
            onClick: handleEdit,
            variant: 'contained' as const,
            color: 'primary' as const,
          },
          {
            label: 'Send Post',
            icon: <SendIcon />,
            onClick: handleSendPost,
            variant: 'contained' as const,
            color: 'success' as const,
          }
        );
        actions.push(
          {
            label: 'Delete Draft',
            icon: <DeleteIcon />,
            onClick: handleDelete,
            variant: 'outlined' as const,
            color: 'error' as const,
          }
        );
        break;

      case 'confirmed':
      case 'sent':
        actions.unshift(
          {
            label: 'View Details',
            icon: <ViewIcon />,
            onClick: handleEdit,
            variant: 'contained' as const,
            color: 'primary' as const,
          }
        );
        actions.push(
          {
            label: 'Cancel Post',
            icon: <CancelIcon />,
            onClick: handleCancel,
            variant: 'outlined' as const,
            color: 'warning' as const,
          },
          {
            label: 'Repost',
            icon: <RepostIcon />,
            onClick: handleRepost,
            variant: 'outlined' as const,
            color: 'inherit' as const,
          }
        );
        break;

      case 'processing':
        actions.unshift(
          {
            label: 'View Payment Info',
            icon: <PaymentIcon />,
            onClick: handleViewPayment,
            variant: 'contained' as const,
            color: 'primary' as const,
          }
        );
        actions.push(
          {
            label: 'Repost',
            icon: <RepostIcon />,
            onClick: handleRepost,
            variant: 'outlined' as const,
            color: 'inherit' as const,
          }
        );
        break;

      case 'completed':
        actions.unshift(
          {
            label: 'View Invoice',
            icon: <InvoiceIcon />,
            onClick: handleViewInvoice,
            variant: 'contained' as const,
            color: 'primary' as const,
          },
          {
            label: 'Download Assets',
            icon: <DownloadIcon />,
            onClick: handleDownloadAssets,
            variant: 'contained' as const,
            color: 'success' as const,
          }
        );
        actions.push(
          {
            label: 'Repost',
            icon: <RepostIcon />,
            onClick: handleRepost,
            variant: 'outlined' as const,
            color: 'inherit' as const,
          }
        );
        break;
    }

    return actions;
  };

  const actions = getAvailableActions();

  return (
    <>
      {/* Actions Panel Content */}
      <Box>
        {/* Panel Header */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Actions
        </Typography>

        {/* Post Summary */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderRadius: 2, 
          mb: 3,
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Status: {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Budget: {formatPrice(post.estPrice)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              color={action.color}
              startIcon={action.icon}
              onClick={action.onClick}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                px: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                ...(action.variant === 'contained' && action.color === 'primary' && {
                  bgcolor: '#7442BF',
                  '&:hover': { bgcolor: '#5e3399' }
                })
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>

        {/* Additional Info Section */}
        {(post.status === 'processing' || post.status === 'completed') && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Project Info
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText 
                  primary="Timeline" 
                  secondary={post.estETA}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemText 
                  primary="Budget" 
                  secondary={formatPrice(post.estPrice)}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
              {post.status === 'processing' && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemText 
                    primary="Assigned to" 
                    secondary="Professional Partner"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              )}
            </List>
          </>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this post? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Repost Dialog */}
      <Dialog open={showRepostDialog} onClose={() => setShowRepostDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Repost</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Create a new post based on this one:
          </Typography>
          <TextField
            label="New Post Title"
            value={repostTitle}
            onChange={(e) => setRepostTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRepostDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmRepost} 
            variant="contained"
            sx={{ bgcolor: '#7442BF' }}
          >
            Create Repost
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostActionsPanel; 