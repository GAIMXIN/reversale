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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useRequest, RequestSummary } from '../../contexts/RequestContext';
import PostActionsPanel from './PostActionsPanel';
import PostStatusRenderer from './PostStatusRenderer';
import PostDetailLayout from './PostDetailLayout';

interface PostDetailPageProps {}

const PostDetailPage: React.FC<PostDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRequestById } = useRequest();
  const [post, setPost] = useState<RequestSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOriginalContent, setShowOriginalContent] = useState(false);

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

  const getBackNavigationInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: '← Back to Drafts', path: '/posts/status/draft' };
      case 'confirmed':
      case 'sent':
        return { label: '← Back to Sent', path: '/posts/status/sent' };
      case 'processing':
        return { label: '← Back to Ongoing', path: '/posts/status/ongoing' };
      case 'completed':
        return { label: '← Back to Completed', path: '/posts/status/completed' };
      default:
        return { label: '← Back to Posts', path: '/posts/status/draft' };
    }
  };

  const handleBackNavigation = () => {
    if (post) {
      const backInfo = getBackNavigationInfo(post.status);
      navigate(backInfo.path);
    }
  };

  const handleToggleOriginalContent = () => {
    setShowOriginalContent(!showOriginalContent);
  };

  if (loading) {
    return (
      <PostDetailLayout 
        rightSidebar={<Skeleton variant="rectangular" width="100%" height={400} />}
      >
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="30%" height={30} sx={{ mt: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mt: 3 }} />
      </PostDetailLayout>
    );
  }

  if (!post) {
    return (
      <PostDetailLayout rightSidebar={<Box />}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
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
              onClick={() => navigate('/posts/status/draft')}
              sx={{ bgcolor: '#7442BF' }}
            >
              Back to Posts
            </Button>
          </Alert>
        </Box>
      </PostDetailLayout>
    );
  }

  const mainContent = (
    <>
      {/* Back Navigation Button */}
      {post && (
        <Button
          onClick={handleBackNavigation}
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            color: '#666',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            px: 0,
            '&:hover': {
              bgcolor: 'transparent',
              color: '#7442BF',
            },
            alignSelf: 'flex-start'
          }}
        >
          {getBackNavigationInfo(post.status).label}
        </Button>
      )}

      {/* Header Section - conditionally rendered for completed and ongoing posts */}
      {(post.status !== 'completed' && post.status !== 'processing' || showOriginalContent) && (
        <Paper sx={{ p: 4, mb: 3, bgcolor: 'white', borderRadius: 3 }}>
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
      )}

      {/* Status-specific Content */}
      <PostStatusRenderer post={post} onUpdate={setPost} />

      {/* AI Agent Summary section removed entirely per requirements */}
    </>
  );

  const rightSidebar = (
    <PostActionsPanel 
      post={post} 
      onUpdate={setPost} 
      showOriginalContent={showOriginalContent}
      onToggleOriginalContent={handleToggleOriginalContent}
    />
  );

  return (
    <PostDetailLayout rightSidebar={rightSidebar}>
      {mainContent}
    </PostDetailLayout>
  );
};

export default PostDetailPage; 