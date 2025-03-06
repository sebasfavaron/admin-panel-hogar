import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDonations, useDeleteDonation } from '../hooks/useDonations';
import { Donation, Collaborator } from '../types/models';

interface DonationRow {
  id: string;
  amount: number;
  amount_display: string;
  currency: string;
  payment_method: string;
  date: string;
  Collaborator?: Collaborator;
}

const columns: GridColDef<DonationRow>[] = [
  {
    field: 'amount_display',
    headerName: 'Amount',
    flex: 1,
  },
  { field: 'payment_method', headerName: 'Payment Method', flex: 1 },
  {
    field: 'date',
    headerName: 'Date',
    flex: 1,
    type: 'date',
    valueGetter: ({ value }) => value && new Date(value),
  },
  {
    field: 'collaborator',
    headerName: 'Collaborator',
    flex: 1,
    renderCell: (params) => params.row.Collaborator?.name ?? 'Unknown',
  },
  {
    field: 'collaboratorEmail',
    headerName: 'Email',
    flex: 1,
    renderCell: (params) => params.row.Collaborator?.email ?? 'Unknown',
  },
];

export default function DonationsPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { data: donations, isLoading } = useDonations();
  const deleteDonation = useDeleteDonation();

  const handleDelete = () => {
    if (
      window.confirm('Are you sure you want to delete the selected donations?')
    ) {
      selectedRows.forEach((id) => deleteDonation.mutate(id));
    }
  };

  const rows =
    donations?.map((donation: Donation) => ({
      id: donation.id,
      amount: donation.amount,
      amount_display: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: donation.currency,
      }).format(donation.amount),
      currency: donation.currency,
      payment_method: donation.payment_method,
      date: donation.date.toISOString().split('T')[0],
      collaborator: donation.collaborator,
    })) || [];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant='h4' component='h1'>
          Donations
        </Typography>
        <Box>
          <Button
            variant='contained'
            color='primary'
            href='/donations/new'
            sx={{ mr: 1 }}
          >
            Add New
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDelete}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
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
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[10, 20, 50]}
      />
    </Box>
  );
}
