import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import { useAuth } from './contexts/AuthContext';
import Register from './screens/auth/register/Register';
import Login from './screens/auth/login/Login';
import BusinessInsights from './screens/businessInsights/BusinessInsights';
import Billing from './screens/billing/Billing';
import Inbox from './screens/inbox/Inbox';
import Drafts from './screens/drafts/Drafts';
import ProfileSettings from './screens/profile/ProfileSettings';
import MainLayout from './screens/layout/MainLayout';
import ChatScreen from './screens/chat/ChatScreen';
import ChatSalesman from './screens/chat/ChatSalesman';
import ChatLayout from './screens/layout/ChatLayout';
import SalesLayout from './components/SalesLayout';
import SalesDashboard from './screens/sales/SalesDashboard';
import SalesLeads from './screens/sales/SalesLeads';
import SalesDeals from './screens/sales/SalesDeals';
import SalesEarnings from './screens/sales/SalesEarnings';
import SalesInbox from './screens/sales/SalesInbox';
import SalesSettings from './screens/sales/SalesSettings';
import DraftEdit from './screens/sales/DraftEdit';
import MassEmailSender from './screens/tools/MassEmailSender';
import ToolsPlaceholder from './screens/tools/ToolsPlaceholder';
import OutreachTool from './screens/tools/OutreachTool';
import LeadsDealsChat from './screens/sales/LeadsDealsChat';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './screens/admin/AdminDashboard';
import AdminSalesTeam from './screens/admin/AdminSalesTeam';
import AdminLeads from './screens/admin/AdminLeads';
import AdminDeals from './screens/admin/AdminDeals';
import AdminCommissions from './screens/admin/AdminCommissions';
import AdminInbox from './screens/admin/AdminInbox';
import AdminSettings from './screens/admin/AdminSettings';
import AdminChat from './screens/admin/AdminChat';
import './App.css';

// Protected Chat Component for regular users
const ProtectedChat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect salesperson users to their dashboard
  if (isAuthenticated && user?.userType === 'salesperson') {
    return <Navigate to="/sales/dashboard" replace />;
  }
  
  // Redirect admin users to their dashboard
  if (isAuthenticated && user?.userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return (
    <ChatLayout>
      <ChatScreen isAuthenticated={isAuthenticated} />
    </ChatLayout>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedUserTypes?: ('test' | 'salesperson' | 'admin')[] }> = ({ 
  children, 
  allowedUserTypes = ['test'] 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedUserTypes && user?.userType && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RequestProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Regular user routes */}
              <Route path="/" element={<ProtectedChat />} />
              
              {/* Chat with Salesman Route */}
              <Route 
                path="/chat-salesman" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><ChatSalesman /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Inbox Route */}
              <Route 
                path="/inbox" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Inbox /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Drafts Route */}
              <Route 
                path="/drafts" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Drafts /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile Settings Route */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><ProfileSettings /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/support" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Inbox /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-insights" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><BusinessInsights /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Billing /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Sales routes - New commission-first sales architecture */}
              <Route 
                path="/sales/dashboard" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesDashboard /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/leads" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesLeads /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/deals" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesDeals /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/earnings" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesEarnings /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/inbox" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesInbox /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/settings" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesSettings /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/leads/:leadId/drafts/:draftId" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><DraftEdit /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/outreach/email-sender" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><MassEmailSender /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/tools" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><ToolsPlaceholder /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/tools/outreach" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><OutreachTool /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/outreach/tool" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><OutreachTool /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/leads/deals-chat" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><LeadsDealsChat /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminDashboard /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sales-team" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminSalesTeam /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/leads" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminLeads /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/deals" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminDeals /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/commissions" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminCommissions /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/inbox" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminInbox /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminSettings /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/chat" 
                element={
                  <ProtectedRoute allowedUserTypes={['admin']}>
                    <AdminLayout><AdminChat /></AdminLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </RequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
