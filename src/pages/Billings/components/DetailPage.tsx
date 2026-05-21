import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Download, MoreVertical, Pencil, Printer } from 'lucide-react'
import {
  BackButton,
  Breadcrumb,
  Button,
  IconButton,
  ConfirmDialog,
  useToast,
} from '@/design-system/components'
import {
  BillingDetailSections,
  BillingModal,
} from '@/design-system/UIComponents/Templates/BillingTemplate'
import { useBillingData } from '../hooks/useBillingData'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { getInvoiceById } = useBillingData()
  const invoice = id ? getInvoiceById(id) : undefined

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!invoice) {
    return (
      <Box>
        <BackButton href="/billings" />
        <Typography variant="h2" sx={{ mt: 2 }}>
          Invoice not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'flex-start', lg: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <BackButton href="/billings" />
          <Breadcrumb
            items={[
              { label: 'Billings', href: '/billings' },
              { label: invoice.invoiceNo },
            ]}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="secondary"
            size="sm"
            startIcon={<Download size={16} strokeWidth={1.75} />}
            onClick={() =>
              showToast({ title: 'Download', description: 'Invoice PDF generated (demo).', variant: 'success' })
            }
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="sm"
            startIcon={<Printer size={16} strokeWidth={1.75} />}
            onClick={() =>
              showToast({ title: 'Print', description: 'Opening print dialog (demo).', variant: 'info' })
            }
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="sm"
            startIcon={<Pencil size={16} strokeWidth={1.75} />}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </Button>
          <IconButton
            size="sm"
            onClick={() => setDeleteOpen(true)}
            tooltip="More actions"
            icon={<MoreVertical size={16} strokeWidth={1.75} />}
          />
        </Box>
      </Box>

      <BillingDetailSections invoice={invoice} />

      <BillingModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit invoice"
        subtitle="Update invoice details"
        initialData={{
          invoiceNo: invoice.invoiceNo,
          invoiceDate: invoice.invoiceDate,
          dueDate: invoice.dueDate,
          client: invoice.client,
          project: invoice.project,
          amount: invoice.amount,
          tds: invoice.tds,
          netReceivable: invoice.netReceivable,
        }}
        onSave={() =>
          showToast({ title: 'Saved', description: 'Invoice updated successfully.', variant: 'success' })
        }
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          setDeleteOpen(false)
          showToast({ title: 'Deleted', description: 'Invoice removed (demo).', variant: 'success' })
          navigate('/billings')
        }}
        title="Delete invoice"
        description={`Are you sure you want to delete ${invoice.invoiceNo}?`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </Box>
  )
}
