import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '@/shared/pages/AuthLayout';
import AppLayout from '@/shared/pages/AppLayout';
import HomePage from '@/features/home/Home'
import TasksPage from '@/features/tasks/pages/TaskPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
       {/* PUBLIC ROUTES */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/tasks" element={<TasksPage />} />
          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}