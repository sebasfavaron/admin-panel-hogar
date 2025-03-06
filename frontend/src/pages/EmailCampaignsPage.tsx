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
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteEmailCampaign.mutate(id);
    }
  };

  const columns: GridColDef<EmailCampaignRow>[] = [
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value} placement='top'>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
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
      headerName: 'Recipients',
      width: 100,
      type: 'number',
    },
    {
      field: 'sent_at',
      headerName: 'Sent At',
      width: 180,
      renderCell: (params) => {
        if (!params.row.sent_at) return '-';
        return new Date(params.row.sent_at).toLocaleString();
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
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
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label='Edit'
          onClick={() => navigate(`/email-campaigns/${params.id}`)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
        <GridActionsCellItem
          icon={<SendIcon />}
          label='Send'
          onClick={() => navigate(`/email-campaigns/${params.id}`)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => handleDelete(params.id as string)}
          showInMenu={false}
          disabled={params.row.status === 'sent'}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='h4' component='h1'>
          Email Campaigns
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => navigate('/email-campaigns/new')}
        >
          Create Campaign
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
