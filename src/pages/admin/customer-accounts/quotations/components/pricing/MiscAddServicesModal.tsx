import { Stack, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@/design-system/UIComponents'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { QuotationServiceLine } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getServiceMasterPickerOptions } from '../../utils/quotationMasterOptions'
import { SearchableServicePicker, SelectedServiceList } from './SearchableServicePicker'

interface MiscAddServicesModalProps {
  open: boolean
  workflowType: AgreementWorkflowType
  initial?: QuotationServiceLine[]
  /** When adding (not editing), hide services already on the quotation. */
  excludeServiceIds?: string[]
  onClose: () => void
  onSave: (services: QuotationServiceLine[]) => void
}

export function MiscAddServicesModal({
  open,
  workflowType,
  initial,
  excludeServiceIds,
  onClose,
  onSave,
}: MiscAddServicesModalProps) {
  const [selected, setSelected] = useState<QuotationServiceLine[]>([])
  const excluded = useMemo(() => new Set(excludeServiceIds ?? []), [excludeServiceIds])
  const options = useMemo(
    () =>
      getServiceMasterPickerOptions(workflowType, { excludeServiceTypes: ['vfs'] }).filter(
        (opt) => !excluded.has(opt.value),
      ),
    [workflowType, excluded],
  )

  useEffect(() => {
    if (!open) return
    setSelected(initial ? structuredClone(initial) : [])
  }, [open, initial])

  const total = selected.reduce((s, x) => s + x.amount, 0)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Miscellaneous Services"
      subtitle="Agreement-level services not linked to a country."
      size="md"
      footer={
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Total {formatInr(total)}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button label="Cancel" variant="neutral" onClick={onClose} />
            <Button
              label="Save"
              disabled={selected.length === 0}
              onClick={() => {
                onSave(selected)
                onClose()
              }}
            />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        <SearchableServicePicker options={options} selected={selected} onChange={setSelected} />
        <SelectedServiceList services={selected} onChange={setSelected} />
      </Stack>
    </Modal>
  )
}
