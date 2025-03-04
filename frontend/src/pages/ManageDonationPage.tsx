import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import DonationForm from '../components/DonationForm';
import { useDonation } from '../hooks/useDonations';

export default function ManageDonationPage() {
  const { id } = useParams();
  const { data: donation, isLoading } = useDonation(id);

  if (isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {id ? 'Edit Donation' : 'Add New Donation'}
      </Typography>
      <DonationForm initialData={donation} />
    </Box>
  );
}
