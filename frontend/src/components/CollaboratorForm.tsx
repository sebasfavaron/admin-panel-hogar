import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import {
  useCreateCollaborator,
  useUpdateCollaborator,
} from '../hooks/useCollaborators';
import { Collaborator } from '../types/models';

const HELP_TYPES = ['financial', 'physical', 'both'] as const;
const HELP_TYPES_SPANISH = {
  financial: 'Económica',
  physical: 'Física',
  both: 'Ambas',
};

interface CollaboratorFormProps {
  initialData?: Collaborator;
  onSubmit?: () => void;
}

export default function CollaboratorForm({
  initialData,
  onSubmit,
}: CollaboratorFormProps) {
  const navigate = useNavigate();
  const createCollaborator = useCreateCollaborator();
  const updateCollaborator = useUpdateCollaborator();
  const [error, setError] = useState<string | null>(null);

  const initialValues = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    help_type: initialData?.help_type || HELP_TYPES[0],
    last_contact: initialData?.last_contact || new Date(),
    address: {
      street: initialData?.address?.street || '',
      city: initialData?.address?.city || '',
      state: initialData?.address?.state || '',
      country: initialData?.address?.country || '',
      zipCode: initialData?.address?.zipCode || '',
    },
  };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        help_type: initialData.help_type,
        last_contact: initialData.last_contact || new Date(),
        address: {
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          country: initialData.address?.country || '',
          zipCode: initialData.address?.zipCode || '',
        },
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (initialData?.id) {
        await updateCollaborator.mutateAsync({
          id: initialData.id,
          data: formData,
        });
      } else {
        await createCollaborator.mutateAsync(formData);
      }

      onSubmit?.();
      navigate('/collaborators');
    } catch {
      setError(
        'Error al guardar el colaborador. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}
    >
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label='Nombre'
        name='name'
        value={formData.name}
        onChange={handleTextFieldChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Correo Electrónico'
        name='email'
        type='email'
        value={formData.email}
        onChange={handleTextFieldChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Teléfono'
        name='phone'
        value={formData.phone}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tipo de Ayuda</InputLabel>
        <Select
          name='help_type'
          value={formData.help_type}
          label='Tipo de Ayuda'
          onChange={handleSelectChange}
          required
        >
          {HELP_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {HELP_TYPES_SPANISH[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant='h6' sx={{ mt: 3, mb: 2 }}>
        Dirección
      </Typography>

      <TextField
        fullWidth
        label='Calle'
        name='address.street'
        value={formData.address.street}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Ciudad'
        name='address.city'
        value={formData.address.city}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Estado/Provincia'
        name='address.state'
        value={formData.address.state}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='País'
        name='address.country'
        value={formData.address.country}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Código Postal'
        name='address.zipCode'
        value={formData.address.zipCode}
        onChange={handleTextFieldChange}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={
            createCollaborator.isPending || updateCollaborator.isPending
          }
        >
          {initialData ? 'Actualizar' : 'Crear'} Colaborador
        </Button>
        <Button variant='outlined' onClick={() => navigate('/collaborators')}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
