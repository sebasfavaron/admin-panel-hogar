import { Button, Container, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <Container maxWidth='md'>
      <Paper
        sx={{
          p: 4,
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' color='error' gutterBottom>
          Access Denied
        </Typography>
        <Typography variant='body1' paragraph align='center'>
          You don't have permission to access this resource. Please contact your
          administrator if you believe this is an error.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant='outlined' onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button variant='contained' onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
          <Button variant='contained' color='secondary' onClick={logout}>
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
