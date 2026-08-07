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
import { Input } from '@/design-system/UIComponents'
import {
  SLA_BULK_BANDS,
  SLA_BULK_BAND_LABELS,
  SLA_DOMAIN_LABELS,
  SLA_STAGE_LABELS,
  getSlaStagesForScope,
  getSlaSubmoduleLabel,
  sumSlaStageHours,
  type SlaBulkBandKey,
  type SlaHoursPlan,
  type SlaMasterFormData,
  type SlaStageKey,
} from '@/shared/types/slaMaster'

type PlanColumnKey = 'single' | SlaBulkBandKey

const PLAN_COLUMNS: { key: PlanColumnKey; label: string }[] = [
  { key: 'single', label: 'Single application' },
  ...SLA_BULK_BANDS.map((band) => ({
    key: band as PlanColumnKey,
    label: `Bulk (${SLA_BULK_BAND_LABELS[band].replace(' applicants', '')})`,
  })),
]

interface SlaHoursMatrixProps {
  formData: SlaMasterFormData
  errors: Record<string, string>
  onChange: (next: SlaMasterFormData) => void
}

function parseHours(raw: string): number {
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

function getPlan(formData: SlaMasterFormData, column: PlanColumnKey): SlaHoursPlan {
  if (column === 'single') return formData.single
  return formData.bulkBands[column]
}

function errorPrefixFor(column: PlanColumnKey): string {
  return column === 'single' ? 'single' : `bulk.${column}`
}

export function SlaHoursMatrix({ formData, errors, onChange }: SlaHoursMatrixProps) {
  const theme = useTheme()
  const stages = getSlaStagesForScope(formData.domain, formData.segment)
  const headerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.03)

  const patchStage = (column: PlanColumnKey, stage: SlaStageKey, raw: string) => {
    const hours = parseHours(raw)
    if (column === 'single') {
      const nextStages = { ...formData.single.stages, [stage]: hours }
      onChange({
        ...formData,
        single: {
          stages: nextStages,
          e2eHours: sumSlaStageHours(nextStages, formData.domain, formData.segment),
        },
      })
      return
    }

    const current = formData.bulkBands[column]
    const nextStages = { ...current.stages, [stage]: hours }
    onChange({
      ...formData,
      bulkBands: {
        ...formData.bulkBands,
        [column]: {
          stages: nextStages,
          e2eHours: sumSlaStageHours(nextStages, formData.domain, formData.segment),
        },
      },
    })
  }

  const columnErrors = PLAN_COLUMNS.map((column) => {
    const prefix = errorPrefixFor(column.key)
    return errors[`${prefix}.sum`] || errors[`${prefix}.e2eHours`] || ''
  }).filter(Boolean)

  return (
    <Stack spacing={1.25} sx={{ width: '100%' }}>
      <Stack spacing={0.25}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {SLA_DOMAIN_LABELS[formData.domain]} ·{' '}
          {getSlaSubmoduleLabel(formData.domain, formData.segment)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          Rows are the listing tabs for this module/submodule. Change module or submodule to load
          that screen&apos;s tabs.
        </Typography>
      </Stack>

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.25,
        }}
      >
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: headerBg }}>
              <TableCell
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  minWidth: 180,
                }}
              >
                Tab / stage
              </TableCell>
              {PLAN_COLUMNS.map((column) => (
                <TableCell
                  key={column.key}
                  align="center"
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                    minWidth: 120,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stages.map((stage) => (
              <TableRow key={stage} hover>
                <TableCell
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {SLA_STAGE_LABELS[stage]}
                </TableCell>
                {PLAN_COLUMNS.map((column) => {
                  const plan = getPlan(formData, column.key)
                  return (
                    <TableCell key={column.key} align="center" sx={{ py: 1, px: 1 }}>
                      <Input
                        type="number"
                        value={String(plan.stages[stage] ?? 0)}
                        onChange={(raw) => patchStage(column.key, stage, raw)}
                        placeholder="0"
                        size="sm"
                        fullWidth
                        sx={{ maxWidth: 96, mx: 'auto' }}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {columnErrors.length > 0 ? (
        <Typography variant="caption" color="error" sx={{ fontSize: 12 }}>
          {columnErrors[0]}
        </Typography>
      ) : null}
    </Stack>
  )
}
