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
import { ChevronRight } from 'lucide-react'
import { usePublicBrandColors, getPrimaryButtonSx } from '@/shared/theme/publicBrand'
import {
  requiresFieldValidation,
  useApplicationFlowPolicy,
} from '../context/ApplicationFlowPolicyContext'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { formatQueueRowGltsLabel } from '../utils/gltsReferenceIds'
import type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import { ApplicationSummaryPopover } from './ApplicationSummaryPopover'

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
  /** When set, each row shows an info dialog with full application summary */
  summaryOverview?: ApplicationReviewOverview
  /** Admin verify — includes employment / marine fields in the summary dialog */
  summaryDetail?: ApplicationDetailViewModel
  summaryApplicationId?: string
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
  summaryOverview,
  summaryDetail,
  summaryApplicationId,
}: UploadQueueTableProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const verified = rows.filter(r => r.status === 'verified').length
  const needsReview = rows.filter(r => r.status === 'needs_review').length
  const processing = rows.filter(r => r.status === 'processing').length
  const processed = rows.filter(r => r.status !== 'processing').length
  const readyRows = rows.filter(r => r.status !== 'processing')
  const allDocsReady =
    readyRows.length > 0 &&
    readyRows.every(r => r.documentsTotal === 0 || r.documentsComplete >= r.documentsTotal)

  const idColumnLabel = singleListing ? 'GLTS no.' : 'Applicant no.'
  const showSummaryColumn = Boolean(summaryOverview)
  const showNavigateColumn = !readOnly && !selectionMode
  const tableHeaders = [
    idColumnLabel,
    'Traveler',
    'Passport no.',
    'Expiry',
    'Nationality',
    'Documents',
    ...(showSummaryColumn ? ['Summary'] : []),
    ...(showNavigateColumn ? [''] : []),
  ]

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
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: showSummaryColumn ? 760 : 640 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: colors.surface }}>
            {tableHeaders.map(h => (
              <TableCell
                key={h || 'act'}
                align={h === 'Summary' ? 'center' : 'inherit'}
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  py: 1.25,
                  width: h === 'Summary' ? 72 : undefined,
                  whiteSpace: 'nowrap',
                }}
              >
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
                {showSummaryColumn ? (
                  <TableCell align="center" sx={{ width: 72 }}>
                    {summaryOverview && !isProcessing ? (
                      <ApplicationSummaryPopover
                        overview={summaryOverview}
                        row={row}
                        singleListing={singleListing}
                        verifyContext={
                          summaryDetail && summaryApplicationId
                            ? { detail: summaryDetail, applicationId: summaryApplicationId }
                            : undefined
                        }
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                ) : null}
                {showNavigateColumn ? (
                  <TableCell align="right" sx={{ width: 48 }}>
                    {!isProcessing ? (
                      <IconButton size="small" aria-label="Open applicant documents">
                        <ChevronRight size={16} />
                      </IconButton>
                    ) : null}
                  </TableCell>
                ) : null}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </Box>

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
              disabled={strict && (processed === 0 || !allDocsReady)}
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
