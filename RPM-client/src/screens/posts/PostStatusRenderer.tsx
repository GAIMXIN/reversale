import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  AttachFile as AttachFileIcon,
  Message as MessageIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { RequestSummary } from '../../contexts/RequestContext';

interface PostStatusRendererProps {
  post: RequestSummary;
  onUpdate: (post: RequestSummary) => void;
}

const PostStatusRenderer: React.FC<PostStatusRendererProps> = ({ post, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);

  const handleSave = () => {
    onUpdate(editedPost);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPost(post);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderDraftStatus = () => (
    <Paper sx={{ p: 4, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
        ✏️ Draft Mode
      </Typography>
      
      {isEditing ? (
        <Box>
          <TextField
            label="Title"
            value={editedPost.title}
            onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            label="Problem Description"
            value={editedPost.problem}
            onChange={(e) => setEditedPost({ ...editedPost, problem: e.target.value })}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            label="Desired Outcome"
            value={editedPost.desiredOutcome || ''}
            onChange={(e) => setEditedPost({ ...editedPost, desiredOutcome: e.target.value })}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            label="Expected Impact"
            value={editedPost.impact || ''}
            onChange={(e) => setEditedPost({ ...editedPost, impact: e.target.value })}
            fullWidth
            multiline
            rows={2}
            margin="normal"
            variant="outlined"
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleSave}
              sx={{ bgcolor: '#7442BF' }}
            >
              Save Changes
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            This post is still in draft mode. You can edit the content and publish when ready.
          </Alert>
          
          <Button 
            variant="outlined" 
            onClick={() => setIsEditing(true)}
            sx={{ 
              color: '#7442BF',
              borderColor: '#7442BF'
            }}
          >
            Edit Content
          </Button>
        </Box>
      )}
    </Paper>
  );

  const renderSentStatus = () => (
    <Paper sx={{ p: 4, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1565c0' }}>
        📤 Sent - Waiting for Responses
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Your post has been submitted and is visible to service providers. You'll be notified when someone responds.
      </Alert>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        p: 3,
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid #e0e0e0'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          What happens next?
        </Typography>
        
        <List dense>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Service providers review your post"
              secondary="Qualified professionals will assess your requirements"
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <MessageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="You receive proposals"
              secondary="Interested providers will send you proposals with timelines and pricing"
            />
          </ListItem>
          
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Choose your preferred provider"
              secondary="Review proposals and select the best match for your project"
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );

  const renderOngoingStatus = () => (
    <Paper sx={{ p: 4, bgcolor: '#fff3e0', border: '1px solid #ffcc02' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#f57c00' }}>
        🔄 Project in Progress
      </Typography>
      
      {/* Partner Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Assigned Professional
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: '#7442BF' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Sarah Johnson
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Full-Stack Developer • 4.9 ⭐ (127 reviews)
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Expected Completion
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {post.estETA}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Project Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Project Progress
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">Overall Progress</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>65%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={65} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#7442BF'
                }
              }} 
            />
          </Box>
          
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#4caf50' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Requirements Analysis"
                secondary="Completed • 2 days ago"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#4caf50' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Design & Planning"
                secondary="Completed • 1 day ago"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <ScheduleIcon sx={{ color: '#ff9800' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Development Phase"
                secondary="In Progress • Est. 3 days remaining"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* Payment Information */}
      <Alert severity="success" sx={{ mb: 3 }}>
        💳 Payment of {formatPrice(post.estPrice)} has been secured in escrow. Funds will be released upon project completion.
      </Alert>
    </Paper>
  );

  const renderCompletedStatus = () => (
    <Paper sx={{ p: 4, bgcolor: '#e8f5e8', border: '1px solid #4caf50' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#2e7d32' }}>
        ✅ Project Completed
      </Typography>
      
      {/* Completion Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Project Summary
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#7442BF' }}>
                {formatPrice(post.estPrice)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Paid
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                12 days
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Time
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ff9800' }}>
                4.9 ⭐
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quality Rating
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Delivered:</strong> Custom ordering system with payment integration, 
            admin dashboard, and mobile-responsive design. All requirements have been 
            successfully implemented and tested.
          </Typography>
        </CardContent>
      </Card>
      
      {/* Deliverables */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            📋 Deliverables
          </Typography>
          
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <AttachFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Source Code Package"
                secondary="Complete codebase with documentation • 15.2 MB"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <AttachFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Deployment Guide"
                secondary="Step-by-step setup instructions • PDF, 12 pages"
              />
            </ListItem>
            
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <AttachFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="User Manual"
                secondary="Complete user guide with screenshots • PDF, 25 pages"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      {/* Payment Confirmation */}
      <Alert severity="success" sx={{ mb: 3 }}>
        ✅ Payment of {formatPrice(post.estPrice)} has been released to the service provider. 
        Invoice and receipt are available in your billing section.
      </Alert>
      
      {/* Feedback Section */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Your Feedback
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} sx={{ color: '#ffc107', fontSize: 20 }} />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              5/5 stars
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            "Excellent work! Sarah delivered exactly what we needed, on time and within budget. 
            The code quality is outstanding and the documentation is very helpful. Highly recommended!"
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );

  // Render based on post status
  switch (post.status) {
    case 'draft':
      return renderDraftStatus();
    case 'confirmed':
    case 'sent':
      return renderSentStatus();
    case 'processing':
      return renderOngoingStatus();
    case 'completed':
      return renderCompletedStatus();
    default:
      return null;
  }
};

export default PostStatusRenderer; 