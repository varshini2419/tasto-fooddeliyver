import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboards if they try to access unauthorized pages
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'delivery_boy') return <Navigate to="/delivery" replace />;
    return <Navigate to="/restaurants" replace />;
  }

  return <Outlet />;
};
