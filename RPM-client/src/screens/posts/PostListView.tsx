import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  IconButton,
  Menu,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  DraftsOutlined,
  SendOutlined,
  PendingActionsOutlined,
  CheckCircleOutlined,
  List as ListIcon,
  Subject as SummaryIcon,
  GridView as ImageIcon,
} from '@mui/icons-material';
import { useRequest, RequestSummary } from '../../contexts/RequestContext';

interface PostListViewProps {}

type PostStatus = 'draft' | 'sent' | 'ongoing' | 'completed';
type ViewMode = 'list' | 'summary' | 'card';

const statusConfig = {
  draft: {
    title: 'Draft Posts',
    icon: <DraftsOutlined />,
    color: '#6c757d',
    statuses: ['draft']
  },
  sent: {
    title: 'Sent Posts',
    icon: <SendOutlined />,
    color: '#17a2b8',
    statuses: ['confirmed', 'sent']
  },
  ongoing: {
    title: 'Ongoing Posts',
    icon: <PendingActionsOutlined />,
    color: '#ffc107',
    statuses: ['processing']
  },
  completed: {
    title: 'Completed Posts',
    icon: <CheckCircleOutlined />,
    color: '#28a745',
    statuses: ['completed']
  }
};

const PostListView: React.FC<PostListViewProps> = () => {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const { requestHistory } = useRequest();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('postListViewMode');
    return (saved as ViewMode) || 'card';
  });

  const postsPerPage = 12;
  
  // Ensure we have a valid status, default to 'draft'
  const currentStatus = (status as PostStatus) || 'draft';
  
  // Validate status parameter and redirect if invalid
  useEffect(() => {
    if (status && !['draft', 'sent', 'ongoing', 'completed'].includes(status)) {
      navigate('/posts/status/draft', { replace: true });
    }
  }, [status, navigate]);
  
  const config = statusConfig[currentStatus];

  // Filter posts based on current status
  const filteredPosts = requestHistory.filter(post =>
    config.statuses.includes(post.status as any)
  );

  // Apply search filter
  const searchedPosts = filteredPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.problem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply sorting
  const sortedPosts = [...searchedPosts].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'price':
        comparison = a.estPrice - b.estPrice;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    // All status chips now use default gray styling for consistency
    return 'default';
  };

  const getStatusDisplay = (status: string): string => {
    // Convert "processing" status to "ONGOING" for display
    if (status === 'processing') {
      return 'ONGOING';
    }
    return status.toUpperCase();
  };

  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleEdit = () => {
    if (selectedPost) {
      navigate(`/posts/${selectedPost}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedPost) {
      navigate(`/posts/${selectedPost}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete post:', selectedPost);
    handleMenuClose();
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('postListViewMode', mode);
    setCurrentPage(1); // Reset to first page when changing view
  };

  // Render posts in list view mode
  const renderListView = () => (
    <Paper sx={{ overflow: 'hidden' }}>
      {paginatedPosts.map((post, index) => (
        <Box
          key={post.id}
          onClick={() => handlePostClick(post.id)}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: index < paginatedPosts.length - 1 ? '1px solid #e0e0e0' : 'none',
            '&:hover': {
              bgcolor: 'rgba(116, 66, 191, 0.02)',
            },
            transition: 'background-color 0.2s ease',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Chip 
              label={getStatusDisplay(post.status)}
              color={getStatusColor(post.status)}
              size="small"
              sx={{ 
                fontWeight: 600, 
                minWidth: 80,
                bgcolor: '#E0E0E0',
                color: '#666',
                '& .MuiChip-label': {
                  fontWeight: 600
                }
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {post.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#7442BF' }}>
              {formatPrice(post.estPrice)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100, textAlign: 'right' }}>
              {formatDate(post.lastModified)}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => handleMoreClick(e, post.id)}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Paper>
  );

  // Render posts in summary view mode
  const renderSummaryView = () => (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
      gap: 3,
    }}>
      {paginatedPosts.map((post) => (
        <Paper
          key={post.id}
          onClick={() => handlePostClick(post.id)}
          sx={{
            p: 3,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Chip 
              label={getStatusDisplay(post.status)}
              color={getStatusColor(post.status)}
              size="small"
              sx={{ 
                fontWeight: 600,
                bgcolor: '#E0E0E0',
                color: '#666',
                '& .MuiChip-label': {
                  fontWeight: 600
                }
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => handleMoreClick(e, post.id)}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, lineHeight: 1.3 }}>
            {post.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {post.problem}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">Budget:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                {formatPrice(post.estPrice)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">Timeline:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {post.estETA}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Last updated: {formatDate(post.lastModified)}
          </Typography>
        </Paper>
      ))}
    </Box>
  );

  // Render posts in card view mode (existing implementation with slight modifications)
  const renderCardView = () => (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: 3,
    }}>
      {paginatedPosts.map((post) => (
        <Card 
          key={post.id}
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            }
          }}
          onClick={() => handlePostClick(post.id)}
        >
          {/* Thumbnail placeholder */}
          <Box sx={{
            height: 140,
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <ImageIcon sx={{ fontSize: 40, color: '#ccc' }} />
          </Box>
          
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Chip 
                label={getStatusDisplay(post.status)}
                color={getStatusColor(post.status)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  bgcolor: '#E0E0E0',
                  color: '#666',
                  '& .MuiChip-label': {
                    fontWeight: 600
                  }
                }}
              />
              <IconButton
                size="small"
                onClick={(e) => handleMoreClick(e, post.id)}
                sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
              {post.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.4
              }}
            >
              {post.problem}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                {formatPrice(post.estPrice)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(post.lastModified)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 2, 
        mb: 4, 
        background: '#7442BF', 
        color: 'white' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'white' }}>
              {config.icon}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'white' }}>
              {config.title}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500, color: 'white' }}>
            {sortedPosts.length} posts
          </Typography>
        </Box>
      </Paper>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            alignItems: 'center',
            flexWrap: 'wrap',
            flex: 1
          }}>
            <TextField
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="price">Price</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <MenuItem value="desc">Desc</MenuItem>
                <MenuItem value="asc">Asc</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* View Mode Toggle */}
          <Box sx={{ 
            display: 'flex', 
            p: 1, 
            borderRadius: 2,
            bgcolor: '#f8f9fa'
          }}>
            <IconButton
              onClick={() => handleViewModeChange('list')}
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: viewMode === 'list' ? '#7442BF' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#666',
                '&:hover': {
                  bgcolor: viewMode === 'list' ? '#5e3399' : 'rgba(116, 66, 191, 0.1)',
                },
              }}
            >
              <ListIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleViewModeChange('summary')}
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: viewMode === 'summary' ? '#7442BF' : 'transparent',
                color: viewMode === 'summary' ? 'white' : '#666',
                '&:hover': {
                  bgcolor: viewMode === 'summary' ? '#5e3399' : 'rgba(116, 66, 191, 0.1)',
                },
              }}
            >
              <SummaryIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => handleViewModeChange('card')}
              sx={{
                p: 1,
                borderRadius: 1.5,
                bgcolor: viewMode === 'card' ? '#7442BF' : 'transparent',
                color: viewMode === 'card' ? 'white' : '#666',
                '&:hover': {
                  bgcolor: viewMode === 'card' ? '#5e3399' : 'rgba(116, 66, 191, 0.1)',
                },
              }}
            >
              <ImageIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Posts Grid */}
      {paginatedPosts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          {config.icon}
          <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
            No {currentStatus} posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentStatus === 'draft' && "Start by creating your first post."}
            {currentStatus === 'sent' && "Posts you submit will appear here."}
            {currentStatus === 'ongoing' && "Active projects will be shown here."}
            {currentStatus === 'completed' && "Finished projects will be displayed here."}
          </Typography>
          {currentStatus === 'draft' && (
            <Button
              variant="contained"
              sx={{ mt: 3, bgcolor: '#7442BF' }}
              onClick={() => navigate('/')}
            >
              Create New Post
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            {viewMode === 'list' && renderListView()}
            {viewMode === 'summary' && renderSummaryView()}
            {viewMode === 'card' && renderCardView()}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1, fontSize: 18 }} />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PostListView; 