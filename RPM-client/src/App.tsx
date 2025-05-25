import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import Register from './screens/auth/register/Register';
import Login from './screens/auth/login/Login';
import Dashboard from './screens/dashboard/Dashboard';
import VoiceInput from './screens/voiceInput/VoiceInput';
import BusinessInsights from './screens/businessInsights/BusinessInsights';
import PersonalizedProducts from './screens/personalizedProducts/PersonalizedProducts';
import MainLayout from './screens/layout/MainLayout';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/voice-input" element={<MainLayout><VoiceInput /></MainLayout>} />
            <Route path="/business-insights" element={<MainLayout><BusinessInsights /></MainLayout>} />
            <Route path="/personalized-products" element={<MainLayout><PersonalizedProducts /></MainLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
