import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import EmailCampaignForm from '../components/EmailCampaignForm';
import { useEmailCampaign } from '../hooks/useEmailCampaigns';

export default function ManageEmailCampaignPage() {
  const { id } = useParams();
  const { data: campaign, isLoading } = useEmailCampaign(id);

  if (id && isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {id ? 'Edit Campaign' : 'Create New Campaign'}
      </Typography>
      <EmailCampaignForm initialData={campaign} />
    </Box>
  );
}
