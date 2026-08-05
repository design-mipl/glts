import { useMemo, useState } from 'react'
import {
  Box,
  Checkbox,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {
  Button,
  Drawer,
  FormField,
  Input,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import { getCurrentUser } from '@/shared/services/authService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'
import { ClaimSheetDetailBody } from './ClaimSheetDetailBody'

dayjs.extend(customParseFormat)

const DRAWER_WIDTH = 640

function formatDisplayDate(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = dayjs(value.trim(), ['YYYY-MM-DD', 'DD/MM/YYYY'], true)
  if (parsed.isValid()) return parsed.format('DD MMM YYYY')
  const fallback = dayjs(value.trim())
  return fallback.isValid() ? fallback.format('DD MMM YYYY') : value
}

interface OtherExpenseDraft {
  id: string
  description: string
  amount: string
}

interface ClaimSheetCreateDrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (sheet: GroundOpsClaimSheet) => void
}

function newOtherExpenseDraft(): OtherExpenseDraft {
  return {
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    description: '',
    amount: '',
  }
}

export function ClaimSheetCreateDrawer({ open, onClose, onCreated }: ClaimSheetCreateDrawerProps) {
  const { showToast } = useToast()
  const [step, setStep] = useState<'select' | 'expenses' | 'review'>('select')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseDraft[]>([newOtherExpenseDraft()])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<GroundOpsClaimSheet | null>(null)

  const eligibleCases = useMemo(() => {
    if (!open) return [] as OperationalCase[]
    return groundOpsClaimSheetService.listCompletedCasesEligible()
  }, [open])

  const reset = () => {
    setStep('select')
    setSelectedIds([])
    setOtherExpenses([newOtherExpenseDraft()])
    setNotes('')
    setPreview(null)
    setSubmitting(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const toggleCase = (caseId: string) => {
    setSelectedIds(prev =>
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId],
    )
  }

  const handleBuildPreview = () => {
    try {
      const sheet = groundOpsClaimSheetService.create({
        caseIds: selectedIds,
        otherExpenses: otherExpenses.map(row => ({
          description: row.description,
          amount: Number.parseFloat(row.amount.replace(/,/g, '')) || 0,
        })),
        notes,
        generatedBy: getCurrentUser()?.name?.trim() || 'Ground Ops',
      })
      setPreview(sheet)
      setStep('review')
      onCreated(sheet)
      showToast({
        title: 'Claim sheet generated',
        description: `${sheet.claimNumber} submitted for Finance review.`,
        variant: 'success',
      })
    } catch (error) {
      showToast({
        title: 'Could not generate claim sheet',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'error',
      })
    }
  }

  const footer =
    step === 'select' ? (
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Button label="Cancel" variant="neutral" onClick={handleClose} />
        <Button
          label="Continue"
          variant="contained"
          disabled={selectedIds.length === 0}
          onClick={() => setStep('expenses')}
        />
      </Stack>
    ) : step === 'expenses' ? (
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Button label="Back" variant="neutral" onClick={() => setStep('select')} />
        <Button
          label="Generate & submit"
          variant="contained"
          loading={submitting}
          onClick={() => {
            setSubmitting(true)
            handleBuildPreview()
            setSubmitting(false)
          }}
        />
      </Stack>
    ) : (
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button label="Close" variant="contained" onClick={handleClose} />
      </Stack>
    )

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Claim sheet"
      subtitle={
        step === 'select'
          ? 'Select cases from document submission onward'
          : step === 'expenses'
            ? 'Add other expenses, then generate'
            : preview
              ? preview.claimNumber
              : 'Review'
      }
      width={DRAWER_WIDTH}
      footer={footer}
      bodyVariant="default"
    >
      {step === 'select' ? (
        <Stack spacing={1}>
          {eligibleCases.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No document-submitted or later cases are available for claim.
            </Typography>
          ) : (
            eligibleCases.map(record => {
              const selected = selectedIds.includes(record.id)
              return (
                <Box
                  key={record.id}
                  onClick={() => toggleCase(record.id)}
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderRadius: 1.25,
                    border: 1,
                    borderColor: selected ? 'primary.main' : 'divider',
                    bgcolor: 'background.paper',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Checkbox
                      size="small"
                      checked={selected}
                      onClick={event => event.stopPropagation()}
                      onChange={() => toggleCase(record.id)}
                      sx={{ p: 0.25, mt: 0.1 }}
                    />
                    <Stack spacing={0.35} minWidth={0} flex={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        spacing={1}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                          sx={{ fontSize: 13, lineHeight: 1.35 }}
                        >
                          {record.passengerName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: 12, lineHeight: 1.35, flexShrink: 0 }}
                        >
                          {formatInr(record.actualExpense || 0)}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ fontSize: 11, lineHeight: 1.4 }}
                      >
                        {record.operationalId} · {record.applicationId}
                        {' · '}
                        {[record.country, record.visaType, record.status]
                          .filter(Boolean)
                          .join(' · ')}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ fontSize: 11, lineHeight: 1.4, opacity: 0.85 }}
                      >
                        Submitted {formatDisplayDate(record.submissionDate)}
                        {' · '}
                        Dispatched {formatDisplayDate(record.dispatchDetails?.dispatchedAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              )
            })
          )}
        </Stack>
      ) : null}

      {step === 'expenses' ? (
        <Stack spacing={2}>
          <AdminOverlayFormSection title="Other expenses" importance="primary">
            <Stack spacing={1.25}>
              {otherExpenses.map((row, index) => (
                <Box
                  key={row.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1.6fr 0.8fr auto' },
                    gap: 1,
                    alignItems: 'end',
                  }}
                >
                  <FormField label={index === 0 ? 'Description' : undefined}>
                    <Input
                      value={row.description}
                      onChange={value =>
                        setOtherExpenses(prev =>
                          prev.map(item =>
                            item.id === row.id ? { ...item, description: value } : item,
                          ),
                        )
                      }
                      placeholder="e.g. Local transport"
                      size="sm"
                      fullWidth
                    />
                  </FormField>
                  <FormField label={index === 0 ? 'Amount' : undefined}>
                    <Input
                      value={row.amount}
                      onChange={value =>
                        setOtherExpenses(prev =>
                          prev.map(item => (item.id === row.id ? { ...item, amount: value } : item)),
                        )
                      }
                      placeholder="0"
                      size="sm"
                      fullWidth
                    />
                  </FormField>
                  <Button
                    label="Remove"
                    variant="text"
                    size="sm"
                    disabled={otherExpenses.length === 1}
                    onClick={() =>
                      setOtherExpenses(prev => prev.filter(item => item.id !== row.id))
                    }
                  />
                </Box>
              ))}
              <Button
                label="Add expense line"
                variant="neutral"
                size="sm"
                onClick={() => setOtherExpenses(prev => [...prev, newOtherExpenseDraft()])}
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>
          </AdminOverlayFormSection>

          <FormField label="Notes">
            <Textarea
              value={notes}
              onChange={setNotes}
              placeholder="Optional note for Finance"
              rows={2}
            />
          </FormField>

          <Typography variant="caption" color="text.secondary">
            {selectedIds.length} case(s) selected. Settlement KPIs and service proofs will be
            frozen on submit.
          </Typography>
        </Stack>
      ) : null}

      {step === 'review' && preview ? (
        <ClaimSheetDetailBody
          sheet={preview}
          onDownloadPdf={() =>
            showToast({
              title: 'PDF download started',
              description: groundOpsClaimSheetService.getPdfDownloadLabel(preview),
              variant: 'success',
            })
          }
          onDownloadProofs={() =>
            showToast({
              title: 'Proofs download started',
              description: groundOpsClaimSheetService.getProofsDownloadLabel(preview),
              variant: 'success',
            })
          }
        />
      ) : null}
    </Drawer>
  )
}
