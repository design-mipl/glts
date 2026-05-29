import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Button,
  IconButton,
} from '@mui/material'
import { ChevronRight, Download, Pause } from 'lucide-react'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { formatQueueRowGltsLabel } from '../utils/gltsReferenceIds'

function documentProgressChip(
  complete: number,
  total: number,
  colors: ReturnType<typeof usePublicBrandColors>,
) {
  if (total === 0) {
    return (
      <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>—</Typography>
    )
  }
  const done = complete >= total
  const inProgress = complete > 0 && !done
  return (
    <Chip
      label={`${complete}/${total}`}
      size="small"
      sx={{
        fontWeight: 800,
        fontSize: 12,
        height: 24,
        bgcolor: done ? colors.greenMuted : inProgress ? 'rgba(245, 158, 11, 0.12)' : colors.surfaceAlt,
        color: done ? colors.greenDark : inProgress ? '#B45309' : colors.textMuted,
      }}
    />
  )
}

interface UploadQueueTableProps {
  rows: UploadQueueRow[]
  selectedId: string | null
  onSelect: (id: string) => void
  onContinue?: () => void
  /** Review step — no row navigation or footer CTA */
  readOnly?: boolean
  /** Submit step — row click selects for summary below (no drawer chevron) */
  selectionMode?: boolean
  /** One traveler — compact labels */
  singleListing?: boolean
  gltsApplicationId?: string
  gltsBatchId?: string
  continueLabel?: string
}

export function UploadQueueTable({
  rows,
  selectedId,
  onSelect,
  onContinue,
  readOnly = false,
  selectionMode = false,
  singleListing = false,
  gltsApplicationId,
  gltsBatchId,
  continueLabel,
}: UploadQueueTableProps) {
  const colors = usePublicBrandColors()
  const verified = rows.filter(r => r.status === 'verified').length
  const needsReview = rows.filter(r => r.status === 'needs_review').length
  const processing = rows.filter(r => r.status === 'processing').length
  const processed = rows.filter(r => r.status !== 'processing').length
  const readyRows = rows.filter(r => r.status !== 'processing')
  const allDocsReady =
    readyRows.length > 0 &&
    readyRows.every(r => r.documentsTotal === 0 || r.documentsComplete >= r.documentsTotal)

  const idColumnLabel = singleListing ? 'GLTS no.' : 'Applicant no.'

  return (
    <Box sx={{ borderRadius: '14px', border: `1px solid ${colors.border}`, overflow: 'hidden', bgcolor: '#fff' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${colors.border}` }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap>
          <Typography sx={{ fontWeight: 700, fontSize: '15px', color: colors.navy }}>
            {selectionMode ? (singleListing ? 'Applicant' : 'Travelers') : singleListing ? 'Applicant' : 'Upload queue'}
          </Typography>
          {gltsApplicationId && !singleListing && (
            <Chip
              label={gltsApplicationId}
              size="small"
              sx={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', bgcolor: colors.surface }}
            />
          )}
          {gltsBatchId && !singleListing && (
            <Chip
              label={gltsBatchId}
              size="small"
              variant="outlined"
              sx={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace' }}
            />
          )}
          {!singleListing && (
            <Chip
              label={`${processed} of ${rows.length} processed`}
              size="small"
              sx={{ fontSize: '11px', fontWeight: 700, bgcolor: colors.surface }}
            />
          )}
        </Stack>
        {!readOnly && !selectionMode && (
          <Stack direction="row" spacing={1}>
            <Button startIcon={<Download size={14} />} sx={{ textTransform: 'none' }}>
              Export CSV
            </Button>
            {!singleListing && (
              <Button startIcon={<Pause size={14} />} variant="outlined" sx={{ textTransform: 'none' }}>
                Pause
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: colors.surface }}>
            {[idColumnLabel, 'Traveler', 'Passport no.', 'Expiry', 'Nationality', 'Documents', ''].map(h => (
              <TableCell key={h || 'act'} sx={{ fontSize: '11px', fontWeight: 700, color: colors.textMuted, py: 1.25 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => {
            const selected = selectedId === row.id
            const isProcessing = row.status === 'processing'
            return (
              <TableRow
                key={row.id}
                hover={!isProcessing}
                onClick={() => (!readOnly || selectionMode) && !isProcessing && onSelect(row.id)}
                sx={{
                  cursor: readOnly && !selectionMode ? 'default' : isProcessing ? 'default' : 'pointer',
                  bgcolor: selected ? '#F5F0E8' : undefined,
                  '& td': { borderBottom: `1px solid ${colors.border}` },
                }}
              >
                <TableCell sx={{ fontSize: '12px' }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: colors.navy,
                    }}
                  >
                    {isProcessing
                      ? '—'
                      : formatQueueRowGltsLabel(row, gltsApplicationId, singleListing)}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy }}>
                  {isProcessing ? (
                    <Typography sx={{ fontSize: '12px', color: colors.textMuted, fontStyle: 'italic' }}>
                      Reading…
                    </Typography>
                  ) : (
                    row.travelerName
                  )}
                </TableCell>
                <TableCell sx={{ fontSize: '12px', fontFamily: 'monospace' }}>{row.passportNo}</TableCell>
                <TableCell sx={{ fontSize: '12px' }}>{row.expiry}</TableCell>
                <TableCell>
                  {!isProcessing && (
                    <Chip label={row.nationality} size="small" sx={{ fontSize: '10px', fontWeight: 800, height: 22 }} />
                  )}
                </TableCell>
                <TableCell>
                  {isProcessing
                    ? '—'
                    : documentProgressChip(row.documentsComplete, row.documentsTotal, colors)}
                </TableCell>
                <TableCell align="right">
                  {!readOnly && !selectionMode && !isProcessing && (
                    <IconButton size="small" aria-label="Open applicant documents">
                      <ChevronRight size={16} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {!readOnly && !selectionMode && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2, bgcolor: colors.surface, gap: 1.5 }}
        >
          <Typography sx={{ fontSize: '12px', color: colors.textSecondary }}>
            {singleListing
              ? `${processed === 1 ? '1 applicant ready' : 'Processing passport…'}`
              : `${verified} verified · ${needsReview} needs review · ${processing} processing`}
          </Typography>
          {onContinue && (
            <Button
              variant="contained"
              onClick={onContinue}
              disabled={processed === 0 || !allDocsReady}
              sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px', py: 1, px: 2.5 }}
            >
              {continueLabel ||
                (singleListing
                  ? 'Continue to submit →'
                  : `Continue with ${processed} traveler${processed === 1 ? '' : 's'} →`)}
            </Button>
          )}
        </Stack>
      )}
    </Box>
  )
}
