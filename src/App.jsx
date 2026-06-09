import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';

// Auth Pages
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { AssessmentCatalog } from './pages/AssessmentCatalog';
import { AssessmentInterface } from './pages/AssessmentInterface';
import { StudentSubmissions } from './pages/StudentSubmissions';
import { StudentProfile } from './pages/StudentProfile';

// Instructor Pages
import { InstructorDashboard } from './pages/InstructorDashboard';
import { CreateAssessment } from './pages/CreateAssessment';
import { ManageAssessments } from './pages/ManageAssessments';
import { EvaluateSubmissions } from './pages/EvaluateSubmissions';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (role && user.role !== role) {
    const redirects = {
      student: '/student/dashboard',
      instructor: '/instructor/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirects[user.role]} />;
  }

  return children;
};

const StudentLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </div>
);

const InstructorLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </div>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-900">
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </div>
  </div>
);

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to={`/${user.role}/dashboard`} />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={`/${user.role}/dashboard`} />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assessments"
        element={
          <ProtectedRoute role="student">
            <StudentLayout>
              <AssessmentCatalog />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assessment/:id"
        element={
          <ProtectedRoute role="student">
            <StudentLayout>
              <AssessmentInterface />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute role="student">
            <StudentLayout>
              <StudentSubmissions />
            </StudentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <StudentLayout>
              <StudentProfile />
            </StudentLayout>
          </ProtectedRoute>
        }
      />

      {/* Instructor Routes */}
      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute role="instructor">
            <InstructorLayout>
              <InstructorDashboard />
            </InstructorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/create-assessment"
        element={
          <ProtectedRoute role="instructor">
            <InstructorLayout>
              <CreateAssessment />
            </InstructorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/manage-assessments"
        element={
          <ProtectedRoute role="instructor">
            <InstructorLayout>
              <ManageAssessments />
            </InstructorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor/evaluate"
        element={
          <ProtectedRoute role="instructor">
            <InstructorLayout>
              <EvaluateSubmissions />
            </InstructorLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/user-management"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/signin'} />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
