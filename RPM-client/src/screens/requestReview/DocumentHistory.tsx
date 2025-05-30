import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Description as DocumentIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { useRequest, RequestSummary } from '../../contexts/RequestContext';

interface DocumentHistoryProps {
  onDocumentSelect: (request: RequestSummary) => void;
  currentRequestId?: string;
}

const DocumentHistory: React.FC<DocumentHistoryProps> = ({ 
  onDocumentSelect, 
  currentRequestId 
}) => {
  const { requestHistory } = useRequest();

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'confirmed':
        return 'info';
      case 'sent':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <Paper sx={{ 
      height: '100%', 
      overflow: 'hidden',
      border: '1px solid #e0e0e0'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#f8f9fa'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
          Document History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {requestHistory.length} documents
        </Typography>
      </Box>

      {/* Document List */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        maxHeight: 'calc(100vh - 200px)'
      }}>
        {requestHistory.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <DocumentIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
            <Typography variant="body2">
              No documents yet
            </Typography>
            <Typography variant="caption">
              Create your first document to see it here
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {requestHistory.map((request, index) => (
              <React.Fragment key={request.id}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton
                    onClick={() => onDocumentSelect(request)}
                    selected={request.id === currentRequestId}
                    sx={{
                      p: 2,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(116, 66, 191, 0.08)',
                        borderRight: '3px solid #7442BF'
                      },
                      '&:hover': {
                        bgcolor: 'rgba(116, 66, 191, 0.04)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 0,
                      flex: 1
                    }}>
                      <DocumentIcon 
                        color={request.id === currentRequestId ? 'primary' : 'action'} 
                        sx={{ fontSize: 20, flexShrink: 0 }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: request.id === currentRequestId ? 600 : 400,
                            color: request.id === currentRequestId ? '#7442BF' : 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {request.title}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          mt: 0.5
                        }}>
                          <Chip 
                            label={request.status.toUpperCase()}
                            color={getStatusColor(request.status)}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              '& .MuiChip-label': {
                                px: 1
                              }
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            sx={{ fontSize: '0.7rem' }}
                          >
                            {formatDate(request.lastModified)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                            mt: 0.5
                          }}
                        >
                          ${request.estPrice.toLocaleString()} • {request.estETA}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="More options">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more options
                        }}
                        sx={{ 
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          '.MuiListItemButton-root:hover &': {
                            opacity: 1
                          }
                        }}
                      >
                        <MoreIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
                {index < requestHistory.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default DocumentHistory; 