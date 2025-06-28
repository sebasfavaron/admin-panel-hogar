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
          Acceso Denegado
        </Typography>
        <Typography variant='body1' paragraph align='center'>
          No tienes permiso para acceder a este recurso. Por favor, contacta a
          tu administrador si crees que esto es un error.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant='outlined' onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Button variant='contained' onClick={() => navigate('/')}>
            Ir al Panel
          </Button>
          <Button variant='contained' color='secondary' onClick={logout}>
            Cerrar Sesión
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
