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
      <DialogTitle>Filtrar Destinatarios</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Tipo de Ayuda</InputLabel>
          <Select
            value={filters.helpType || ''}
            label='Tipo de Ayuda'
            onChange={(e) => handleChange('helpType', e.target.value)}
          >
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='financial'>Económica</MenuItem>
            <MenuItem value='physical'>Física</MenuItem>
            <MenuItem value='both'>Ambas</MenuItem>
          </Select>
        </FormControl>

        {preview && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='subtitle1' gutterBottom>
              {preview.count} destinatario(s) coinciden con estos filtros
            </Typography>
            {preview.sample.length > 0 && (
              <>
                <Typography variant='subtitle2' gutterBottom>
                  Ejemplos de destinatarios:
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
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={() => onApply(filters)}
          variant='contained'
          disabled={preview?.count === 0}
        >
          Aplicar Filtros
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
            Destinatarios: {recipientCount}
          </Typography>
          {recipientSample.length > 0 && (
            <>
              <Typography variant='subtitle2' gutterBottom>
                Ejemplos de destinatarios:
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
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant='contained'
          color='primary'
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Confirmar'}
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
      <DialogTitle>Vista Previa del Email</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          Asunto: {subject}
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
        <Button onClick={onClose}>Cerrar</Button>
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
        setSuccess('Campaña actualizada con éxito');
      } else {
        await createCampaign.mutateAsync({ ...formData, status: 'draft' });
        setSuccess('Campaña creada con éxito');
      }

      setTimeout(() => {
        onSubmit?.();
        navigate('/email-campaigns');
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar la campaña'
      );
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
        title: 'Confirmar Envío',
        message: `¿Estás seguro de que deseas enviar esta campaña a ${preview.count} destinatarios?`,
        onConfirm: async () => {
          try {
            await sendCampaign.mutateAsync({
              id: initialData.id,
              filters: currentFilters,
            });
            setSuccess(
              'El envío de la campaña ha comenzado. Puedes comprobar su estado en la lista de campañas.'
            );
            setShowConfirmDialog(false);
            setTimeout(() => navigate('/email-campaigns'), 1500);
          } catch (err) {
            setError(
              err instanceof Error ? err.message : 'Error al enviar la campaña'
            );
          }
        },
      });
      setShowConfirmDialog(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al previsualizar los destinatarios'
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
        label='Asunto'
        name='subject'
        value={formData.subject}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label='Contenido'
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
            'Actualizar'
          ) : (
            'Crear'
          )}{' '}
          Campaña
        </Button>

        {initialData?.id && (
          <>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => setShowFilterDialog(true)}
            >
              Configurar Filtros
            </Button>
            <Button
              variant='outlined'
              color='info'
              onClick={() => setShowPreviewDialog(true)}
            >
              Vista Previa
            </Button>
            <Button
              variant='contained'
              color='success'
              onClick={handleSendNow}
              disabled={isLoading || initialData.status === 'sent'}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Enviar Ahora'}
            </Button>
          </>
        )}

        <Button variant='outlined' onClick={() => navigate('/email-campaigns')}>
          Cancelar
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
