import { useEffect, useMemo, useState } from 'react'
import { Grid, Stack } from '@mui/material'
import dayjs from 'dayjs'
import {
  Button,
  DatePicker,
  FileUpload,
  FormField,
  Input,
  Modal,
  Select,
  Textarea,
} from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  emptyInsuranceWorkflow,
  emptyTravelTicketWorkflow,
  isSimpleDocumentRequirement,
  resolveHandlingMode,
  simpleDocumentUploadActionLabel,
  type InsuranceWorkflow,
  type SimpleDocumentRequirementId,
  type TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  isValidGltsArrangementAmount,
  listGltsDocumentUploadVendors,
  resolveGltsDocumentVendorName,
} from '../../utils/gltsDocumentUploadVendorOptions'

function parseDateString(value: string | undefined): Date | null {
  if (!value?.trim()) return null
  const d = dayjs(value.trim(), ['DD/MM/YYYY', 'YYYY-MM-DD'], true)
  return d.isValid() ? d.toDate() : null
}

function formatDateForStorage(date: Date | null): string {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY')
}

function normalizeAmountInput(value: string): string {
  return value.replace(/[^\d.]/g, '')
}

function resolveExistingFileName(document: ApplicantDocumentItem): string {
  if (document.documentId === 'travel-ticket') {
    return document.travelTicket?.fileName?.trim() ?? ''
  }
  if (document.documentId === 'insurance') {
    return document.insurance?.fileName?.trim() ?? ''
  }
  return document.uploadedFileName?.trim() ?? ''
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

  const isSimple =
    Boolean(document) && isSimpleDocumentRequirement(document!.documentId)
  const docId = isSimple ? (document!.documentId as SimpleDocumentRequirementId) : null
  const requiresGltsArrangement =
    Boolean(document) &&
    isSimple &&
    resolveHandlingMode(document!) === 'arrange_by_glts'

  useEffect(() => {
    if (!open || !document) return
    setFileName(resolveExistingFileName(document))
    if (!isSimpleDocumentRequirement(document.documentId)) return
    if (document.documentId === 'travel-ticket') {
      setTicket({ ...emptyTravelTicketWorkflow(), ...document.travelTicket })
    } else {
      setInsurance({ ...emptyInsuranceWorkflow(), ...document.insurance })
    }
  }, [open, document])

  const vendorOptions = useMemo(
    () => (docId && requiresGltsArrangement ? listGltsDocumentUploadVendors(docId) : []),
    [docId, requiresGltsArrangement],
  )

  if (!document) {
    return null
  }

  const title = docId
    ? document.status === 'rejected' || document.status === 'needs_review'
      ? `Re-upload ${document.name}`
      : simpleDocumentUploadActionLabel(docId)
    : document.status === 'rejected' || document.status === 'needs_review'
      ? `Re-upload ${document.name}`
      : `Upload ${document.name}`

  const arrangementAmount = docId === 'travel-ticket' ? ticket.arrangementAmount : insurance.arrangementAmount
  const vendorId = docId === 'travel-ticket' ? ticket.vendorId : insurance.vendorId
  const amountValid = !requiresGltsArrangement || isValidGltsArrangementAmount(arrangementAmount)
  const vendorValid = !requiresGltsArrangement || Boolean(vendorId?.trim())
  const canSave = Boolean(fileName.trim()) && amountValid && vendorValid

  const handleVendorChange = (nextVendorId: string | number) => {
    const id = String(nextVendorId)
    const vendorName = resolveGltsDocumentVendorName(id)
    if (docId === 'travel-ticket') {
      setTicket(prev => ({ ...prev, vendorId: id, vendorName }))
      return
    }
    setInsurance(prev => ({ ...prev, vendorId: id, vendorName }))
  }

  const handleAmountChange = (value: string) => {
    const normalized = normalizeAmountInput(value)
    if (docId === 'travel-ticket') {
      setTicket(prev => ({ ...prev, arrangementAmount: normalized }))
      return
    }
    setInsurance(prev => ({ ...prev, arrangementAmount: normalized }))
  }

  const handleSave = () => {
    if (!canSave) return
    if (docId === 'travel-ticket') {
      onSave({
        fileName: fileName.trim(),
        travelTicket: {
          ...ticket,
          fileName: fileName.trim(),
          arrangementAmount: requiresGltsArrangement ? ticket.arrangementAmount?.trim() : ticket.arrangementAmount,
          vendorId: requiresGltsArrangement ? ticket.vendorId?.trim() : ticket.vendorId,
          vendorName: requiresGltsArrangement
            ? ticket.vendorName?.trim() || resolveGltsDocumentVendorName(ticket.vendorId)
            : ticket.vendorName,
        },
      })
    } else if (docId === 'insurance') {
      onSave({
        fileName: fileName.trim(),
        insurance: {
          ...insurance,
          fileName: fileName.trim(),
          arrangementAmount: requiresGltsArrangement
            ? insurance.arrangementAmount?.trim()
            : insurance.arrangementAmount,
          vendorId: requiresGltsArrangement ? insurance.vendorId?.trim() : insurance.vendorId,
          vendorName: requiresGltsArrangement
            ? insurance.vendorName?.trim() || resolveGltsDocumentVendorName(insurance.vendorId)
            : insurance.vendorName,
        },
      })
    } else {
      onSave({ fileName: fileName.trim() })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={requiresGltsArrangement ? 'md' : 'sm'}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Save document" variant="contained" onClick={handleSave} disabled={!canSave} />
        </Stack>
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

        {requiresGltsArrangement && docId ? (
          <>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField
                  label="Amount (INR)"
                  required
                  helperText={
                    arrangementAmount && !amountValid ? 'Enter a valid amount greater than 0' : undefined
                  }
                >
                  <Input
                    fullWidth
                    size="sm"
                    value={arrangementAmount ?? ''}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormField label="Vendor" required>
                  <Select
                    fullWidth
                    size="sm"
                    placeholder="Select vendor"
                    value={vendorId ?? ''}
                    options={vendorOptions}
                    onChange={handleVendorChange}
                  />
                </FormField>
              </Grid>
            </Grid>

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
                      minDate={
                        parseDateString(insurance.validFrom ?? insurance.travelStartDate) ?? undefined
                      }
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
          </>
        ) : null}
      </Stack>
    </Modal>
  )
}
