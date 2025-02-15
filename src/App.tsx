import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReportDisaster from './pages/ReportDisaster';
import DisasterMap from './pages/DisasterMap';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VictimDashboard from './pages/VictimDashboard';
import ManagementDashboard from './pages/ManagementDashboard';
import VolunteerRegistration from './pages/VolunteerRegistration';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role: string }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        }>
          <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <main className="flex-grow bg-white dark:bg-gray-900">
              <Routes>
                <Route path="/" element={<HomePage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
                <Route path="/report" element={<ReportDisaster />} />
                <Route path="/map" element={<DisasterMap />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
                <Route 
                  path="/volunteer-dashboard" 
                  element={
                    <ProtectedRoute role="volunteer">
                      <VolunteerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/victim-dashboard" 
                  element={
                    <ProtectedRoute role="victim">
                      <VictimDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/management-dashboard" 
                  element={
                    <ProtectedRoute role="management">
                      <ManagementDashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* Add catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;