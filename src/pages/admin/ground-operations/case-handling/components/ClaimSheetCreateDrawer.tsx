import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Checkbox as MuiCheckbox,
  Divider,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import {
  Button,
  Checkbox,
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
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import {
  claimSheetExpenseDraftsFromSheet,
  createEmptyClaimSheetExpenseDrafts,
  selectedClaimSheetExpensesFromDrafts,
  type ClaimSheetExpenseDraft,
} from '../config/claimSheetExpenseOptions'
import { ClaimSheetDetailBody } from './ClaimSheetDetailBody'

const DRAWER_WIDTH = 640

interface ClaimSheetCreateDrawerProps {
  open: boolean
  onClose: () => void
  onCreated: (sheet: GroundOpsClaimSheet) => void
  /** When set, drawer edits and resubmits this rejected claim sheet. */
  editSheet?: GroundOpsClaimSheet | null
}

export function ClaimSheetCreateDrawer({
  open,
  onClose,
  onCreated,
  editSheet = null,
}: ClaimSheetCreateDrawerProps) {
  const { showToast } = useToast()
  const isEdit = Boolean(editSheet)
  const [step, setStep] = useState<'select' | 'expenses' | 'review'>('select')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expenseDrafts, setExpenseDrafts] = useState<ClaimSheetExpenseDraft[]>(
    createEmptyClaimSheetExpenseDrafts(),
  )
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState<GroundOpsClaimSheet | null>(null)

  const eligibleCases = useMemo(() => {
    if (!open) return [] as OperationalCase[]
    return groundOpsClaimSheetService.listCompletedCasesEligible()
  }, [open])

  useEffect(() => {
    if (!open) return
    if (editSheet) {
      setStep('select')
      setSelectedIds(editSheet.cases.map(row => row.caseId))
      setExpenseDrafts(claimSheetExpenseDraftsFromSheet(editSheet.otherExpenses))
      setNotes(editSheet.notes)
      setPreview(null)
      setSubmitting(false)
      return
    }
    setStep('select')
    setSelectedIds([])
    setExpenseDrafts(createEmptyClaimSheetExpenseDrafts())
    setNotes('')
    setPreview(null)
    setSubmitting(false)
  }, [open, editSheet])

  const reset = () => {
    setStep('select')
    setSelectedIds([])
    setExpenseDrafts(createEmptyClaimSheetExpenseDrafts())
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

  const patchExpense = (
    id: ClaimSheetExpenseDraft['id'],
    patch: Partial<Pick<ClaimSheetExpenseDraft, 'selected' | 'amount'>>,
  ) => {
    setExpenseDrafts(prev =>
      prev.map(row => {
        if (row.id !== id) return row
        const next = { ...row, ...patch }
        if (patch.selected === false) next.amount = ''
        return next
      }),
    )
  }

  const handleBuildPreview = () => {
    const input = {
      caseIds: selectedIds,
      otherExpenses: selectedClaimSheetExpensesFromDrafts(expenseDrafts),
      notes,
      generatedBy: getCurrentUser()?.name?.trim() || 'Ground Ops',
    }

    try {
      if (editSheet) {
        const result = groundOpsClaimSheetService.resubmit(editSheet.id, input)
        if (!result.ok || !result.sheet) {
          showToast({
            title: 'Could not resubmit claim sheet',
            description: result.error ?? 'Please try again.',
            variant: 'error',
          })
          return
        }
        setPreview(result.sheet)
        setStep('review')
        onCreated(result.sheet)
        showToast({
          title: 'Claim sheet resubmitted',
          description: `${result.sheet.claimNumber} sent back to Finance for review.`,
          variant: 'success',
        })
        return
      }

      const sheet = groundOpsClaimSheetService.create(input)
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
        title: isEdit ? 'Could not resubmit claim sheet' : 'Could not generate claim sheet',
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
          label={isEdit ? 'Update & resubmit' : 'Generate & submit'}
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
      title={isEdit ? `Edit ${editSheet?.claimNumber ?? 'claim sheet'}` : 'Claim sheet'}
      subtitle={
        step === 'select'
          ? isEdit
            ? 'Update cases after Finance rejection, then continue'
            : 'Select cases from document submission onward'
          : step === 'expenses'
            ? isEdit
              ? 'Select expenses and amounts, then resubmit'
              : 'Select expenses and amounts, then generate'
            : preview
              ? preview.claimNumber
              : 'Review'
      }
      width={DRAWER_WIDTH}
      footer={footer}
      bodyVariant="default"
    >
      {step === 'select' && isEdit && editSheet?.rejectionReason ? (
        <Box
          sx={{
            mb: 1.5,
            p: 1.25,
            borderRadius: 1.25,
            border: 1,
            borderColor: 'error.light',
            bgcolor: theme => alpha(theme.palette.error.main, 0.08),
          }}
        >
          <Typography variant="caption" fontWeight={700} color="error.main" sx={{ fontSize: 11 }}>
            Finance rejection reason
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>
            {editSheet.rejectionReason}
          </Typography>
        </Box>
      ) : null}

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
                    <MuiCheckbox
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
          <AdminOverlayFormSection title="Expenses" importance="primary">
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.25,
                overflow: 'hidden',
              }}
            >
              <Stack divider={<Divider />}>
                {expenseDrafts.map(row => (
                  <Stack
                    key={row.id}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ px: 1.25, py: 1 }}
                  >
                    <Checkbox
                      checked={row.selected}
                      size="sm"
                      onChange={checked => patchExpense(row.id, { selected: checked })}
                    />
                    <Typography variant="body2" sx={{ flex: 1, fontSize: 13 }}>
                      {row.label}
                    </Typography>
                    {row.selected ? (
                      <Box sx={{ width: 120 }}>
                        <Input
                          size="sm"
                          type="number"
                          value={row.amount}
                          placeholder="Amount"
                          onChange={value => patchExpense(row.id, { amount: value })}
                        />
                      </Box>
                    ) : null}
                  </Stack>
                ))}
              </Stack>
            </Box>
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
            {selectedIds.length} case(s) selected. Tick expenses and enter amounts before submit.
            Settlement KPIs and service proofs will be frozen on submit.
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
