import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import { Badge, Button, Modal } from '@/design-system/UIComponents'
import {
  SLA_BULK_BANDS,
  SLA_BULK_BAND_LABELS,
  SLA_DOMAIN_LABELS,
  SLA_STAGE_LABELS,
  getSlaStagesForScope,
  getSlaSubmoduleLabel,
  type SlaMaster,
} from '@/shared/types/slaMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface SlaViewModalProps {
  open: boolean
  record: SlaMaster | null
  onClose: () => void
  onEdit: (record: SlaMaster) => void
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function SlaViewModal({ open, record, onClose, onEdit }: SlaViewModalProps) {
  const theme = useTheme()
  if (!record) return null

  const segmentLabel = getSlaSubmoduleLabel(record.domain, record.segment)
  const stages = getSlaStagesForScope(record.domain, record.segment)
  const headerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.03)
  const totalBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.06)

  const columns = [
    { key: 'single', label: 'Single', plan: record.single },
    ...SLA_BULK_BANDS.map((band) => ({
      key: band,
      label: `Bulk ${SLA_BULK_BAND_LABELS[band].replace(' applicants', '')}`,
      plan: record.bulkBands[band],
    })),
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={record.name}
      subtitle={`${SLA_DOMAIN_LABELS[record.domain]} · ${segmentLabel}`}
      size="lg"
      footer={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
          <Button label="Close" variant="neutral" onClick={onClose} />
          <Button
            label="Edit"
            onClick={() => {
              onClose()
              onEdit(record)
            }}
          />
        </Box>
      }
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <SummaryField label="Module" value={SLA_DOMAIN_LABELS[record.domain]} />
          <SummaryField label="Submodule" value={segmentLabel} />
          <Stack spacing={0.25}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Status
            </Typography>
            <Box>
              <Badge
                label={masterStatusLabel[record.status]}
                color={masterStatusColor[record.status]}
                size="sm"
              />
            </Box>
          </Stack>
          <SummaryField
            label="Updated"
            value={`${record.updatedBy} · ${formatMasterDate(record.updatedAt)}`}
          />
        </Box>

        <Box
          sx={{
            overflowX: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1.25,
          }}
        >
          <Table size="small" sx={{ minWidth: 560 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: headerBg }}>
                <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
                  Tab / stage
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align="center"
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stages.map((stage) => (
                <TableRow key={stage}>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>
                    {SLA_STAGE_LABELS[stage]}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align="center"
                      sx={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}
                    >
                      {column.plan.stages[stage] ?? 0}h
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: totalBg }}>
                <TableCell sx={{ fontSize: 13, fontWeight: 700 }}>Total</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align="center"
                    sx={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {column.plan.e2eHours}h
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Stack>
    </Modal>
  )
}
