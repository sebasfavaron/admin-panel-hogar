import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  requiredRole?: string[];
}

export default function ProtectedRoute({
  requiredRole = ['admin', 'user'],
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // Check if user has required role
  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  // If all checks pass, render the child routes
  return <Outlet />;
}
