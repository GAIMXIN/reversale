import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Send as SendIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  CloudUpload as CloudIcon,
} from '@mui/icons-material';

interface EmailRecipient {
  id: string;
  name: string;
  email: string;
  isValid: boolean;
  isDuplicate: boolean;
}

interface EmailData {
  subject: string;
  body: string;
}

interface SendResult {
  successCount: number;
  failureCount: number;
  newLeadsCreated: number;
  errors: string[];
}

const MassEmailSender: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [emailData, setEmailData] = useState<EmailData>({
    subject: '',
    body: '',
  });
  const [manualInput, setManualInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check for duplicates
  const checkDuplicates = (newRecipients: EmailRecipient[]): EmailRecipient[] => {
    const emailSet = new Set<string>();
    return newRecipients.map(recipient => {
      const isDuplicate = emailSet.has(recipient.email.toLowerCase());
      emailSet.add(recipient.email.toLowerCase());
      return { ...recipient, isDuplicate };
    });
  };

  // Handle manual input processing
  const handleManualInput = () => {
    const lines = manualInput.split('\n').filter(line => line.trim());
    const newRecipients: EmailRecipient[] = [];

    lines.forEach((line, index) => {
      const parts = line.split(',').map(part => part.trim());
      let name = '';
      let email = '';

      if (parts.length >= 2) {
        name = parts[0];
        email = parts[1];
      } else if (parts.length === 1) {
        email = parts[0];
        name = email.split('@')[0]; // Use email prefix as name
      }

      if (email) {
        newRecipients.push({
          id: `manual-${Date.now()}-${index}`,
          name: name || 'Unknown',
          email,
          isValid: validateEmail(email),
          isDuplicate: false,
        });
      }
    });

    const validatedRecipients = checkDuplicates([...recipients, ...newRecipients]);
    setRecipients(validatedRecipients);
    setManualInput('');
  };

  // Handle file upload (CSV/Excel)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const newRecipients: EmailRecipient[] = [];

      // Skip header row if it exists
      const startIndex = lines[0]?.toLowerCase().includes('name') || lines[0]?.toLowerCase().includes('email') ? 1 : 0;

      lines.slice(startIndex).forEach((line, index) => {
        const parts = line.split(',').map(part => part.trim().replace(/"/g, ''));
        if (parts.length >= 2) {
          const name = parts[0];
          const email = parts[1];
          
          if (email && name) {
            newRecipients.push({
              id: `file-${Date.now()}-${index}`,
              name,
              email,
              isValid: validateEmail(email),
              isDuplicate: false,
            });
          }
        }
      });

      const validatedRecipients = checkDuplicates([...recipients, ...newRecipients]);
      setRecipients(validatedRecipients);
    };

    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  // Remove recipient
  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id));
  };

  // Insert name placeholder
  const insertNamePlaceholder = () => {
    const textarea = document.querySelector('#email-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBody = emailData.body.substring(0, start) + '{name}' + emailData.body.substring(end);
      setEmailData({ ...emailData, body: newBody });
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 6, start + 6);
      }, 0);
    }
  };

  // Preview email with sample data
  const getPreviewEmail = () => {
    const sampleRecipient = recipients[0] || { name: 'John Doe', email: 'john@example.com' };
    return {
      subject: emailData.subject,
      body: emailData.body.replace(/{name}/g, sampleRecipient.name),
      recipient: sampleRecipient,
    };
  };

  // Simulate sending emails and creating leads
  const handleSendEmails = async () => {
    if (!emailData.subject.trim() || !emailData.body.trim()) {
      alert('Please fill in both subject and email body');
      return;
    }

    const validRecipients = recipients.filter(r => r.isValid && !r.isDuplicate);
    if (validRecipients.length === 0) {
      alert('No valid recipients to send to');
      return;
    }

    setIsSending(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate results
    const result: SendResult = {
      successCount: validRecipients.length,
      failureCount: 0,
      newLeadsCreated: Math.floor(validRecipients.length * 0.8), // 80% are new leads
      errors: [],
    };

    setSendResult(result);
    setIsSending(false);
    setShowResults(true);

    // TODO: In real implementation:
    // 1. Send emails via email service
    // 2. Check existing leads in database
    // 3. Create new leads with status "Contacted" and source "Mass Email Tool"
    // 4. Update leads table in SalesLeads component
  };

  const validRecipients = recipients.filter(r => r.isValid && !r.isDuplicate);
  const invalidRecipients = recipients.filter(r => !r.isValid || r.isDuplicate);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Mass Email Sender
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Send personalized emails to multiple recipients and automatically sync new leads to your CRM.
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
        gap: 3 
      }}>
        {/* Left Column - Email List Import */}
        <Box>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                1. Import Email List
              </Typography>

              {/* Import Method Tabs */}
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Upload File" />
                <Tab label="Manual Input" />
                <Tab label="Google Sheets" disabled />
              </Tabs>

              {/* Upload File Tab */}
              {activeTab === 0 && (
                <Box>
                  <input
                    accept=".csv,.xlsx,.xls"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{
                        py: 2,
                        borderStyle: 'dashed',
                        borderColor: '#7442BF',
                        color: '#7442BF',
                        '&:hover': {
                          borderColor: '#5e3399',
                          bgcolor: 'rgba(116, 66, 191, 0.04)',
                        },
                      }}
                    >
                      Upload CSV or Excel File
                    </Button>
                  </label>
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                    File must contain Name and Email columns
                  </Typography>
                </Box>
              )}

              {/* Manual Input Tab */}
              {activeTab === 1 && (
                <Box>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Enter recipients (one per line):&#10;John Doe, john@example.com&#10;Jane Smith, jane@example.com"
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleManualInput}
                    disabled={!manualInput.trim()}
                    sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
                  >
                    Add Recipients
                  </Button>
                </Box>
              )}

              {/* Google Sheets Tab */}
              {activeTab === 2 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CloudIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Google Sheets integration coming soon...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recipients List */}
          {recipients.length > 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    Recipients ({recipients.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={`${validRecipients.length} Valid`}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    {invalidRecipients.length > 0 && (
                      <Chip
                        label={`${invalidRecipients.length} Issues`}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell width={50}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recipients.map((recipient) => (
                        <TableRow key={recipient.id}>
                          <TableCell>{recipient.name}</TableCell>
                          <TableCell>{recipient.email}</TableCell>
                          <TableCell>
                            {recipient.isDuplicate ? (
                              <Chip label="Duplicate" size="small" color="warning" />
                            ) : recipient.isValid ? (
                              <Chip label="Valid" size="small" color="success" />
                            ) : (
                              <Chip label="Invalid" size="small" color="error" />
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeRecipient(recipient.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right Column - Email Composer */}
        <Box>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                2. Compose Email
              </Typography>

              {/* Subject */}
              <TextField
                fullWidth
                label="Subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                sx={{ mb: 3 }}
              />

              {/* Body */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Email Body
                  </Typography>
                  <Button
                    size="small"
                    onClick={insertNamePlaceholder}
                    sx={{ color: '#7442BF', textTransform: 'none' }}
                  >
                    Insert {'{name}'}
                  </Button>
                </Box>
                <TextField
                  id="email-body"
                  multiline
                  rows={10}
                  fullWidth
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  placeholder="Write your email message here...&#10;&#10;Use {name} to personalize with recipient's name."
                />
              </Box>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Pro tip: Use {'{name}'} anywhere in your message to personalize emails with each recipient's name.
              </Typography>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                3. Send Campaign
              </Typography>

              {/* Summary */}
              <Box sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2, mb: 3 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 2 
                }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Recipients
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
                      {validRecipients.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Estimated New Leads
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#5d8160' }}>
                      ~{Math.floor(validRecipients.length * 0.8)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(true)}
                  disabled={!emailData.subject.trim() || !emailData.body.trim()}
                  sx={{ color: '#7442BF', borderColor: '#7442BF' }}
                >
                  Preview
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSendEmails}
                  disabled={
                    !emailData.subject.trim() ||
                    !emailData.body.trim() ||
                    validRecipients.length === 0 ||
                    isSending
                  }
                  sx={{ bgcolor: '#7442BF', '&:hover': { bgcolor: '#5e3399' }, flex: 1 }}
                >
                  {isSending ? 'Sending...' : `Send ${validRecipients.length} Emails`}
                </Button>
              </Box>

              {/* Sending Progress */}
              {isSending && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress sx={{ mb: 1 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Sending emails and creating new leads...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent>
          {recipients.length > 0 ? (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                This is how your email will look to {getPreviewEmail().recipient.name}
              </Alert>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Subject: {getPreviewEmail().subject}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {getPreviewEmail().body}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Alert severity="warning">
              Add some recipients first to see the preview
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckIcon sx={{ color: 'success.main' }} />
          Campaign Sent Successfully!
        </DialogTitle>
        <DialogContent>
          {sendResult && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Emails Sent"
                  secondary={`${sendResult.successCount} emails delivered successfully`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="New Leads Created"
                  secondary={`${sendResult.newLeadsCreated} new leads added to your CRM with status "Contacted"`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Lead Source"
                  secondary="All new leads tagged with source: Mass Email Tool"
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/sales/leads')} variant="contained" sx={{ bgcolor: '#7442BF' }}>
            View Leads
          </Button>
          <Button onClick={() => setShowResults(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MassEmailSender; 