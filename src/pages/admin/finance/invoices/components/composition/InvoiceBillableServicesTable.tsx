import { useMemo, useState } from 'react'
import { Box, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Plus, Trash2 } from 'lucide-react'
import { Button, Checkbox, Input } from '@/design-system/UIComponents'
import {
  agreementEmbeddedTableHeadCellSx,
  agreementEmbeddedTableSx,
} from '@/pages/admin/customer-accounts/agreements/components/agreementFormLayout'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../../config/invoiceFeeCategoryLabels'
import type {
  InvoiceBillableServiceLine,
  InvoiceCompositionMode,
  InvoiceServiceLineCategory,
} from '../../types/invoiceFeeComposition.types'
import {
  createBillableServiceLineFromAgreement,
  createBillableServiceLineFromVfs,
  listAvailableAgreementServicesToAdd,
  listAvailableVfsServicesToAdd,
} from '../../utils/invoiceFeeCompositionUtils'
import {
  InvoiceAddServicePickerModal,
  type InvoiceAddServicePickerOption,
} from './InvoiceAddServicePickerModal'

const LABELS = INVOICE_COMPOSITION_FEE_LABELS.billableServices

const headCellSx: SxProps<Theme> = {
  ...agreementEmbeddedTableHeadCellSx,
  textTransform: 'none',
  letterSpacing: 'normal',
}

const CATEGORY_ORDER: InvoiceServiceLineCategory[] = [
  'glts_processing',
  'miscellaneous_dispatch',
  'vfs',
]

const CATEGORY_TITLE: Record<InvoiceServiceLineCategory, string> = {
  glts_processing: LABELS.categoryGlts,
  miscellaneous_dispatch: LABELS.categoryMisc,
  vfs: LABELS.categoryVfs,
}

type PickerKind = 'misc' | 'vfs' | null

type LinePatch = Partial<
  Pick<
    InvoiceBillableServiceLine,
    'amount' | 'creditAmount' | 'updatedAmount' | 'remark' | 'gstApplicable' | 'selected'
  >
>

interface InvoiceBillableServicesTableProps {
  lines: InvoiceBillableServiceLine[]
  onChange: (lines: InvoiceBillableServiceLine[]) => void
  agreement?: CommercialAgreement | null
  country?: string
  visaType?: string
  allowAddServices?: boolean
  mode?: InvoiceCompositionMode
}

export function InvoiceBillableServicesTable({
  lines,
  onChange,
  agreement,
  country = '',
  visaType = '',
  allowAddServices = true,
  mode = 'generate',
}: InvoiceBillableServicesTableProps) {
  const [pickerKind, setPickerKind] = useState<PickerKind>(null)
  const isCreditNote = mode === 'credit_note'
  const isRevised = mode === 'revised'

  const miscOptions = useMemo(
    () => listAvailableAgreementServicesToAdd(agreement, lines),
    [agreement, lines],
  )

  const vfsOptions = useMemo(
    () => listAvailableVfsServicesToAdd(country, visaType, lines),
    [country, visaType, lines],
  )

  const grouped = useMemo(() => {
    const map = new Map<InvoiceServiceLineCategory, InvoiceBillableServiceLine[]>()
    for (const category of CATEGORY_ORDER) map.set(category, [])
    for (const line of lines) {
      const category = line.category ?? 'miscellaneous_dispatch'
      const list = map.get(category) ?? []
      list.push(line)
      map.set(category, list)
    }
    return CATEGORY_ORDER.map(category => ({
      category,
      title: CATEGORY_TITLE[category],
      lines: map.get(category) ?? [],
    })).filter(group => group.lines.length > 0)
  }, [lines])

  const updateLine = (id: string, patch: LinePatch) => {
    onChange(lines.map(line => (line.id === id ? { ...line, ...patch } : line)))
  }

  const removeLine = (id: string) => {
    const target = lines.find(line => line.id === id)
    if (target?.category === 'glts_processing' && allowAddServices && mode === 'generate') return
    onChange(lines.filter(line => line.id !== id))
  }

  const handleAddFromPicker = (selected: InvoiceAddServicePickerOption[]) => {
    if (pickerKind === 'misc') {
      onChange([
        ...lines,
        ...selected.map(option => {
          const line = createBillableServiceLineFromAgreement(option)
          return isRevised ? { ...line, updatedAmount: line.amount } : line
        }),
      ])
    } else if (pickerKind === 'vfs') {
      onChange([
        ...lines,
        ...selected.map(option => {
          const line = createBillableServiceLineFromVfs(option)
          return isRevised ? { ...line, updatedAmount: line.amount } : line
        }),
      ])
    }
    setPickerKind(null)
  }

  const colSpan = isCreditNote ? 7 : isRevised ? 6 : 5

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {LABELS.section}
        </Typography>
        {allowAddServices ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            <Button
              label={LABELS.addService}
              size="sm"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={() => setPickerKind('misc')}
              disabled={miscOptions.length === 0}
            />
            <Button
              label={LABELS.addVfsService}
              size="sm"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={() => setPickerKind('vfs')}
              disabled={vfsOptions.length === 0}
            />
          </Stack>
        ) : null}
      </Stack>

      <Box sx={agreementEmbeddedTableSx}>
        {lines.length === 0 ? (
          <Box sx={{ py: 2, px: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              {LABELS.empty}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table
              size="small"
              sx={{
                '& .MuiTableCell-root': { py: 0.5 },
                '& .MuiTableCell-head': { py: 0.625 },
              }}
            >
              <TableHead>
                <TableRow>
                  {isCreditNote ? (
                    <TableCell sx={{ ...headCellSx, width: 56 }} align="center">
                      {LABELS.selectColumn}
                    </TableCell>
                  ) : null}
                  <TableCell sx={headCellSx}>{LABELS.serviceColumn}</TableCell>
                  {!isRevised ? (
                    <TableCell sx={{ ...headCellSx, width: 140 }} align="right">
                      {LABELS.amountColumn}
                    </TableCell>
                  ) : null}
                  {isCreditNote || isRevised ? (
                    <TableCell sx={{ ...headCellSx, width: 140 }} align="right">
                      {LABELS.creditAmountColumn}
                    </TableCell>
                  ) : null}
                  {isRevised ? (
                    <TableCell sx={{ ...headCellSx, width: 140 }} align="right">
                      {LABELS.updatedAmountColumn}
                    </TableCell>
                  ) : null}
                  <TableCell sx={{ ...headCellSx, width: 64 }} align="center">
                    {LABELS.gstColumn}
                  </TableCell>
                  <TableCell sx={headCellSx}>{LABELS.remarkColumn}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: 56 }} align="center">
                    {LABELS.actionsColumn}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grouped.map(group => (
                  <CategoryRows
                    key={group.category}
                    title={group.title}
                    colSpan={colSpan}
                    lines={group.lines}
                    mode={mode}
                    allowRemoveGlts={isCreditNote || isRevised || !allowAddServices}
                    onUpdate={updateLine}
                    onRemove={removeLine}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
      {lines.length > 0 ? (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {lines.length} service{lines.length === 1 ? '' : 's'}
          </Typography>
        </Stack>
      ) : null}

      <InvoiceAddServicePickerModal
        open={pickerKind === 'misc'}
        title="Add miscellaneous services"
        subtitle="From the commercial agreement for this customer."
        options={miscOptions}
        emptyMessage={LABELS.noAgreementServices}
        onClose={() => setPickerKind(null)}
        onAdd={handleAddFromPicker}
      />

      <InvoiceAddServicePickerModal
        open={pickerKind === 'vfs'}
        title="Add VFS services"
        subtitle="From country master rates for this application."
        contextLines={[
          { label: 'Country', value: country },
          { label: 'Visa type', value: visaType },
        ]}
        options={vfsOptions}
        emptyMessage={LABELS.noVfsServices}
        onClose={() => setPickerKind(null)}
        onAdd={handleAddFromPicker}
      />
    </Box>
  )
}

function CategoryRows({
  title,
  colSpan,
  lines,
  mode,
  allowRemoveGlts,
  onUpdate,
  onRemove,
}: {
  title: string
  colSpan: number
  lines: InvoiceBillableServiceLine[]
  mode: InvoiceCompositionMode
  allowRemoveGlts: boolean
  onUpdate: (id: string, patch: LinePatch) => void
  onRemove: (id: string) => void
}) {
  if (lines.length === 0) return null
  const isCreditNote = mode === 'credit_note'
  const isRevised = mode === 'revised'

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={colSpan}
          sx={{
            bgcolor: 'action.hover',
            fontSize: 11,
            fontWeight: 700,
            color: 'text.secondary',
            py: 0.5,
            px: 1.25,
          }}
        >
          {title}
        </TableCell>
      </TableRow>
      {lines.map(line => {
        const lockRemove = line.category === 'glts_processing' && !allowRemoveGlts
        const selected = line.selected !== false
        return (
          <TableRow key={line.id} sx={{ opacity: isCreditNote && !selected ? 0.55 : 1 }}>
            {isCreditNote ? (
              <TableCell align="center" sx={{ verticalAlign: 'middle', py: 0.25, px: 0.5 }}>
                <Checkbox
                  size="sm"
                  checked={selected}
                  onChange={checked => onUpdate(line.id, { selected: checked })}
                />
              </TableCell>
            ) : null}
            <TableCell
              sx={{
                fontSize: 13,
                fontWeight: 600,
                verticalAlign: 'middle',
                minWidth: 180,
                py: 0.5,
                px: 1.25,
              }}
            >
              {line.serviceLabel || '—'}
            </TableCell>
            {!isRevised ? (
              <TableCell align="right" sx={{ verticalAlign: 'middle', py: 0.5, px: 1 }}>
                {isCreditNote ? (
                  <Input
                    type="number"
                    value={line.amount ? String(line.amount) : ''}
                    onChange={() => undefined}
                    placeholder="0"
                    size="sm"
                    fullWidth
                    disabled
                  />
                ) : (
                  <Input
                    type="number"
                    value={line.amount ? String(line.amount) : ''}
                    onChange={v => onUpdate(line.id, { amount: Number(v) || 0 })}
                    placeholder="0"
                    size="sm"
                    fullWidth
                  />
                )}
              </TableCell>
            ) : null}
            {isCreditNote ? (
              <TableCell align="right" sx={{ verticalAlign: 'middle', py: 0.5, px: 1 }}>
                <Input
                  type="number"
                  value={
                    line.creditAmount != null
                      ? String(line.creditAmount)
                      : line.amount
                        ? String(line.amount)
                        : ''
                  }
                  onChange={v => {
                    const next = Number(v)
                    const clamped =
                      Number.isFinite(next) && next >= 0
                        ? Math.min(next, Math.abs(line.amount) || next)
                        : 0
                    onUpdate(line.id, { creditAmount: clamped, selected: true })
                  }}
                  placeholder="0"
                  size="sm"
                  fullWidth
                  disabled={!selected}
                />
              </TableCell>
            ) : null}
            {isRevised ? (
              <>
                <TableCell align="right" sx={{ verticalAlign: 'middle', py: 0.5, px: 1 }}>
                  <Input
                    type="number"
                    value={line.creditAmount != null && line.creditAmount > 0 ? String(line.creditAmount) : ''}
                    onChange={() => undefined}
                    placeholder="—"
                    size="sm"
                    fullWidth
                    disabled
                  />
                </TableCell>
                <TableCell align="right" sx={{ verticalAlign: 'middle', py: 0.5, px: 1 }}>
                  <Input
                    type="number"
                    value={
                      line.updatedAmount != null
                        ? String(line.updatedAmount)
                        : line.amount
                          ? String(line.amount)
                          : ''
                    }
                    onChange={v => onUpdate(line.id, { updatedAmount: Number(v) || 0 })}
                    placeholder="0"
                    size="sm"
                    fullWidth
                  />
                </TableCell>
              </>
            ) : null}
            <TableCell align="center" sx={{ verticalAlign: 'middle', py: 0.25, px: 0.5 }}>
              <Box title={`${line.serviceLabel} GST`} sx={{ display: 'inline-flex', justifyContent: 'center' }}>
                <Checkbox
                  size="sm"
                  checked={line.gstApplicable !== false}
                  onChange={checked => onUpdate(line.id, { gstApplicable: checked })}
                />
              </Box>
            </TableCell>
            <TableCell sx={{ verticalAlign: 'middle', minWidth: 200, py: 0.5, px: 1 }}>
              <Input
                value={line.remark}
                onChange={v => onUpdate(line.id, { remark: v })}
                placeholder="Add remark"
                size="sm"
                fullWidth
              />
            </TableCell>
            <TableCell align="center" sx={{ verticalAlign: 'middle', py: 0.5, px: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onRemove(line.id)}
                disabled={lockRemove}
                aria-label={`${LABELS.deleteService}: ${line.serviceLabel}`}
              >
                <Trash2 size={14} />
              </IconButton>
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}
