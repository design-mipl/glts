import { useEffect, useMemo, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import {
  Button,
  Checkbox,
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
import { gltsArrangeFeeAmountString } from '@/shared/utils/gltsArrangeFeeUtils'
import {
  isValidGltsArrangementAmount,
  listGltsDocumentUploadVendors,
  resolveGltsDocumentVendorName,
} from '../../utils/gltsDocumentUploadVendorOptions'

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

function hasExistingArrangement(document: ApplicantDocumentItem): boolean {
  if (document.documentId === 'travel-ticket') {
    const w = document.travelTicket
    return Boolean(w?.arrangementAmount?.trim() || w?.vendorId?.trim())
  }
  if (document.documentId === 'insurance') {
    const w = document.insurance
    return Boolean(
      w?.policyNumber?.trim() ||
        w?.invoiceNumber?.trim() ||
        w?.vendorId?.trim() ||
        w?.arrangementAmount?.trim(),
    )
  }
  return false
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
  const [fileName, setFileName] = useState('')
  const [includeArrangement, setIncludeArrangement] = useState(false)
  const [arrangementAmount, setArrangementAmount] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [remarks, setRemarks] = useState('')

  const isSimple = Boolean(document) && isSimpleDocumentRequirement(document!.documentId)
  const docId = isSimple ? (document!.documentId as SimpleDocumentRequirementId) : null
  const isInsurance = docId === 'insurance'

  useEffect(() => {
    if (!open || !document) return
    setFileName(resolveExistingFileName(document))

    const arrangeByGlts = resolveHandlingMode(document) === 'arrange_by_glts'
    const showArrangement = arrangeByGlts || hasExistingArrangement(document)
    setIncludeArrangement(showArrangement)

    if (document.documentId === 'travel-ticket') {
      const w = { ...emptyTravelTicketWorkflow(), ...document.travelTicket }
      setArrangementAmount(w.arrangementAmount?.trim() ?? '')
      setPolicyNumber('')
      setInvoiceNumber('')
      setVendorId(w.vendorId?.trim() ?? '')
      setRemarks(w.remarks?.trim() || w.notes?.trim() || '')
      return
    }

    if (document.documentId === 'insurance') {
      const w = { ...emptyInsuranceWorkflow(), ...document.insurance }
      setArrangementAmount(w.arrangementAmount?.trim() ?? '')
      setPolicyNumber(w.policyNumber?.trim() ?? '')
      setInvoiceNumber(w.invoiceNumber?.trim() ?? '')
      setVendorId(w.vendorId?.trim() ?? '')
      setRemarks(w.remarks?.trim() || w.notes?.trim() || '')
      return
    }

    setArrangementAmount('')
    setPolicyNumber('')
    setInvoiceNumber('')
    setVendorId('')
    setRemarks('')
  }, [open, document])

  const vendorOptions = useMemo(
    () => (docId && includeArrangement ? listGltsDocumentUploadVendors(docId) : []),
    [docId, includeArrangement],
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

  const amountValid =
    !includeArrangement || isInsurance || isValidGltsArrangementAmount(arrangementAmount)
  const policyValid = !includeArrangement || !isInsurance || Boolean(policyNumber.trim())
  const invoiceValid = !includeArrangement || !isInsurance || Boolean(invoiceNumber.trim())
  const vendorValid = !includeArrangement || Boolean(vendorId.trim())
  const canSave =
    Boolean(fileName.trim()) && amountValid && policyValid && invoiceValid && vendorValid

  const handleVendorChange = (nextVendorId: string | number) => {
    setVendorId(String(nextVendorId))
  }

  const handleSave = () => {
    if (!canSave) return
    const trimmedFile = fileName.trim()
    const vendor = includeArrangement ? vendorId.trim() : ''
    const note = includeArrangement ? remarks.trim() : ''
    const vendorName = includeArrangement ? resolveGltsDocumentVendorName(vendorId) || '' : ''

    if (docId === 'travel-ticket') {
      const amount = includeArrangement ? arrangementAmount.trim() : ''
      onSave({
        fileName: trimmedFile,
        travelTicket: {
          ...emptyTravelTicketWorkflow(),
          ...document.travelTicket,
          fileName: trimmedFile,
          arrangementAmount: amount,
          vendorId: vendor,
          vendorName,
          remarks: note,
          notes: note,
        },
      })
    } else if (docId === 'insurance') {
      const existingAmount = document.insurance?.arrangementAmount?.trim() ?? ''
      const feeAmount = gltsArrangeFeeAmountString('insurance')
      const amount = includeArrangement ? existingAmount || feeAmount : ''
      onSave({
        fileName: trimmedFile,
        insurance: {
          ...emptyInsuranceWorkflow(),
          ...document.insurance,
          fileName: trimmedFile,
          policyNumber: includeArrangement ? policyNumber.trim() : '',
          invoiceNumber: includeArrangement ? invoiceNumber.trim() : '',
          arrangementAmount: amount,
          vendorId: vendor,
          vendorName,
          remarks: note,
          notes: note,
        },
      })
    } else {
      onSave({ fileName: trimmedFile })
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={includeArrangement ? 'md' : 'sm'}
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

        {docId ? (
          <Stack spacing={0.5}>
            <Checkbox
              label={
                isInsurance
                  ? 'Include GLTS arrangement (policy, invoice & vendor)'
                  : 'Include GLTS arrangement (amount & vendor)'
              }
              checked={includeArrangement}
              onChange={setIncludeArrangement}
              size="sm"
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12, pl: 4.25 }}>
              Tick if GLTS arranged this. Leave unticked if the client will provide their own ticket
              or insurance later.
            </Typography>
          </Stack>
        ) : null}

        {includeArrangement && docId ? (
          <Stack spacing={1.5}>
            <Grid container spacing={1.5}>
              {isInsurance ? (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField label="Policy number" required>
                      <Input
                        fullWidth
                        size="sm"
                        value={policyNumber}
                        onChange={setPolicyNumber}
                        placeholder="Enter policy number"
                      />
                    </FormField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormField label="Invoice number" required>
                      <Input
                        fullWidth
                        size="sm"
                        value={invoiceNumber}
                        onChange={setInvoiceNumber}
                        placeholder="Enter invoice number"
                      />
                    </FormField>
                  </Grid>
                </>
              ) : (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormField
                    label="Amount (INR)"
                    required
                    helperText={
                      arrangementAmount && !amountValid
                        ? 'Enter a valid amount greater than 0'
                        : undefined
                    }
                  >
                    <Input
                      fullWidth
                      size="sm"
                      value={arrangementAmount}
                      onChange={value => setArrangementAmount(normalizeAmountInput(value))}
                      placeholder="0.00"
                    />
                  </FormField>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: isInsurance ? 12 : 6 }}>
                <FormField label="Vendor" required>
                  <Select
                    fullWidth
                    size="sm"
                    placeholder="Select vendor"
                    value={vendorId}
                    options={vendorOptions}
                    onChange={handleVendorChange}
                  />
                </FormField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormField label="Remarks" optional>
                  <Textarea
                    fullWidth
                    rows={3}
                    value={remarks}
                    onChange={setRemarks}
                    placeholder="Optional notes for this arrangement"
                  />
                </FormField>
              </Grid>
            </Grid>
          </Stack>
        ) : null}
      </Stack>
    </Modal>
  )
}
