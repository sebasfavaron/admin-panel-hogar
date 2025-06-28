import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Chip, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import {
  useEmailCampaigns,
  useDeleteEmailCampaign,
} from '../hooks/useEmailCampaigns';
import type { EmailCampaign } from '../types/models';

interface EmailCampaignRow extends EmailCampaign {
  id: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'default';
    case 'sent':
      return 'success';
    default:
      return 'default';
  }
};

export default function EmailCampaignsPage() {
  const navigate = useNavigate();
  const { data: campaigns = [], isLoading } = useEmailCampaigns();
  const deleteEmailCampaign = useDeleteEmailCampaign();

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
      deleteEmailCampaign.mutate(id);
    }
  };

  const columns: GridColDef<EmailCampaignRow>[] = [
    {
      field: 'subject',
      headerName: 'Asunto',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} placement='top'>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={
            params.row.status.charAt(0).toUpperCase() +
            params.row.status.slice(1)
          }
          color={getStatusColor(params.row.status)}
          size='small'
        />
      ),
    },
    {
      field: 'recipient_count',
      headerName: 'Destinatarios',
      width: 100,
      type: 'number',
    },
    {
      field: 'sent_at',
      headerName: 'Enviado',
      width: 180,
      renderCell: (params) => {
        if (!params.row.sent_at) return '-';
        return new Date(params.row.sent_at).toLocaleString();
      },
    },
    {
      field: 'createdAt',
      headerName: 'Creado',
      width: 180,
      renderCell: (params) => {
        const date = params.row.createdAt
          ? new Date(params.row.createdAt)
          : null;
        return date ? date.toLocaleString() : '-';
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Editar'
          onClick={() => navigate(`/email-campaigns/${params.id}`)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
        <GridActionsCellItem
          icon={<SendIcon />}
          label='Enviar'
          onClick={() => navigate(`/email-campaigns/${params.id}`)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Eliminar'
          onClick={() => handleDelete(params.id as string)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant='h4' component='h1'>
          Campañas de Email
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/email-campaigns/new')}
        >
          Crear Campaña
        </Button>
      </Box>

      <DataGrid
        rows={campaigns}
        columns={columns}
        loading={isLoading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
