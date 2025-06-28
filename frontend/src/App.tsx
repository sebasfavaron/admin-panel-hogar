import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ManageCollaboratorPage from './pages/ManageCollaboratorPage';
import DonationsPage from './pages/DonationsPage';
import ManageDonationPage from './pages/ManageDonationPage';
import EmailCampaignsPage from './pages/EmailCampaignsPage';
import ManageEmailCampaignPage from './pages/ManageEmailCampaignPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/unauthorized' element={<UnauthorizedPage />} />

                {/* Protected routes - accessible to both admin and user */}
                <Route
                  element={<ProtectedRoute />}
                >
                  <Route path='/' element={<MainLayout />}>
                    <Route
                      index
                      element={<Navigate to='/collaborators' replace />}
                    />
                    <Route path='collaborators'>
                      <Route index element={<CollaboratorsPage />} />
                      <Route path='new' element={<ManageCollaboratorPage />} />
                      <Route path=':id' element={<ManageCollaboratorPage />} />
                    </Route>
                    <Route path='donations'>
                      <Route index element={<DonationsPage />} />
                      <Route path='new' element={<ManageDonationPage />} />
                      <Route path=':id' element={<ManageDonationPage />} />
                    </Route>
                  </Route>
                </Route>

                {/* Admin-only routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path='/' element={<MainLayout />}>
                    <Route path='email-campaigns'>
                      <Route index element={<EmailCampaignsPage />} />
                      <Route path='new' element={<ManageEmailCampaignPage />} />
                      <Route path=':id' element={<ManageEmailCampaignPage />} />
                    </Route>
                  </Route>
                </Route>

                {/* Catch all */}
                <Route path='*' element={<Navigate to='/' replace />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
