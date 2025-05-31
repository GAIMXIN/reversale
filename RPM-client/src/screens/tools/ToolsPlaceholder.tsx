import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CardActionArea,
} from '@mui/material';
import {
  Email as EmailIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const ToolsPlaceholder: React.FC = () => {
  const navigate = useNavigate();

  const toolPlaceholders = [
    {
      id: 'tool-a',
      name: 'Outreach Tool',
      description: 'Powerful email outreach tool for bulk sending and customer relationship management',
      icon: <EmailIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Available',
      isActive: true,
      path: '/sales/tools/outreach',
    },
    {
      id: 'tool-b',
      name: 'Tool B',
      description: 'Analytics and reporting tools for better insights',
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Coming Soon',
      isActive: false,
    },
    {
      id: 'tool-c',
      name: 'Tool C',
      description: 'Automation and workflow optimization suite',
      icon: <CodeIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Coming Soon',
      isActive: false,
    },
  ];

  const handleToolClick = (tool: any) => {
    if (tool.isActive && tool.path) {
      navigate(tool.path);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Tools
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Powerful utilities and modules to enhance your sales workflow and productivity.
        </Typography>
      </Box>

      {/* Tool Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        {toolPlaceholders.map((tool) => (
          <Card 
            key={tool.id}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: tool.isActive ? 'pointer' : 'default',
              opacity: tool.isActive ? 1 : 0.7,
              '&:hover': tool.isActive ? {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              } : {},
            }}
          >
            {tool.isActive ? (
              <CardActionArea 
                onClick={() => handleToolClick(tool)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {tool.icon}
                  </Box>

                  {/* Title */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: '#333', 
                      mb: 1,
                      textAlign: 'center'
                    }}
                  >
                    {tool.name}
                  </Typography>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      mb: 2,
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    {tool.description}
                  </Typography>

                  {/* Status Badge */}
                  <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                    <Chip 
                      label={tool.status}
                      size="small"
                      sx={{ 
                        bgcolor: tool.isActive ? '#e8f5e8' : '#f3e5f5',
                        color: tool.isActive ? '#2e7d32' : '#7442BF',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            ) : (
              <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Icon */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {tool.icon}
                </Box>

                {/* Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    mb: 1,
                    textAlign: 'center'
                  }}
                >
                  {tool.name}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 2,
                    textAlign: 'center',
                    flex: 1
                  }}
                >
                  {tool.description}
                </Typography>

                {/* Status Badge */}
                <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                  <Chip 
                    label={tool.status}
                    size="small"
                    sx={{ 
                      bgcolor: '#f3e5f5',
                      color: '#7442BF',
                      fontWeight: 500,
                    }}
                  />
                </Box>
              </CardContent>
            )}
          </Card>
        ))}
      </Box>

      {/* Footer Info */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          More powerful tools and integrations are being developed. Stay tuned for updates!
        </Typography>
      </Box>
    </Box>
  );
};

export default ToolsPlaceholder; 