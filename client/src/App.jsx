import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRide from './pages/CreateRide';
import SearchRides from './pages/SearchRides';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import ForgotPassword from './pages/ForgotPassword';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import RecycleBin from './pages/admin/RecycleBin';
import UserDetails from './pages/admin/UserDetails';
import RideManagement from './pages/admin/RideManagement';



// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Main App Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/rides" element={<SearchRides />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-ride" 
              element={
                <ProtectedRoute>
                  <CreateRide />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-rides" 
              element={
                <ProtectedRoute>
                  <MyRides />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Admin Routes - Separate Layout */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="recycle-bin" element={<RecycleBin />} />
              <Route path="rides-management" element={<RideManagement />} />

              <Route path="rides" element={<SearchRides />} />
              <Route path="create-ride" element={<CreateRide />} />
              <Route path="my-rides" element={<MyRides />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
