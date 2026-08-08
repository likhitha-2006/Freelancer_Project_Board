import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProjectsList from '../pages/ProjectsList';
import ProjectDetails from '../pages/ProjectDetails';
import PostProject from '../pages/PostProject';
import EditProject from '../pages/EditProject';
import FreelancerDashboard from '../pages/FreelancerDashboard';
import ClientDashboard from '../pages/ClientDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Profile from '../pages/Profile';
import ChatPage from '../pages/ChatPage';
import DisputesPage from '../pages/DisputesPage';
import IdentityVerification from '../pages/IdentityVerification';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      
      <Route
        path="/post-project"
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <PostProject />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-project/:id"
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <EditProject />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/freelancer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client-dashboard"
        element={
          <ProtectedRoute allowedRoles={['client', 'admin']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
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
      <Route path="/profile/:id" element={<Profile />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/disputes"
        element={
          <ProtectedRoute>
            <DisputesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/verify-identity"
        element={
          <ProtectedRoute>
            <IdentityVerification />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
