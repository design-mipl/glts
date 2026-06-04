import { useEffect, useState } from 'react'
import { Grid, Stack } from '@mui/material'
import dayjs from 'dayjs'
import {
  DatePicker,
  Drawer,
  FileUpload,
  FormField,
  Input,
  Textarea,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  emptyInsuranceWorkflow,
  emptyTravelTicketWorkflow,
  isSimpleDocumentRequirement,
  simpleDocumentUploadActionLabel,
  type InsuranceWorkflow,
  type SimpleDocumentRequirementId,
  type TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const d = dayjs(value.trim(), ['DD/MM/YYYY', 'YYYY-MM-DD'], true)
  return d.isValid() ? d.toDate() : null
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

export interface GltsDocumentUploadPayload {
  fileName: string
  travelTicket?: Partial<TravelTicketWorkflow>
  insurance?: Partial<InsuranceWorkflow>
}

interface GltsDocumentUploadDrawerProps {
  open: boolean
  document: ApplicantDocumentItem | null
  onClose: () => void
  onSave: (payload: GltsDocumentUploadPayload) => void
}

export function GltsDocumentUploadDrawer({
  open,
  document,
  onClose,
  onSave,
}: GltsDocumentUploadDrawerProps) {
  const [ticket, setTicket] = useState(emptyTravelTicketWorkflow())
  const [insurance, setInsurance] = useState(emptyInsuranceWorkflow())
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (!open || !document || !isSimpleDocumentRequirement(document.documentId)) return
    if (document.documentId === 'travel-ticket') {
      setTicket({ ...emptyTravelTicketWorkflow(), ...document.travelTicket })
      setFileName(document.travelTicket?.fileName?.trim() ?? '')
    } else {
      setInsurance({ ...emptyInsuranceWorkflow(), ...document.insurance })
      setFileName(document.insurance?.fileName?.trim() ?? '')
    }
  }, [open, document])

  if (!document || !isSimpleDocumentRequirement(document.documentId)) {
    return null
  }

  const docId = document.documentId as SimpleDocumentRequirementId
  const title = simpleDocumentUploadActionLabel(docId)
  const canSave = Boolean(fileName.trim())

  const handleSave = () => {
    if (!canSave) return
    if (docId === 'travel-ticket') {
      onSave({
        fileName: fileName.trim(),
        travelTicket: { ...ticket, fileName: fileName.trim() },
      })
    } else {
      onSave({
        fileName: fileName.trim(),
        insurance: { ...insurance, fileName: fileName.trim() },
      })
    }
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      width={480}
      footer={
        <AdminFullPageFormFooter
          onCancel={onClose}
          onSave={handleSave}
          saveLabel="Save document"
          disabled={!canSave}
        />
      }
    >
      <Stack spacing={2}>
        <FormField label="Document file" required>
          <FileUpload
            dropzoneTitle={`Upload ${document.name.toLowerCase()}`}
            dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024}
            onUpload={files => {
              const file = files[0]
              if (file) setFileName(file.name)
            }}
            helperText={fileName || undefined}
          />
        </FormField>

        {docId === 'travel-ticket' ? (
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Ticket Number" optional>
                <Input
                  fullWidth
                  size="sm"
                  value={ticket.ticketNumber ?? ''}
                  onChange={value => setTicket(prev => ({ ...prev, ticketNumber: value }))}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Airline / Travel Mode" optional>
                <Input
                  fullWidth
                  size="sm"
                  value={ticket.airlineTravelMode ?? ''}
                  onChange={value => setTicket(prev => ({ ...prev, airlineTravelMode: value }))}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Travel Date" optional>
                <DatePicker
                  fullWidth
                  size="sm"
                  value={parseDateString(ticket.travelDate)}
                  onChange={date =>
                    setTicket(prev => ({ ...prev, travelDate: formatDateForStorage(date) }))
                  }
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField label="Remarks" optional>
                <Textarea
                  fullWidth
                  rows={3}
                  value={ticket.remarks ?? ticket.notes ?? ''}
                  onChange={value => setTicket(prev => ({ ...prev, remarks: value }))}
                />
              </FormField>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Policy Number" optional>
                <Input
                  fullWidth
                  size="sm"
                  value={insurance.policyNumber ?? ''}
                  onChange={value => setInsurance(prev => ({ ...prev, policyNumber: value }))}
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Insurance Provider" optional>
                <Input
                  fullWidth
                  size="sm"
                  value={insurance.insuranceProvider ?? ''}
                  onChange={value =>
                    setInsurance(prev => ({ ...prev, insuranceProvider: value }))
                  }
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Valid From" optional>
                <DatePicker
                  fullWidth
                  size="sm"
                  value={parseDateString(insurance.validFrom ?? insurance.travelStartDate)}
                  onChange={date =>
                    setInsurance(prev => ({ ...prev, validFrom: formatDateForStorage(date) }))
                  }
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormField label="Valid To" optional>
                <DatePicker
                  fullWidth
                  size="sm"
                  value={parseDateString(insurance.validTo ?? insurance.travelEndDate)}
                  minDate={parseDateString(insurance.validFrom ?? insurance.travelStartDate) ?? undefined}
                  onChange={date =>
                    setInsurance(prev => ({ ...prev, validTo: formatDateForStorage(date) }))
                  }
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormField label="Remarks" optional>
                <Textarea
                  fullWidth
                  rows={3}
                  value={insurance.remarks ?? insurance.notes ?? ''}
                  onChange={value => setInsurance(prev => ({ ...prev, remarks: value }))}
                />
              </FormField>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Drawer>
  )
}
