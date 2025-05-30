import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Divider,
  Button,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  AttachMoney as PaymentIcon,
} from '@mui/icons-material';
import { useRequest, RequestSummary } from '../../contexts/RequestContext';
import PostActionsPanel from './PostActionsPanel';
import PostStatusRenderer from './PostStatusRenderer';

interface PostDetailPageProps {}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById } = useRequest();
  const [post, setPost] = useState<RequestSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundPost = getRequestById(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        // Handle case where post is not found
        console.error('Post not found');
      }
      setLoading(false);
    }
  }, [id, getRequestById]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'confirmed':
      case 'sent':
        return 'info';
      case 'processing':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'confirmed':
        return 'Confirmed';
      case 'sent':
        return 'Sent';
      case 'processing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#fafafa'
      }}>
        {/* Main Content Area Skeleton */}
        <Box sx={{ 
          flex: 1, 
          maxWidth: 'calc(100% - 400px)',
          p: 4,
          ml: '280px' // Account for sidebar width
        }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="30%" height={30} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 3 }} />
        </Box>
        
        {/* Action Panel Skeleton */}
        <Box sx={{ 
          width: 320,
          position: 'fixed',
          right: 0,
          top: 64,
          bottom: 0,
          p: 3,
          bgcolor: 'white',
          borderLeft: '1px solid #e0e0e0'
        }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Box>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        ml: '280px' // Account for sidebar
      }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Post Not Found
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The post you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/posts/draft')}
            sx={{ bgcolor: '#7442BF' }}
          >
            Back to Posts
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex',
      width: '100%',
      minHeight: '100vh',
      bgcolor: '#fafafa'
    }}>
      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1,
        maxWidth: 'calc(100% - 400px)',
        p: 4,
        ml: '280px' // Account for sidebar width
      }}>
        {/* Header Section */}
        <Paper sx={{ p: 4, mb: 3, bgcolor: 'white' }}>
          {/* Status and Metadata */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip 
              label={getStatusLabel(post.status)}
              color={getStatusColor(post.status)}
              sx={{ fontWeight: 600 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CalendarIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                Posted on {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Post Title */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: '#1a1a1a',
              lineHeight: 1.2
            }}
          >
            {post.title}
          </Typography>

          {/* Post Metadata */}
          <Box sx={{ 
            display: 'flex', 
            gap: 4, 
            mb: 3,
            color: 'text.secondary'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Budget: ${post.estPrice.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2">
              Timeline: {post.estETA}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Post Description */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 2,
              color: '#333'
            }}
          >
            Description
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              lineHeight: 1.7,
              mb: 3,
              whiteSpace: 'pre-wrap'
            }}
          >
            {post.problem}
          </Typography>

          {/* Desired Outcome */}
          {post.desiredOutcome && (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: '#333'
                }}
              >
                Desired Outcome
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.7,
                  mb: 3,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {post.desiredOutcome}
              </Typography>
            </>
          )}

          {/* Impact */}
          {post.impact && (
            <>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  color: '#333'
                }}
              >
                Expected Impact
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.7,
                  mb: 3,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {post.impact}
              </Typography>
            </>
          )}
        </Paper>

        {/* Status-specific Content */}
        <PostStatusRenderer post={post} onUpdate={setPost} />

        {/* Agent Summary Section (Optional Future Enhancement) */}
        {post.originalText && (
          <Paper sx={{ p: 4, mt: 3, bgcolor: '#f8f9ff', border: '1px solid #e3e7ff' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                color: '#7442BF'
              }}
            >
              💡 AI Agent Summary
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                lineHeight: 1.6,
                color: '#5a5a5a',
                fontStyle: 'italic'
              }}
            >
              This post was automatically processed and structured from: "{post.originalText.substring(0, 200)}..."
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Right Action Panel */}
      <PostActionsPanel post={post} onUpdate={setPost} />
    </Box>
  );
};

export default PostDetailPage; 