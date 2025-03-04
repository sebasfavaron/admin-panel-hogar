import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Typography,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import type { HelpType } from '../types/models';
import {
  useCreateEmailCampaign,
  useUpdateEmailCampaign,
  useSendEmailCampaign,
  usePreviewRecipients,
} from '../hooks/useEmailCampaigns';

interface CampaignFilter {
  helpType?: HelpType;
  lastContactBefore?: Date;
  lastContactAfter?: Date;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: CampaignFilter) => void;
}

function FilterDialog({ open, onClose, onApply }: FilterDialogProps) {
  const [filters, setFilters] = useState<CampaignFilter>({});
  const previewRecipients = usePreviewRecipients();
  const [preview, setPreview] = useState<{
    count: number;
    sample: Array<{ name: string; email: string }>;
  } | null>(null);

  const handleChange = async (field: keyof CampaignFilter, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    try {
      const result = await previewRecipients.mutateAsync(newFilters);
      setPreview(result);
    } catch (error) {
      console.error('Failed to preview recipients:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Filter Recipients</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Help Type</InputLabel>
          <Select
            value={filters.helpType || ''}
            label='Help Type'
            onChange={(e) => handleChange('helpType', e.target.value)}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='financial'>Financial</MenuItem>
            <MenuItem value='physical'>Physical</MenuItem>
            <MenuItem value='both'>Both</MenuItem>
          </Select>
        </FormControl>

        {preview && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='subtitle1' gutterBottom>
              {preview.count} recipient(s) match these filters
            </Typography>
            {preview.sample.length > 0 && (
              <>
                <Typography variant='subtitle2' gutterBottom>
                  Sample recipients:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {preview.sample.map((recipient, index) => (
                    <Typography
                      key={index}
                      variant='body2'
                      color='text.secondary'
                    >
                      {recipient.name} ({recipient.email})
                    </Typography>
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => onApply(filters)}
          variant='contained'
          disabled={preview?.count === 0}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  recipientCount: number;
  recipientSample: Array<{ name: string; email: string }>;
  loading?: boolean;
}

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  recipientCount,
  recipientSample,
  loading,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
        <Box sx={{ mt: 2 }}>
          <Typography variant='subtitle1' gutterBottom>
            Recipients: {recipientCount}
          </Typography>
          {recipientSample.length > 0 && (
            <>
              <Typography variant='subtitle2' gutterBottom>
                Sample recipients:
              </Typography>
              <List dense>
                {recipientSample.map((recipient, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={recipient.name}
                      secondary={recipient.email}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='primary'
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  subject: string;
  body: string;
}

function PreviewDialog({ open, onClose, subject, body }: PreviewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Email Preview</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          Subject: {subject}
        </Typography>
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 1,
            backgroundColor: '#fff',
          }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

interface EmailCampaignFormProps {
  initialData?: any;
  onSubmit?: () => void;
}

export default function EmailCampaignForm({
  initialData,
  onSubmit,
}: EmailCampaignFormProps) {
  const navigate = useNavigate();
  const createCampaign = useCreateEmailCampaign();
  const updateCampaign = useUpdateEmailCampaign();
  const sendCampaign = useSendEmailCampaign();
  const previewRecipients = usePreviewRecipients();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CampaignFilter>({});
  const [recipientPreview, setRecipientPreview] = useState<{
    count: number;
    sample: Array<{ name: string; email: string }>;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [formData, setFormData] = useState({
    subject: initialData?.subject || '',
    body: initialData?.body || '',
  });

  const isLoading =
    createCampaign.isPending ||
    updateCampaign.isPending ||
    sendCampaign.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (initialData?.id) {
        await updateCampaign.mutateAsync({
          id: initialData.id,
          data: formData,
        });
        setSuccess('Campaign updated successfully');
      } else {
        await createCampaign.mutateAsync({ ...formData, status: 'draft' });
        setSuccess('Campaign created successfully');
      }

      setTimeout(() => {
        onSubmit?.();
        navigate('/email-campaigns');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save campaign');
    }
  };

  const handleSendNow = async () => {
    if (!initialData?.id) return;
    setError(null);
    setSuccess(null);

    try {
      const preview = await previewRecipients.mutateAsync(currentFilters);
      setRecipientPreview(preview);

      setConfirmDialogConfig({
        title: 'Confirm Send',
        message: `Are you sure you want to send this campaign to ${preview.count} recipients?`,
        onConfirm: async () => {
          try {
            await sendCampaign.mutateAsync({
              id: initialData.id,
              filters: currentFilters,
            });
            setSuccess(
              `Campaign sent successfully to ${preview.count} recipients`
            );
            setShowConfirmDialog(false);
            setTimeout(() => navigate('/email-campaigns'), 1500);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'Failed to send campaign'
            );
          }
        },
      });
      setShowConfirmDialog(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to preview recipients'
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}
    >
      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          message={success}
        />
      )}

      <TextField
        fullWidth
        label='Subject'
        name='subject'
        value={formData.subject}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Body'
        name='body'
        value={formData.body}
        onChange={handleChange}
        required
        multiline
        rows={10}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : initialData ? (
            'Update'
          ) : (
            'Create'
          )}{' '}
          Campaign
        </Button>

        {initialData?.id && (
          <>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => setShowFilterDialog(true)}
            >
              Set Filters
            </Button>
            <Button
              variant='outlined'
              color='info'
              onClick={() => setShowPreviewDialog(true)}
            >
              Preview
            </Button>
            <Button
              variant='contained'
              color='success'
              onClick={handleSendNow}
              disabled={isLoading || initialData.status === 'sent'}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send Now'}
            </Button>
          </>
        )}

        <Button variant='outlined' onClick={() => navigate('/email-campaigns')}>
          Cancel
        </Button>
      </Box>

      <FilterDialog
        open={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApply={(filters) => {
          setCurrentFilters(filters);
          setShowFilterDialog(false);
        }}
      />

      <PreviewDialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        subject={formData.subject}
        body={formData.body}
      />

      {confirmDialogConfig && recipientPreview && (
        <ConfirmationDialog
          open={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={confirmDialogConfig.onConfirm}
          title={confirmDialogConfig.title}
          message={confirmDialogConfig.message}
          recipientCount={recipientPreview.count}
          recipientSample={recipientPreview.sample}
          loading={sendCampaign.isPending}
        />
      )}
    </Box>
  );
}
