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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCollaborators } from '../hooks/useCollaborators';
import { useCreateDonation, useUpdateDonation } from '../hooks/useDonations';
import { Donation, Collaborator } from '../types/models';

const PAYMENT_METHODS = [
  'Efectivo',
  'Tarjeta de Crédito',
  'Transferencia Bancaria',
  'PayPal',
  'Otro',
];
const CURRENCIES = ['USD', 'EUR', 'GBP'];

interface DonationFormProps {
  initialData?: Donation;
  onSubmit?: () => void;
}

export default function DonationForm({
  initialData,
  onSubmit,
}: DonationFormProps) {
  const navigate = useNavigate();
  const { data: collaborators } = useCollaborators();
  const createDonation = useCreateDonation();
  const updateDonation = useUpdateDonation();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    payment_method: '',
    CollaboratorId: '',
    date: new Date(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount.toString(),
        currency: initialData.currency,
        payment_method: initialData.payment_method,
        CollaboratorId: initialData.CollaboratorId,
        date: initialData.date,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const donationData = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        payment_method: formData.payment_method,
        CollaboratorId: formData.CollaboratorId,
        date: formData.date,
      };

      if (initialData?.id) {
        await updateDonation.mutateAsync({
          id: initialData.id,
          data: donationData,
        });
      } else {
        await createDonation.mutateAsync(donationData);
      }

      onSubmit?.();
      navigate('/donations');
    } catch {
      setError('Error al guardar la donación. Por favor, inténtalo de nuevo.');
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
        label='Cantidad'
        name='amount'
        type='number'
        value={formData.amount}
        onChange={(e) => {
          const value = e.target.value;
          // Allow empty string or valid numeric format (optional negative sign, digits, optional decimal and digits)
          if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
            setFormData((prev) => ({ ...prev, amount: value }));
          }
        }}
        onKeyDown={(event) => {
          const { key, ctrlKey, metaKey } = event;
          const currentAmount = formData.amount;

          // Allow control keys (e.g., Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X)
          if (ctrlKey || metaKey) {
            return;
          }

          // Allow backspace, delete, tab, and arrow keys
          if (
            ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(
              key
            )
          ) {
            return;
          }

          // Allow digits
          if (/[0-9]/.test(key)) {
            return;
          }

          // Allow a single decimal point
          if (key === '.') {
            if (currentAmount.includes('.')) {
              event.preventDefault(); // Prevent multiple decimal points
            }
            return;
          }

          // Prevent all other keys
          event.preventDefault();
        }}
        required
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Moneda</InputLabel>
        <Select
          name='currency'
          value={formData.currency}
          label='Moneda'
          onChange={handleSelectChange}
          required
        >
          {CURRENCIES.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Método de Pago</InputLabel>
        <Select
          name='payment_method'
          value={formData.payment_method}
          label='Método de Pago'
          onChange={handleSelectChange}
          required
        >
          {PAYMENT_METHODS.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Colaborador</InputLabel>
        <Select
          name='CollaboratorId'
          value={formData.CollaboratorId}
          label='Colaborador'
          onChange={handleSelectChange}
          required
        >
          {collaborators?.map((collaborator: Collaborator) => (
            <MenuItem key={collaborator.id} value={collaborator.id}>
              {collaborator.name} ({collaborator.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DatePicker
        label='Fecha'
        value={formData.date}
        onChange={(newValue) =>
          setFormData((prev) => ({ ...prev, date: newValue || new Date() }))
        }
        format='dd/MM/yyyy'
        sx={{ mb: 2, width: '100%' }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={createDonation.isPending || updateDonation.isPending}
        >
          {initialData ? 'Actualizar' : 'Crear'} Donación
        </Button>
        <Button variant='outlined' onClick={() => navigate('/donations')}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}
