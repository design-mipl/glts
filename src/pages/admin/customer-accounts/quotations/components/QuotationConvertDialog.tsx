import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, FormSection, Modal, Select } from '@/design-system/UIComponents'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getVersionById } from '@/shared/utils/quotationValidation'

interface QuotationConvertDialogProps {
  open: boolean
  quotation?: QuotationRecord
  initialVersionId?: string
  onClose: () => void
  onConfirm: (versionId: string) => void
}

function formatVersionOptionLabel(
  version: QuotationRecord['pricingVersions'][number],
): string {
  return `${version.versionLabel} · ${formatInr(version.totals.grandTotal)} · ${version.pricingMatrix.length} row(s)`
}

export function QuotationConvertDialog({
  open,
  quotation,
  initialVersionId,
  onClose,
  onConfirm,
}: QuotationConvertDialogProps) {
  const versions = useMemo(() => {
    if (!quotation) return []
    return [...quotation.pricingVersions]
      .filter((version) => version.pricingMatrix.length > 0)
      .sort((a, b) => b.versionNumber - a.versionNumber)
  }, [quotation])

  const defaultVersionId = useMemo(() => {
    if (initialVersionId && versions.some((version) => version.id === initialVersionId)) {
      return initialVersionId
    }
    return versions[0]?.id ?? ''
  }, [initialVersionId, versions])

  const [selectedVersionId, setSelectedVersionId] = useState(defaultVersionId)

  useEffect(() => {
    if (open) {
      setSelectedVersionId(defaultVersionId)
    }
  }, [open, defaultVersionId])

  const selectedVersion = quotation ? getVersionById(quotation, selectedVersionId) : undefined
  const canConvert = Boolean(selectedVersion && selectedVersion.pricingMatrix.length > 0)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to Agreement"
      size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Convert to Agreement"
            onClick={() => onConfirm(selectedVersionId)}
            disabled={!canConvert}
          />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Carry forward customer information and the selected pricing version into Agreement & Contract Setup.
        </Typography>

        {versions.length > 0 ? (
          <FormSection columns={ADMIN_MODAL_FORM_LAYOUT.fieldColumns}>
            <AdminFullPageFormFieldSpan>
              <FormField
                label="Pricing version"
                required
                helperText={
                  selectedVersion
                    ? `${selectedVersion.pricingMatrix.length} pricing row(s) · Grand total ${formatInr(selectedVersion.totals.grandTotal)}`
                    : 'Select which pricing version to carry into the agreement.'
                }
              >
                <Select
                  value={selectedVersionId}
                  onChange={(v) => setSelectedVersionId(String(v))}
                  options={versions.map((version) => ({
                    value: version.id,
                    label: formatVersionOptionLabel(version),
                  }))}
                  placeholder="Select pricing version"
                  size="sm"
                  fullWidth
                />
              </FormField>
            </AdminFullPageFormFieldSpan>
          </FormSection>
        ) : (
          <Typography variant="body2" color="error.main">
            A pricing version with at least one row is required before conversion.
          </Typography>
        )}
      </Stack>
    </Modal>
  )
}
