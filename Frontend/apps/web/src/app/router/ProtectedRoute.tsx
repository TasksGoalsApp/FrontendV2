import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from '@/features/auth/utils/auth-storage';

export default function ProtectedRoute() {
  // const isAuthenticated = false; // later: replace with real auth check
  const token = getAccessToken();
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}