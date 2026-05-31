import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';
import SavingsGoals from './pages/SavingsGoals';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Feedback from './pages/Feedback';
import Chatbot from './pages/Chatbot';
import DashboardLayout from './components/DashboardLayout';
import { CurrencyProvider } from './context/CurrencyContext';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // If user has a saved preference or if system prefers dark mode and no preference is set
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes wrapped in DashboardLayout */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <DashboardLayout>
                <Transactions />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/wallet" element={
            <PrivateRoute>
              <DashboardLayout>
                <Wallet />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/savings-goals" element={
            <PrivateRoute>
              <DashboardLayout>
                <SavingsGoals />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/feedback" element={
            <PrivateRoute>
              <DashboardLayout>
                <Feedback />
              </DashboardLayout>
            </PrivateRoute>
          } />
          <Route path="/messages" element={
            <PrivateRoute>
              <DashboardLayout>
                <Chatbot />
              </DashboardLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;

