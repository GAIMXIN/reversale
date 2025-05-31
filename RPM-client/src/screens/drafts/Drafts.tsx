import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  AccessTime as TimeIcon,
  AttachMoney as BudgetIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Add as AddIcon,
  ShoppingCart as ProductIcon,
  Description as DraftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductRecommendations from '../products/ProductRecommendations';

interface Draft {
  id: string;
  title: string;
  content: string;
  budget: string;
  timeline: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

const Drafts: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [currentTab, setCurrentTab] = useState(0); // 0 = My Drafts, 1 = Product Recommendations
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newDraftDialogOpen, setNewDraftDialogOpen] = useState(false);
  const [newDraft, setNewDraft] = useState<Partial<Draft>>({
    title: '',
    content: '',
    budget: '',
    timeline: '',
    category: 'General'
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDraftDetails, setSelectedDraftDetails] = useState<Draft | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load drafts from localStorage on component mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem('reversale-drafts');
    if (savedDrafts) {
      try {
        const parsedDrafts = JSON.parse(savedDrafts);
        setDrafts(parsedDrafts);
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    }
    // Do not load demo data automatically - show empty state instead
  }, []);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'products') {
      setCurrentTab(1); // Switch to Product Recommendations tab
    } else {
      setCurrentTab(0); // Default to My Drafts tab
    }
  }, [location.search]);

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft({ ...draft });
    setEditDialogOpen(true);
  };

  const handleSaveDraft = () => {
    if (!editingDraft) return;

    const updatedDrafts = drafts.map(draft => 
      draft.id === editingDraft.id 
        ? { ...editingDraft, updatedAt: new Date().toISOString() }
        : draft
    );
    
    setDrafts(updatedDrafts);
    setEditDialogOpen(false);
    setEditingDraft(null);
  };

  const handleDeleteDraft = (draftId: string) => {
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    setDrafts(updatedDrafts);
    
    // Update localStorage
    try {
      localStorage.setItem('reversale-drafts', JSON.stringify(updatedDrafts));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    handleMenuClose();
    setDraftToDelete(null);
  };

  const handleSendToSalesman = async (draft: Draft) => {
    try {
      // Navigate to chat with salesman and pass draft data
      navigate('/chat-salesman', { state: { draft } });
      // Show success message
      alert('Redirecting to chat with our sales expert...');
    } catch (error) {
      console.error('Error navigating to salesman chat:', error);
      alert('Error connecting to chat. Please try again.');
    }
    handleMenuClose();
  };

  const handleSendViaEmail = (draft: Draft) => {
    try {
      const subject = encodeURIComponent(`Project Inquiry: ${draft.title}`);
      const body = encodeURIComponent(`
Project Title: ${draft.title}

Project Details:
${draft.content}

Budget Range: ${draft.budget}
Timeline: ${draft.timeline}

Please contact me to discuss this project further.

Best regards,
[Your Name]
[Your Contact Information]
      `);
      
      const mailto = `mailto:sales@reversale.com?subject=${subject}&body=${body}`;
      window.open(mailto, '_blank');
      
      alert('Email client opened! Please send the email from your email application.');
    } catch (error) {
      console.error('Error opening email client:', error);
      alert('Unable to open email client. Please manually send an email to sales@reversale.com');
    }
    handleMenuClose();
  };

  const handleSendAllDraftsViaEmail = () => {
    try {
      if (drafts.length === 0) {
        alert('No drafts to send.');
        return;
      }

      let emailBody = `Dear Sales Team,

I would like to share all my project drafts with you for review and consultation:

`;

      drafts.forEach((draft, index) => {
        emailBody += `
=== PROJECT ${index + 1}: ${draft.title} ===

Project Details:
${draft.content}

Budget Range: ${draft.budget}
Timeline: ${draft.timeline}
Category: ${draft.category}

`;
      });

      emailBody += `
Please review these projects and contact me to discuss how your team can help with implementation.

Best regards,
[Your Name]
[Your Contact Information]
      `;

      const subject = encodeURIComponent(`Multiple Project Inquiries - ${drafts.length} Projects for Review`);
      const body = encodeURIComponent(emailBody);
      
      const mailto = `mailto:sales@reversale.com?subject=${subject}&body=${body}`;
      window.open(mailto, '_blank');
      
      alert(`Email client opened with all ${drafts.length} drafts! Please send the email from your email application.`);
    } catch (error) {
      console.error('Error opening email client:', error);
      alert('Unable to open email client. Please manually send an email to sales@reversale.com');
    }
  };

  const handleAddNewDraft = () => {
    setNewDraft({
      title: '',
      content: '',
      budget: '',
      timeline: '',
      category: 'General'
    });
    setNewDraftDialogOpen(true);
  };

  const handleSaveNewDraft = () => {
    if (!newDraft.title || !newDraft.content || !newDraft.budget || !newDraft.timeline) {
      alert('Please fill in all required fields.');
      return;
    }

    const timestamp = new Date().toISOString();
    const draftToSave: Draft = {
      id: Date.now().toString(),
      title: newDraft.title!,
      content: newDraft.content!,
      budget: newDraft.budget!,
      timeline: newDraft.timeline!,
      category: newDraft.category || 'General',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const updatedDrafts = [...drafts, draftToSave];
    setDrafts(updatedDrafts);
    localStorage.setItem('reversale-drafts', JSON.stringify(updatedDrafts));
    
    setNewDraftDialogOpen(false);
    setNewDraft({
      title: '',
      content: '',
      budget: '',
      timeline: '',
      category: 'General'
    });
    
    alert('New draft created successfully!');
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, draft: Draft) => {
    setAnchorEl(event.currentTarget);
    setSelectedDraft(draft);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDraft(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'e-commerce':
      case 'ecommerce': 
        return '#e91e63';
      case 'medical': 
        return '#2196f3';
      case 'restaurant': 
        return '#ff9800';
      case 'tech': 
        return '#9c27b0';
      default: 
        return '#7442BF';
    }
  };

  const handleViewDetails = (draft: Draft) => {
    setSelectedDraftDetails(draft);
    setDetailsDialogOpen(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Drafts & Products
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Manage your saved project proposals and discover product recommendations
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={(event, newValue) => setCurrentTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#666',
              '&.Mui-selected': {
                color: '#7442BF',
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#7442BF',
            }
          }}
        >
          <Tab 
            icon={<DraftIcon />} 
            label="My Drafts" 
            iconPosition="start"
            sx={{ mr: 2 }}
          />
          <Tab 
            icon={<ProductIcon />} 
            label="Product Recommendations" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {currentTab === 0 && (
        <Box>
          {/* My Drafts Header Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              My Saved Drafts
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddNewDraft}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#7442BF',
                  '&:hover': { bgcolor: '#5e3399' },
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(116, 66, 191, 0.3)',
                }}
              >
                Add New Post for Your Pinpoint
              </Button>
              <Button
                variant="outlined"
                onClick={handleSendAllDraftsViaEmail}
                startIcon={<EmailIcon />}
                sx={{
                  borderColor: '#7442BF',
                  color: '#7442BF',
                  '&:hover': { 
                    borderColor: '#5e3399',
                    bgcolor: 'rgba(116, 66, 191, 0.05)'
                  },
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Send All Drafts via Email
              </Button>
            </Box>
          </Box>

          {/* Drafts Grid */}
          {drafts.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              py: 8,
              borderRadius: 2,
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ 
                  color: '#666', 
                  mb: 2
                }}>
                  No drafts for pinpoints
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#999', 
                  mb: 4
                }}>
                  Your saved project drafts will appear here after you create them through AI chat or manual entry.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleAddNewDraft}
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: '#7442BF',
                      '&:hover': { bgcolor: '#5e3399' },
                      px: 3,
                      py: 1
                    }}
                  >
                    Create New Draft
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/chat-salesman')}
                    startIcon={<SendIcon />}
                    sx={{
                      borderColor: '#7442BF',
                      color: '#7442BF',
                      '&:hover': { 
                        borderColor: '#5e3399',
                        bgcolor: 'rgba(116, 66, 191, 0.05)'
                      },
                      px: 3,
                      py: 1
                    }}
                  >
                    Contact Salesman
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 4
            }}>
              {drafts.map((draft) => (
                <Card key={draft.id} sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)',
                  }
                }}>
                  <CardContent sx={{ flex: 1, p: 4 }}>
                    {/* Header with Title and Menu */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: '#333',
                        flex: 1,
                        pr: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {draft.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, draft)}
                        sx={{ color: '#666' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Category Chip */}
                    {draft.category && (
                      <Chip
                        label={draft.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(draft.category),
                          color: 'white',
                          mb: 2,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}

                    {/* Content Preview */}
                    <Typography variant="body2" sx={{ 
                      color: '#666',
                      mb: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                    }}>
                      {draft.content.replace(/\*\*/g, '').substring(0, 150)}...
                    </Typography>

                    {/* Draft Details */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5, 
                      mb: 4,
                      p: 2,
                      bgcolor: 'rgba(116, 66, 191, 0.03)',
                      borderRadius: 2,
                      border: '1px solid rgba(116, 66, 191, 0.1)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <BudgetIcon sx={{ fontSize: 18, color: '#7442BF' }} />
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                          Budget: <span style={{ color: '#7442BF', fontWeight: 600 }}>{draft.budget}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ScheduleIcon sx={{ fontSize: 18, color: '#7442BF' }} />
                        <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                          Timeline: <span style={{ color: '#7442BF', fontWeight: 600 }}>{draft.timeline}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <TimeIcon sx={{ fontSize: 18, color: '#999' }} />
                        <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                          Updated: {formatDate(draft.updatedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
                      {/* View Details Button */}
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={() => handleViewDetails(draft)}
                        sx={{
                          bgcolor: '#7442BF',
                          '&:hover': { bgcolor: '#5e3399' },
                          fontSize: '0.875rem',
                          py: 1,
                          fontWeight: 600
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Product Recommendations Tab */}
      {currentTab === 1 && (
        <Box>
          <ProductRecommendations />
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedDraft && handleEditDraft(selectedDraft)}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit Draft
        </MenuItem>
        <MenuItem onClick={() => selectedDraft && handleSendToSalesman(selectedDraft)}>
          <SendIcon sx={{ mr: 1, fontSize: 18 }} />
          Contact Salesman
        </MenuItem>
        <MenuItem onClick={() => selectedDraft && handleSendViaEmail(selectedDraft)}>
          <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
          Send via Email
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            setDraftToDelete(selectedDraft);
            setDeleteDialogOpen(true);
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete Draft
        </MenuItem>
      </Menu>

      {/* Edit Draft Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Edit Draft
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {editingDraft && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Project Title"
                value={editingDraft.title}
                onChange={(e) => setEditingDraft({...editingDraft, title: e.target.value})}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Project Details"
                value={editingDraft.content}
                onChange={(e) => setEditingDraft({...editingDraft, content: e.target.value})}
                fullWidth
                multiline
                rows={12}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Budget Range"
                  value={editingDraft.budget}
                  onChange={(e) => setEditingDraft({...editingDraft, budget: e.target.value})}
                  sx={{ flex: 1 }}
                  variant="outlined"
                />
                
                <TextField
                  label="Timeline"
                  value={editingDraft.timeline}
                  onChange={(e) => setEditingDraft({...editingDraft, timeline: e.target.value})}
                  sx={{ flex: 1 }}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSaveDraft}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: '#7442BF',
              '&:hover': { bgcolor: '#5e3399' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Draft Dialog */}
      <Dialog
        open={newDraftDialogOpen}
        onClose={() => setNewDraftDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2, 
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Add New Post for Your Pinpoint
          </Typography>
          <IconButton 
            onClick={() => setNewDraftDialogOpen(false)}
            sx={{ color: '#666' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Project Title"
              value={newDraft.title || ''}
              onChange={(e) => setNewDraft({...newDraft, title: e.target.value})}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Category"
              select
              value={newDraft.category || 'General'}
              onChange={(e) => setNewDraft({...newDraft, category: e.target.value})}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="E-commerce">E-commerce</MenuItem>
              <MenuItem value="Medical">Medical</MenuItem>
              <MenuItem value="Restaurant">Restaurant</MenuItem>
              <MenuItem value="Tech">Tech</MenuItem>
            </TextField>
            
            <TextField
              label="Project Details"
              value={newDraft.content || ''}
              onChange={(e) => setNewDraft({...newDraft, content: e.target.value})}
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Describe your business challenge, pain points, and desired solutions..."
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Budget Range"
                value={newDraft.budget || ''}
                onChange={(e) => setNewDraft({...newDraft, budget: e.target.value})}
                sx={{ flex: 1 }}
                variant="outlined"
                placeholder="e.g., $10,000 - $20,000"
              />
              
              <TextField
                label="Timeline"
                value={newDraft.timeline || ''}
                onChange={(e) => setNewDraft({...newDraft, timeline: e.target.value})}
                sx={{ flex: 1 }}
                variant="outlined"
                placeholder="e.g., 4-6 weeks"
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setNewDraftDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSaveNewDraft}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: '#7442BF',
              '&:hover': { bgcolor: '#5e3399' }
            }}
          >
            Create Draft
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Draft Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Delete Draft
          </Typography>
          <IconButton onClick={() => setDeleteDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {draftToDelete && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Are you sure you want to delete this draft?
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                This action cannot be undone.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={() => {
              if (draftToDelete) {
                handleDeleteDraft(draftToDelete.id);
              }
              setDeleteDialogOpen(false);
            }}
            variant="contained"
            color="error"
            sx={{
              bgcolor: '#dc3545',
              '&:hover': { bgcolor: '#c82333' }
            }}
          >
            Delete Draft
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Project Details
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedDraftDetails && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 项目标题 */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                  {selectedDraftDetails.title}
                </Typography>
                {selectedDraftDetails.category && (
                  <Chip
                    label={selectedDraftDetails.category}
                    size="small"
                    sx={{
                      bgcolor: getCategoryColor(selectedDraftDetails.category),
                      color: 'white',
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>

              {/* 项目描述 */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#7442BF', mb: 1 }}>
                  Project Description
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {selectedDraftDetails.content}
                  </Typography>
                </Paper>
              </Box>

              {/* 项目详细信息 */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2 
              }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(116, 66, 191, 0.03)', 
                  borderRadius: 2,
                  border: '1px solid rgba(116, 66, 191, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <BudgetIcon sx={{ fontSize: 20, color: '#7442BF' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                      Budget Range
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: 600 }}>
                    {selectedDraftDetails.budget}
                  </Typography>
                </Box>

                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(116, 66, 191, 0.03)', 
                  borderRadius: 2,
                  border: '1px solid rgba(116, 66, 191, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 20, color: '#7442BF' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7442BF' }}>
                      Timeline
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#333', fontWeight: 600 }}>
                    {selectedDraftDetails.timeline}
                  </Typography>
                </Box>
              </Box>

              {/* 时间信息 */}
              <Box sx={{ 
                p: 2, 
                bgcolor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#666', mb: 1 }}>
                  Time Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Created: {formatDate(selectedDraftDetails.createdAt)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Last Updated: {formatDate(selectedDraftDetails.updatedAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Close
          </Button>
          
          <Button
            onClick={() => {
              if (selectedDraftDetails) {
                handleEditDraft(selectedDraftDetails);
                setDetailsDialogOpen(false);
              }
            }}
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{
              borderColor: '#7442BF',
              color: '#7442BF',
              '&:hover': { 
                borderColor: '#5e3399',
                bgcolor: 'rgba(116, 66, 191, 0.05)'
              }
            }}
          >
            Edit
          </Button>
          
          <Button
            onClick={() => {
              if (selectedDraftDetails) {
                handleSendToSalesman(selectedDraftDetails);
                setDetailsDialogOpen(false);
              }
            }}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              bgcolor: '#7442BF',
              '&:hover': { bgcolor: '#5e3399' }
            }}
          >
            Contact Sales
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Drafts; 