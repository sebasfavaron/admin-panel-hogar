import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import MainLayout from './layouts/MainLayout';
import CollaboratorsPage from './pages/CollaboratorsPage';
import ManageCollaboratorPage from './pages/ManageCollaboratorPage';
import DonationsPage from './pages/DonationsPage';
import ManageDonationPage from './pages/ManageDonationPage';
import EmailCampaignsPage from './pages/EmailCampaignsPage';
import ManageEmailCampaignPage from './pages/ManageEmailCampaignPage';

const queryClient = new QueryClient();

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
            <Routes>
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
                <Route path='email-campaigns'>
                  <Route index element={<EmailCampaignsPage />} />
                  <Route path='new' element={<ManageEmailCampaignPage />} />
                  <Route path=':id' element={<ManageEmailCampaignPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
