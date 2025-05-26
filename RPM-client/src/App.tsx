import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Register from './screens/auth/register/Register';
import Login from './screens/auth/login/Login';
import Dashboard from './screens/dashboard/Dashboard';
import ContactSalesman from './screens/contactSalesman/ContactSalesman';
import BusinessInsights from './screens/businessInsights/BusinessInsights';
import PersonalizedProducts from './screens/personalizedProducts/PersonalizedProducts';
import MainLayout from './screens/layout/MainLayout';
import ChatScreen from './screens/chat/ChatScreen';
import ChatLayout from './screens/layout/ChatLayout';

// Protected Chat Component
const ProtectedChat: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <ChatLayout>
      <ChatScreen isAuthenticated={isAuthenticated} />
    </ChatLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProtectedChat />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ChatLayout><Dashboard /></ChatLayout>} />
            <Route path="/contact-salesman" element={<ChatLayout><ContactSalesman /></ChatLayout>} />
            <Route path="/business-insights" element={<ChatLayout><BusinessInsights /></ChatLayout>} />
            <Route path="/personalized-products" element={<ChatLayout><PersonalizedProducts /></ChatLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
