import { useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Search } from 'lucide-react'
import { Button, Checkbox, Input, Modal } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'

export interface InvoiceAddServicePickerOption {
  value: string
  label: string
  defaultAmount: number
}

interface InvoiceAddServicePickerModalProps {
  open: boolean
  title: string
  subtitle?: string
  contextLines?: Array<{ label: string; value: string }>
  options: InvoiceAddServicePickerOption[]
  emptyMessage: string
  confirmLabel?: string
  onClose: () => void
  onAdd: (selected: InvoiceAddServicePickerOption[]) => void
}

const BODY_FONT = 13
const SEARCH_THRESHOLD = 6

export function InvoiceAddServicePickerModal({
  open,
  title,
  subtitle,
  contextLines = [],
  options,
  emptyMessage,
  confirmLabel = 'Add services',
  onClose,
  onAdd,
}: InvoiceAddServicePickerModalProps) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (!open) {
      setSearch('')
      setSelectedIds([])
    }
  }, [open])

  const showSearch = options.length >= SEARCH_THRESHOLD

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter(option => option.label.toLowerCase().includes(q))
  }, [options, search])

  const selected = useMemo(
    () => options.filter(option => selectedIds.includes(option.value)),
    [options, selectedIds],
  )

  const selectedTotal = useMemo(
    () => selected.reduce((sum, option) => sum + option.defaultAmount, 0),
    [selected],
  )

  const handleClose = () => {
    setSearch('')
    setSelectedIds([])
    onClose()
  }

  const handleAdd = () => {
    if (selected.length === 0) return
    onAdd(selected)
    handleClose()
  }

  const toggle = (value: string, checked: boolean) => {
    setSelectedIds(current =>
      checked ? [...new Set([...current, value])] : current.filter(id => id !== value),
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      subtitle={subtitle}
      size="sm"
      footer={
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ width: '100%' }}
        >
          <Stack spacing={0.25}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: BODY_FONT }}>
              Selected: {selected.length}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: BODY_FONT }}>
              Total {formatInr(selectedTotal)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="neutral" onClick={handleClose} />
            <Button label={confirmLabel} onClick={handleAdd} disabled={selected.length === 0} />
          </Stack>
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        {contextLines.length > 0 ? (
          <>
            <Stack spacing={0.5}>
              {contextLines.map(line => (
                <Stack key={line.label} direction="row" spacing={1} alignItems="baseline">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: BODY_FONT, minWidth: 72 }}
                  >
                    {line.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: BODY_FONT, fontWeight: 600 }}>
                    {line.value || '—'}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider />
          </>
        ) : null}

        {showSearch ? (
          <Input
            value={search}
            onChange={setSearch}
            placeholder="Search by service name…"
            size="sm"
            fullWidth
            startAdornment={<Search size={16} />}
          />
        ) : null}

        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: '10px',
            overflow: 'hidden',
            maxHeight: 280,
            overflowY: 'auto',
          }}
        >
          {filtered.length === 0 ? (
            <Box sx={{ py: 2, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: BODY_FONT }}>
                {options.length === 0 ? emptyMessage : 'No services match your search.'}
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {filtered.map(option => (
                <Stack
                  key={option.value}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ px: 1.5, py: 0.75, minHeight: 36 }}
                >
                  <Checkbox
                    checked={selectedIds.includes(option.value)}
                    onChange={checked => toggle(option.value, checked)}
                    size="sm"
                    aria-label={option.label}
                  />
                  <Typography variant="body2" sx={{ flex: 1, fontSize: BODY_FONT }}>
                    {option.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: BODY_FONT, whiteSpace: 'nowrap' }}
                  >
                    {formatInr(option.defaultAmount)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Modal>
  )
}
