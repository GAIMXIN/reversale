import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  TextField,
  Avatar,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  CloudDone as CloudDoneIcon,
} from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useRequest } from '../../contexts/RequestContext';
import ChatSidebar from '../layout/ChatSidebar';
import DocumentHistory from './DocumentHistory';
import './RequestReview.css';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const RequestReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRequest, updateRequestStatus, getRequestById, setCurrentRequest } = useRequest();
  
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [documentStatus, setDocumentStatus] = useState<'draft' | 'confirmed' | 'sent' | 'processing' | 'completed'>('draft');
  
  // Auto-save related states
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize editor with the request summary content
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start editing your request details...',
      }),
    ],
    content: currentRequest ? generateMarkdownContent(currentRequest) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      // Trigger auto-save on content change for draft status
      if (documentStatus === 'draft') {
        handleAutoSave();
      }
    },
  });

  // Auto-save function
  const handleAutoSave = () => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current);
    }

    autoSaveTimeout.current = setTimeout(() => {
      setIsAutoSaving(true);
      
      // Simulate save operation
      setTimeout(() => {
        setIsAutoSaving(false);
        setLastSaved(new Date());
        setShowSavedIndicator(true);
        
        // Hide the saved indicator after 2 seconds
        setTimeout(() => {
          setShowSavedIndicator(false);
        }, 2000);
      }, 500);
    }, 1000); // Auto-save after 1 second of inactivity
  };

  useEffect(() => {
    if (currentRequest && editor) {
      editor.commands.setContent(generateMarkdownContent(currentRequest));
      setEditedTitle(currentRequest.title);
      setDocumentStatus(currentRequest.status);
    }
  }, [currentRequest, editor]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current);
      }
    };
  }, []);

  // Load request by ID if not in currentRequest
  useEffect(() => {
    if (id && !currentRequest) {
      const requestById = getRequestById(id);
      if (requestById) {
        setCurrentRequest(requestById);
      }
    }
  }, [id, currentRequest, getRequestById, setCurrentRequest]);

  // Initialize with a welcome message
  useEffect(() => {
    if (currentRequest) {
      setChatMessages([
        {
          id: '1',
          content: `I've generated your request summary. Feel free to ask me any questions about the details, pricing, or timeline. I can help you refine any section!`,
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [currentRequest]);

  const handleBack = () => {
    // If editing a draft, return to drafts page
    if (documentStatus === 'draft') {
      navigate('/posts/status/draft');
    } else {
      // For sent posts, return to appropriate status page
      const statusPages = {
        'sent': '/posts/status/sent',
        'confirmed': '/posts/status/sent',
        'processing': '/posts/status/ongoing',
        'completed': '/posts/status/completed',
      };
      navigate(statusPages[documentStatus] || '/posts/status/draft');
    }
  };

  const handleSendOut = async () => {
    setDocumentStatus('sent');
    setIsSending(true);

    if (currentRequest) {
      updateRequestStatus(currentRequest.id, 'sent');
    }

    // Simulate sending to backend service providers
    try {
      // Here you would make an API call to submit the request
      // await submitRequestToServiceProviders(requestData);
      
      setTimeout(() => {
        setDocumentStatus('processing');
        setIsSending(false);
        
        if (currentRequest) {
          updateRequestStatus(currentRequest.id, 'processing');
        }
        
        // Add success message to chat
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          content: "Your request has been sent successfully! We're now matching you with qualified service providers. You'll be notified once someone accepts your request.",
          sender: 'assistant',
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, successMessage]);

        // Navigate to a status tracking page or dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending request:', error);
      setDocumentStatus('draft');
      setIsSending(false);
      
      if (currentRequest) {
        updateRequestStatus(currentRequest.id, 'draft');
      }
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "There was an error sending your request. Please try again.",
        sender: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(chatInput),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsSending(false);
    }, 1000);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // Trigger auto-save for title change
    if (documentStatus === 'draft') {
      handleAutoSave();
    }
  };

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

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

  const handleDocumentSelect = (request: any) => {
    setCurrentRequest(request);
    navigate(`/request-review/${request.id}`);
  };

  if (!currentRequest) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading request...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Main Sidebar */}
      <ChatSidebar 
        width={sidebarWidth}
        onWidthChange={handleSidebarWidthChange}
      />

      {/* Document History Sidebar */}
      <Box sx={{ width: 300, borderRight: '1px solid #e0e0e0' }}>
        <DocumentHistory 
          onDocumentSelect={handleDocumentSelect}
          currentRequestId={currentRequest?.id}
        />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Paper sx={{ 
          p: 2, 
          borderRadius: 0,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBack} sx={{ color: '#666' }}>
              <ArrowBackIcon />
            </IconButton>
            {isEditingTitle ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 300 }}
                  autoFocus
                />
                <IconButton onClick={handleTitleSave} color="primary" size="small">
                  <SaveIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editedTitle}
                </Typography>
                <IconButton onClick={handleTitleEdit} size="small" sx={{ color: '#666' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            
            {/* Auto-save status indicator */}
            {documentStatus === 'draft' && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                {isAutoSaving ? (
                  <>
                    <CircularProgress size={16} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Saving...
                    </Typography>
                  </>
                ) : (
                  <Fade in={showSavedIndicator} timeout={500}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CloudDoneIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="caption" sx={{ color: '#4caf50' }}>
                        Saved
                      </Typography>
                    </Box>
                  </Fade>
                )}
                {lastSaved && !isAutoSaving && !showSavedIndicator && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </Typography>
                )}
              </Box>
            )}
            
            <Chip 
              label={`$${currentRequest.estPrice.toLocaleString()}`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={currentRequest.estETA}
              color="secondary"
              variant="outlined"
            />
            <Chip 
              label={documentStatus.toUpperCase()}
              color={getStatusColor(documentStatus)}
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {documentStatus === 'draft' && (
              <Button
                variant="contained"
                onClick={handleSendOut}
                disabled={isSending}
                sx={{
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#45a049' },
                  '&:disabled': { bgcolor: '#cccccc' }
                }}
              >
                {isSending ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    Sending...
                  </Box>
                ) : (
                  'Send Out'
                )}
              </Button>
            )}

            {(documentStatus === 'sent' || documentStatus === 'processing') && (
              <Button
                variant="outlined"
                disabled
                sx={{ color: '#666', borderColor: '#ccc' }}
              >
                Request Sent
              </Button>
            )}
          </Box>
        </Paper>

        {/* Content Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex',
          overflow: 'hidden'
        }}>
          {/* Document Editor */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Paper sx={{ 
              flex: 1, 
              m: 2,
              overflow: 'auto',
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <EditorContent 
                editor={editor}
                style={{ 
                  height: '100%',
                  overflow: 'auto'
                }}
              />
            </Paper>
          </Box>

          {/* Chat Panel */}
          <Box sx={{ 
            width: isChatOpen ? 350 : 0,
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            borderLeft: isChatOpen ? '1px solid #e0e0e0' : 'none'
          }}>
            {isChatOpen && (
              <Box sx={{ 
                width: 350,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fafafa'
              }}>
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Assistant
                    </Typography>
                  </Box>
                  <IconButton 
                    onClick={() => setIsChatOpen(false)}
                    size="small"
                    sx={{ color: '#666' }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {/* Chat Messages */}
                <Box sx={{ 
                  flex: 1, 
                  overflow: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {chatMessages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        gap: 1
                      }}
                    >
                      {message.sender === 'assistant' && (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#7442BF' }}>
                          AI
                        </Avatar>
                      )}
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '80%',
                          bgcolor: message.sender === 'user' ? '#7442BF' : 'white',
                          color: message.sender === 'user' ? 'white' : 'black',
                          borderRadius: 2,
                          border: message.sender === 'assistant' ? '1px solid #e0e0e0' : 'none'
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                      </Paper>
                      {message.sender === 'user' && (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196F3' }}>
                          U
                        </Avatar>
                      )}
                    </Box>
                  ))}
                  {isSending && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#7442BF' }}>
                        AI
                      </Avatar>
                      <Paper sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <CircularProgress size={16} />
                      </Paper>
                    </Box>
                  )}
                </Box>

                {/* Chat Input */}
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid #e0e0e0',
                  bgcolor: 'white'
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about the request..."
                      variant="outlined"
                      disabled={isSending}
                    />
                    <IconButton 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isSending}
                      color="primary"
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Chat Toggle Button (when closed) */}
          {!isChatOpen && (
            <Box sx={{ 
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}>
              <Tooltip title="Open Chat">
                <IconButton
                  onClick={() => setIsChatOpen(true)}
                  sx={{
                    bgcolor: '#7442BF',
                    color: 'white',
                    '&:hover': { bgcolor: '#5e3399' },
                    boxShadow: 2
                  }}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

// Helper function to generate markdown content from request summary
function generateMarkdownContent(request: any): string {
  return `
<h1>${request.title}</h1>

<h2>Problem Statement</h2>
<p>${request.problem}</p>

<h2>Business Impact</h2>
<p>${request.impact}</p>

<h2>Desired Outcome</h2>
<p>${request.desiredOutcome}</p>

<h2>Project Details</h2>
<p><strong>Estimated Investment:</strong> $${request.estPrice.toLocaleString()}</p>
<p><strong>Estimated Timeline:</strong> ${request.estETA}</p>

<h2>Original Request</h2>
<blockquote>
<p><em>${request.originalText}</em></p>
</blockquote>
  `.trim();
}

// Helper function to generate AI responses
function generateAIResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('expensive')) {
    return "The pricing is based on industry standards and the complexity of your requirements. I can break down the cost structure or discuss payment options if you'd like. Would you like to see a detailed cost breakdown?";
  } else if (lowerInput.includes('timeline') || lowerInput.includes('time') || lowerInput.includes('when')) {
    return "The timeline estimate considers project complexity, resource allocation, and typical implementation phases. I can provide a more detailed project schedule if needed. Would you like to see the milestone breakdown?";
  } else if (lowerInput.includes('change') || lowerInput.includes('modify') || lowerInput.includes('edit')) {
    return "Absolutely! You can edit any section directly in the document. I can also help you refine specific parts. What would you like to modify?";
  } else if (lowerInput.includes('question') || lowerInput.includes('help') || lowerInput.includes('explain')) {
    return "I'm here to help clarify any aspect of your request. Feel free to ask about the technical approach, implementation details, or any concerns you might have.";
  } else {
    return "That's a great point! I can help you refine that aspect of your request. Would you like me to suggest some specific improvements or alternatives?";
  }
}

export default RequestReview; 