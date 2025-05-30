import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Send as SendIcon,
} from '@mui/icons-material';

interface DraftPosting {
  id: string;
  leadId: string;
  title: string;
  description: string;
  expectedOutcome: string;
  budget: number;
  status: 'draft' | 'sent' | 'submitted';
  createdAt: string;
  sentAt?: string;
  submittedAt?: string;
  publicLink?: string;
}

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
}

const DraftEdit: React.FC = () => {
  const { leadId, draftId } = useParams<{ leadId: string; draftId: string }>();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<DraftPosting | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  // Mock data - in real app, this would come from API
  const mockLeads: Lead[] = [
    { id: '1', name: 'Sarah Johnson', company: 'TechFlow Solutions', email: 'sarah.johnson@techflow.com' },
    { id: '2', name: 'Michael Chen', company: 'DataVision Corp', email: 'm.chen@datavision.com' },
    { id: '3', name: 'Emily Rodriguez', company: 'CloudSync Inc', email: 'emily.r@cloudsync.com' },
  ];

  const mockDrafts: DraftPosting[] = [
    {
      id: 'draft1',
      leadId: '2',
      title: 'Mobile App Development for DataVision Corp',
      description: 'We need a comprehensive mobile application that integrates with our existing data visualization platform. The app should provide real-time analytics and reporting capabilities for field teams.',
      expectedOutcome: 'A cross-platform mobile app with offline capabilities, real-time data sync, and intuitive dashboard interface',
      budget: 22000,
      status: 'draft',
      createdAt: '2024-01-12',
    }
  ];

  useEffect(() => {
    // Mock API call to fetch draft and lead data
    setTimeout(() => {
      const foundLead = mockLeads.find(l => l.id === leadId);
      const foundDraft = mockDrafts.find(d => d.id === draftId);
      
      setLead(foundLead || null);
      setDraft(foundDraft || null);
      setLoading(false);
    }, 500);
  }, [leadId, draftId]);

  const handleSave = async () => {
    if (!draft) return;
    
    setSaving(true);
    // Mock API call
    setTimeout(() => {
      console.log('Draft saved:', draft);
      setSaving(false);
    }, 1000);
  };

  const handleSendToLead = async () => {
    if (!draft || !lead) return;
    
    setSending(true);
    // Mock API call
    setTimeout(() => {
      const publicLink = `https://app.reversale.com/owner/postings/drafts/${draft.id}`;
      const updatedDraft = {
        ...draft,
        status: 'sent' as const,
        sentAt: new Date().toISOString().split('T')[0],
        publicLink
      };
      
      setDraft(updatedDraft);
      console.log(`Draft sent to ${lead.email} with public link: ${publicLink}`);
      setSending(false);
      
      // Navigate back to lead detail
      navigate(`/sales/leads`);
    }, 1500);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading draft...</Typography>
      </Box>
    );
  }

  if (!draft || !lead) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="error">
          Draft not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/sales/leads')}
          sx={{ mt: 2 }}
        >
          Back to Leads
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/sales/leads')}
            sx={{ textDecoration: 'none' }}
          >
            Leads
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/sales/leads')}
            sx={{ textDecoration: 'none' }}
          >
            {lead.name}
          </Link>
          <Typography variant="body2" color="text.primary">
            Edit Draft
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
              Edit Draft Posting
            </Typography>
            <Typography variant="body1" color="text.secondary">
              for {lead.name} at {lead.company}
            </Typography>
          </Box>

          <Chip
            label={draft.status.charAt(0).toUpperCase() + draft.status.slice(1)}
            sx={{
              bgcolor: draft.status === 'draft' ? '#e3f2fd' : 
                      draft.status === 'sent' ? '#fff3e0' : '#e8f5e8',
              color: draft.status === 'draft' ? '#1976d2' : 
                     draft.status === 'sent' ? '#f57c00' : '#2e7d32',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Form */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          {draft.status !== 'draft' && (
            <Alert severity="info" sx={{ mb: 3 }}>
              This draft has been sent to the lead and can no longer be edited.
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Project Title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              disabled={draft.status !== 'draft'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: draft.status !== 'draft' ? '#f5f5f5' : 'white',
                }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Project Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              disabled={draft.status !== 'draft'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: draft.status !== 'draft' ? '#f5f5f5' : 'white',
                }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Expected Outcome"
              value={draft.expectedOutcome}
              onChange={(e) => setDraft({ ...draft, expectedOutcome: e.target.value })}
              disabled={draft.status !== 'draft'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: draft.status !== 'draft' ? '#f5f5f5' : 'white',
                }
              }}
            />

            <TextField
              type="number"
              label="Budget ($)"
              value={draft.budget}
              onChange={(e) => setDraft({ ...draft, budget: parseInt(e.target.value) || 0 })}
              disabled={draft.status !== 'draft'}
              sx={{
                maxWidth: 200,
                '& .MuiOutlinedInput-root': {
                  bgcolor: draft.status !== 'draft' ? '#f5f5f5' : 'white',
                }
              }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mt: 3,
        p: 3,
        bgcolor: '#f8f9fa',
        borderRadius: 2
      }}>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/sales/leads')}
        >
          Back to Leads
        </Button>

        {draft.status === 'draft' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving || !draft.title || !draft.description}
              sx={{ 
                color: '#7442BF', 
                borderColor: '#7442BF',
                '&:hover': { borderColor: '#5e3399', bgcolor: 'rgba(116, 66, 191, 0.04)' }
              }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>

            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendToLead}
              disabled={sending || !draft.title || !draft.description}
              sx={{
                bgcolor: '#7442BF',
                '&:hover': { bgcolor: '#5e3399' }
              }}
            >
              {sending ? 'Sending...' : 'Send to Lead'}
            </Button>
          </Box>
        )}

        {draft.status === 'sent' && draft.publicLink && (
          <Button
            variant="outlined"
            onClick={() => window.open(draft.publicLink, '_blank')}
            sx={{ 
              color: '#7442BF', 
              borderColor: '#7442BF'
            }}
          >
            View Public Link
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DraftEdit; 