import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: any;
  timestamp: Date;
}

interface EmployeeStatus {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  activeDeals: number;
  totalRevenue: number;
  lastActivity: string;
  currentTasks: string[];
  performance: {
    dealsWon: number;
    dealsLost: number;
    responseTime: string;
    customerSatisfaction: number;
  };
}

// Mock employee data
const mockEmployees: EmployeeStatus[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@reversale.com',
    role: 'Senior Sales Representative',
    avatar: '/avatars/sarah.jpg',
    status: 'online',
    activeDeals: 5,
    totalRevenue: 247500,
    lastActivity: '2 minutes ago',
    currentTasks: ['Follow up with TechFlow Solutions', 'Prepare proposal for DataSync Inc', 'Schedule demo for CloudTech'],
    performance: {
      dealsWon: 12,
      dealsLost: 3,
      responseTime: '1.2 hours',
      customerSatisfaction: 4.8
    }
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael@reversale.com',
    role: 'Sales Representative',
    avatar: '/avatars/michael.jpg',
    status: 'busy',
    activeDeals: 3,
    totalRevenue: 185000,
    lastActivity: '15 minutes ago',
    currentTasks: ['Negotiate contract terms', 'Send pricing information', 'Update CRM records'],
    performance: {
      dealsWon: 8,
      dealsLost: 2,
      responseTime: '2.1 hours',
      customerSatisfaction: 4.6
    }
  },
  {
    id: '3',
    name: 'Lisa Wang',
    email: 'lisa@reversale.com',
    role: 'Account Manager',
    avatar: '/avatars/lisa.jpg',
    status: 'online',
    activeDeals: 7,
    totalRevenue: 342000,
    lastActivity: '5 minutes ago',
    currentTasks: ['Client check-in calls', 'Renewal negotiations', 'Upsell opportunities'],
    performance: {
      dealsWon: 15,
      dealsLost: 1,
      responseTime: '0.8 hours',
      customerSatisfaction: 4.9
    }
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david@reversale.com',
    role: 'Junior Sales Representative',
    avatar: '/avatars/david.jpg',
    status: 'offline',
    activeDeals: 2,
    totalRevenue: 98000,
    lastActivity: '1 hour ago',
    currentTasks: ['Research new prospects', 'Complete training modules', 'Shadow senior reps'],
    performance: {
      dealsWon: 4,
      dealsLost: 3,
      responseTime: '3.5 hours',
      customerSatisfaction: 4.3
    }
  }
];

const AdminChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      role: 'assistant',
      content: 'Hello! I\'m your Admin Assistant. I can help you get insights about your team, deals, revenue, and employee performance. Try asking me:\n\n• "Show me employee status"\n• "What\'s our current revenue?"\n• "How is Sarah performing?"\n• "Who needs follow-up?"\n• "Show me active deals"\n• "Team performance summary"',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const processQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('employee') || lowerQuery.includes('team') || lowerQuery.includes('staff')) {
      if (lowerQuery.includes('status') || lowerQuery.includes('activity')) {
        return generateEmployeeStatusResponse();
      } else if (lowerQuery.includes('performance')) {
        return generatePerformanceResponse();
      }
    }
    
    if (lowerQuery.includes('revenue') || lowerQuery.includes('sales') || lowerQuery.includes('money')) {
      return generateRevenueResponse();
    }
    
    if (lowerQuery.includes('deals') || lowerQuery.includes('pipeline')) {
      return generateDealsResponse();
    }
    
    if (lowerQuery.includes('follow') || lowerQuery.includes('task') || lowerQuery.includes('todo')) {
      return generateTasksResponse();
    }
    
    // Check if asking about specific employee
    const employee = mockEmployees.find(emp => 
      lowerQuery.includes(emp.name.toLowerCase()) || 
      lowerQuery.includes(emp.name.split(' ')[0].toLowerCase())
    );
    
    if (employee) {
      return generateEmployeeDetailResponse(employee);
    }
    
    // Default response
    return {
      content: 'I can help you with information about:\n\n• Employee status and performance\n• Revenue and sales data\n• Active deals and pipeline\n• Team tasks and follow-ups\n• Individual employee details\n\nPlease ask me about any of these topics!',
      data: null
    };
  };

  const generateEmployeeStatusResponse = () => {
    const onlineCount = mockEmployees.filter(emp => emp.status === 'online').length;
    const busyCount = mockEmployees.filter(emp => emp.status === 'busy').length;
    const offlineCount = mockEmployees.filter(emp => emp.status === 'offline').length;
    
    return {
      content: `**Current Team Status:**\n\n🟢 Online: ${onlineCount} employees\n🟡 Busy: ${busyCount} employees\n⚫ Offline: ${offlineCount} employees\n\nDetailed employee information is shown below:`,
      data: {
        type: 'employee_status',
        employees: mockEmployees
      }
    };
  };

  const generatePerformanceResponse = () => {
    const totalDealsWon = mockEmployees.reduce((sum, emp) => sum + emp.performance.dealsWon, 0);
    const totalDealsLost = mockEmployees.reduce((sum, emp) => sum + emp.performance.dealsLost, 0);
    const avgSatisfaction = mockEmployees.reduce((sum, emp) => sum + emp.performance.customerSatisfaction, 0) / mockEmployees.length;
    
    return {
      content: `**Team Performance Summary:**\n\n✅ Total Deals Won: ${totalDealsWon}\n❌ Total Deals Lost: ${totalDealsLost}\n📊 Win Rate: ${((totalDealsWon / (totalDealsWon + totalDealsLost)) * 100).toFixed(1)}%\n⭐ Avg Customer Satisfaction: ${avgSatisfaction.toFixed(1)}/5.0\n\nDetailed performance metrics are shown below:`,
      data: {
        type: 'performance',
        employees: mockEmployees
      }
    };
  };

  const generateRevenueResponse = () => {
    const totalRevenue = mockEmployees.reduce((sum, emp) => sum + emp.totalRevenue, 0);
    const avgRevenue = totalRevenue / mockEmployees.length;
    const topPerformer = mockEmployees.reduce((top, emp) => emp.totalRevenue > top.totalRevenue ? emp : top);
    
    return {
      content: `**Revenue Analysis:**\n\n💰 Total Team Revenue: $${totalRevenue.toLocaleString()}\n📈 Average per Employee: $${avgRevenue.toLocaleString()}\n🏆 Top Performer: ${topPerformer.name} ($${topPerformer.totalRevenue.toLocaleString()})\n\nRevenue breakdown by employee is shown below:`,
      data: {
        type: 'revenue',
        employees: mockEmployees.sort((a, b) => b.totalRevenue - a.totalRevenue)
      }
    };
  };

  const generateDealsResponse = () => {
    const totalActiveDeals = mockEmployees.reduce((sum, emp) => sum + emp.activeDeals, 0);
    const employeesWithDeals = mockEmployees.filter(emp => emp.activeDeals > 0);
    
    return {
      content: `**Active Deals Summary:**\n\n🔥 Total Active Deals: ${totalActiveDeals}\n👥 Employees with Active Deals: ${employeesWithDeals.length}/${mockEmployees.length}\n📊 Average Deals per Employee: ${(totalActiveDeals / mockEmployees.length).toFixed(1)}\n\nActive deals breakdown is shown below:`,
      data: {
        type: 'deals',
        employees: mockEmployees.filter(emp => emp.activeDeals > 0).sort((a, b) => b.activeDeals - a.activeDeals)
      }
    };
  };

  const generateTasksResponse = () => {
    const allTasks = mockEmployees.flatMap(emp => 
      emp.currentTasks.map(task => ({ employee: emp.name, task }))
    );
    
    return {
      content: `**Current Tasks & Follow-ups:**\n\n📋 Total Active Tasks: ${allTasks.length}\n⏰ Employees with pending tasks: ${mockEmployees.filter(emp => emp.currentTasks.length > 0).length}\n\nDetailed task breakdown is shown below:`,
      data: {
        type: 'tasks',
        employees: mockEmployees.filter(emp => emp.currentTasks.length > 0)
      }
    };
  };

  const generateEmployeeDetailResponse = (employee: EmployeeStatus) => {
    return {
      content: `**${employee.name} - Detailed Report:**\n\n📧 ${employee.email}\n💼 ${employee.role}\n🔄 Status: ${employee.status.toUpperCase()}\n⏰ Last Activity: ${employee.lastActivity}\n\n**Performance Metrics:**\n✅ Deals Won: ${employee.performance.dealsWon}\n❌ Deals Lost: ${employee.performance.dealsLost}\n⚡ Response Time: ${employee.performance.responseTime}\n⭐ Customer Satisfaction: ${employee.performance.customerSatisfaction}/5.0\n\n**Current Workload:**\n🔥 Active Deals: ${employee.activeDeals}\n💰 Total Revenue: $${employee.totalRevenue.toLocaleString()}\n📋 Current Tasks: ${employee.currentTasks.length}`,
      data: {
        type: 'employee_detail',
        employee: employee
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = processQuery(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        data: response.data,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'busy': return '#ff9800';
      case 'offline': return '#757575';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    return (
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: getStatusColor(status),
          display: 'inline-block',
          mr: 1
        }}
      />
    );
  };

  const renderDataVisualization = (message: Message) => {
    if (!message.data) return null;

    const { type, employees, employee } = message.data;

    switch (type) {
      case 'employee_status':
      case 'performance':
      case 'revenue':
      case 'deals':
        return (
          <Box sx={{ mt: 3 }}>
            <List>
              {employees.map((emp: EmployeeStatus) => (
                <Card key={emp.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: '#7442BF', mr: 2 }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {emp.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(emp.status)}
                          <Typography variant="body2" color="text.secondary">
                            {emp.role} • {emp.status}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {type === 'employee_status' && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<WorkIcon />} 
                          label={`${emp.activeDeals} Active Deals`} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          icon={<ScheduleIcon />} 
                          label={`Last: ${emp.lastActivity}`} 
                          size="small" 
                        />
                      </Box>
                    )}
                    
                    {type === 'performance' && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<CheckIcon />} 
                          label={`${emp.performance.dealsWon} Won`} 
                          size="small" 
                          color="success" 
                        />
                        <Chip 
                          label={`${emp.performance.dealsLost} Lost`} 
                          size="small" 
                          color="error" 
                        />
                        <Chip 
                          icon={<StarIcon />} 
                          label={`${emp.performance.customerSatisfaction}/5.0`} 
                          size="small" 
                          color="warning" 
                        />
                      </Box>
                    )}
                    
                    {type === 'revenue' && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<MoneyIcon />} 
                          label={`$${emp.totalRevenue.toLocaleString()}`} 
                          size="small" 
                          color="success" 
                        />
                        <Chip 
                          icon={<TrendingUpIcon />} 
                          label={`${emp.activeDeals} Active`} 
                          size="small" 
                        />
                      </Box>
                    )}
                    
                    {type === 'deals' && (
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<AssessmentIcon />} 
                          label={`${emp.activeDeals} Active Deals`} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          icon={<MoneyIcon />} 
                          label={`$${emp.totalRevenue.toLocaleString()} Total`} 
                          size="small" 
                          color="success" 
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </List>
          </Box>
        );

      case 'tasks':
        return (
          <Box sx={{ mt: 3 }}>
            {employees.map((emp: EmployeeStatus) => (
              <Card key={emp.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {emp.name} - {emp.currentTasks.length} Tasks
                  </Typography>
                  <List dense>
                    {emp.currentTasks.map((task, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={task}
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              fontSize: '0.9rem' 
                            } 
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Box>
        );

      case 'employee_detail':
        return (
          <Box sx={{ mt: 3 }}>
            <Card sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: '#7442BF', width: 56, height: 56, mr: 2 }}>
                    {employee.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {employee.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getStatusIcon(employee.status)}
                      <Typography variant="body1" color="text.secondary">
                        {employee.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Current Tasks:
                </Typography>
                <List dense>
                  {employee.currentTasks.map((task: string, index: number) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText primary={`• ${task}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Admin Chat Assistant
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Query your team's performance, deals, and internal data
        </Typography>
      </Box>

      {/* Chat Messages */}
      <Paper sx={{ height: '60vh', mb: 3, p: 3, overflow: 'auto', borderRadius: 3 }}>
        {messages.map((message, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '80%',
                  bgcolor: message.role === 'user' ? '#7442BF' : '#f5f5f5',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2
                }}
              >
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {message.content}
                </Typography>
              </Paper>
            </Box>
            {renderDataVisualization(message)}
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                Processing your query...
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Input Area */}
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask me about team performance, employee status, revenue, deals, or specific employees..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            sx={{
              bgcolor: '#7442BF',
              color: 'white',
              '&:hover': { bgcolor: '#5e3399' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminChat; 