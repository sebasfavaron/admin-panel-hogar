import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import CollaboratorForm from '../components/CollaboratorForm';
import { useCollaborator } from '../hooks/useCollaborators';

export default function ManageCollaboratorPage() {
  const { id } = useParams();
  const { data: collaborator, isLoading } = useCollaborator(id || undefined);

  if (id && isLoading) {
    return <Box sx={{ p: 2 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        {id ? 'Edit Collaborator' : 'Add New Collaborator'}
      </Typography>
      <CollaboratorForm initialData={collaborator || undefined} />
    </Box>
  );
}
