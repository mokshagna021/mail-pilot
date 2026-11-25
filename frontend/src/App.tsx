import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentWorkspacePage } from './pages/AgentWorkspacePage';
import { InboxPage } from './pages/InboxPage';
import { ComposerPage } from './pages/ComposerPage';
import { DraftsPage } from './pages/DraftsPage';
import { AgentActivityPage } from './pages/AgentActivityPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0B0F19] text-violet-400 font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading MailPilot Engine...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public SaaS Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage isRegister={false} />} />
          <Route path="/register" element={<AuthPage isRegister={true} />} />

          {/* Protected Application Workspace Pages */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/workspace" element={<ProtectedRoute><AgentWorkspacePage /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/composer" element={<ProtectedRoute><ComposerPage /></ProtectedRoute>} />
          <Route path="/drafts" element={<ProtectedRoute><DraftsPage /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><AgentActivityPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
