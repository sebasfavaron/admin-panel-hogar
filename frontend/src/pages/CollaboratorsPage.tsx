import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  useCollaborators,
  useDeleteCollaborator,
} from '../hooks/useCollaborators';
import { Collaborator } from '../types/models';

interface CollaboratorRow extends Omit<Collaborator, 'id'> {
  id: string;
}

const columns: GridColDef<CollaboratorRow>[] = [
  { field: 'name', headerName: 'Nombre', flex: 1 },
  { field: 'email', headerName: 'Correo', flex: 1 },
  { field: 'phone', headerName: 'Teléfono', flex: 1 },
  {
    field: 'help_type',
    headerName: 'Tipo de Ayuda',
    flex: 1,
    renderCell: (params) =>
      params.row.help_type.charAt(0).toUpperCase() +
      params.row.help_type.slice(1),
  },
  {
    field: 'last_contact',
    headerName: 'Último Contacto',
    flex: 1,
    renderCell: (params) => {
      if (!params.row.last_contact) return null;
      return new Date(params.row.last_contact).toLocaleDateString();
    },
  },
];

export default function CollaboratorsPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { data: collaborators, isLoading } = useCollaborators();
  const deleteCollaborator = useDeleteCollaborator();

  const handleDelete = () => {
    if (
      window.confirm(
        '¿Estás seguro de que deseas eliminar los colaboradores seleccionados?'
      )
    ) {
      selectedRows.forEach((id) => deleteCollaborator.mutate(id));
    }
  };

  // Transform collaborators into rows without duplicate id
  const rows =
    collaborators?.map((collaborator: Collaborator) => ({
      name: collaborator.name,
      email: collaborator.email,
      phone: collaborator.phone,
      help_type: collaborator.help_type,
      last_contact: collaborator.last_contact,
      address: collaborator.address,
      createdAt: collaborator.createdAt,
      updatedAt: collaborator.updatedAt,
      id: collaborator.id, // Keep id at the end to avoid duplicate property warning
    })) || [];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant='h4' component='h1'>
          Colaboradores
        </Typography>
        <Box>
          <Button
            variant='contained'
            color='primary'
            href='/collaborators/new'
            sx={{ mr: 1 }}
          >
            Agregar Nuevo
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
          >
            Eliminar Seleccionados
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as string[]);
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </Box>
  );
}
