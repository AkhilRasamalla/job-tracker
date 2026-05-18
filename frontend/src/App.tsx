import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, JobsPage, DashboardPage } from './pages';
import { ProtectedRoute, Navbar } from './components';
import { useAuthStore } from './store';
import { authService } from './services';
import './App.css';

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    initialize();

    const verifyUser = async () => {
      const token = localStorage.getItem('job-tracker-token');
      if (token) {
        try {
          const user = await authService.getMe();
          setAuth(user, token);
        } catch (error) {
          console.error('[auth] Failed to verify session:', error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    verifyUser();
  }, [initialize, setAuth, logout, setLoading]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

