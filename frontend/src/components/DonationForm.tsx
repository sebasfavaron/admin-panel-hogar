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
import { useCollaborators } from '../hooks/useCollaborators';
import { useCreateDonation, useUpdateDonation } from '../hooks/useDonations';
import { Donation, Collaborator } from '../types/models';

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'PayPal',
  'Other',
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
      setError('Failed to save donation. Please try again.');
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        label='Amount'
        name='amount'
        type='number'
        value={formData.amount}
        onChange={handleTextFieldChange}
        required
        inputProps={{ min: 0, step: 0.01 }}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Currency</InputLabel>
        <Select
          name='currency'
          value={formData.currency}
          label='Currency'
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
        <InputLabel>Payment Method</InputLabel>
        <Select
          name='payment_method'
          value={formData.payment_method}
          label='Payment Method'
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
        <InputLabel>Collaborator</InputLabel>
        <Select
          name='CollaboratorId'
          value={formData.CollaboratorId}
          label='Collaborator'
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

      <TextField
        fullWidth
        label='Date'
        name='date'
        type='date'
        value={formData.date}
        onChange={handleTextFieldChange}
        required
        sx={{ mb: 2 }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={createDonation.isPending || updateDonation.isPending}
        >
          {initialData ? 'Update' : 'Create'} Donation
        </Button>
        <Button variant='outlined' onClick={() => navigate('/donations')}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
