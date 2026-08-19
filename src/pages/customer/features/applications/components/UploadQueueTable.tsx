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
  Tooltip,
} from '@mui/material'
import {
  usePublicBrandColors,
  getOutlinedButtonSx,
  mergeButtonSx,
} from '@/shared/theme/publicBrand'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { formatQueueRowGltsLabel } from '../utils/gltsReferenceIds'
import { resolvePassengerDesignation, resolvePassengerRank } from '../utils/applicantBasicDetailsUtils'
import { useApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import {
  getTravelerRoleColumnLabel,
  showsTravelerRoleColumn,
} from '@/shared/utils/applicationSegmentListingPolicy'
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

function documentActionCopy(complete: number, total: number): { short: string; full: string } {
  if (total === 0) return { short: 'Docs', full: 'Open documents' }
  if (complete >= total) return { short: 'Review', full: 'Review documents' }
  if (complete > 0) return { short: 'Update', full: 'Update documents' }
  return { short: 'Upload', full: 'Upload documents' }
}

interface UploadQueueTableProps {
  rows: UploadQueueRow[]
  selectedId: string | null
  onSelect: (id: string) => void
  /** Review step — no row navigation or footer CTA */
  readOnly?: boolean
  /** Submit step — row click selects for summary below (no drawer action) */
  selectionMode?: boolean
  /** One traveler — compact labels */
  singleListing?: boolean
  gltsApplicationId?: string
  gltsBatchId?: string
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
  readOnly = false,
  selectionMode = false,
  singleListing = false,
  gltsApplicationId,
  gltsBatchId,
  summaryOverview,
  summaryDetail,
  summaryApplicationId,
}: UploadQueueTableProps) {
  const colors = usePublicBrandColors()
  const { customerSegment } = useApplicationFlowPolicy()
  const showTravelerRole = showsTravelerRoleColumn(customerSegment)
  const travelerRoleLabel = getTravelerRoleColumnLabel(customerSegment)
  const verified = rows.filter(r => r.status === 'verified').length
  const needsReview = rows.filter(r => r.status === 'needs_review').length
  const processing = rows.filter(r => r.status === 'processing').length
  const processed = rows.filter(r => r.status !== 'processing').length

  const idColumnLabel = singleListing ? 'GLTS no.' : 'Applicant no.'
  const showSummaryColumn = Boolean(summaryOverview)
  const showNavigateColumn = !readOnly && !selectionMode
  const tableHeaders = [
    idColumnLabel,
    ...(showTravelerRole ? [travelerRoleLabel] : []),
    'Traveler',
    'Passport no.',
    'Expiry',
    'Nationality',
    'Documents',
    ...(showSummaryColumn ? ['Summary'] : []),
    ...(showNavigateColumn ? ['Action'] : []),
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
                key={h}
                align={h === 'Summary' || h === 'Action' ? 'center' : 'inherit'}
                sx={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: colors.textMuted,
                  py: 1.25,
                  width: h === 'Summary' || h === 'Action' ? 72 : undefined,
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
            const docAction = documentActionCopy(row.documentsComplete, row.documentsTotal)
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
                {showTravelerRole ? (
                  <TableCell sx={{ fontSize: '12px' }}>
                    {isProcessing
                      ? '—'
                      : customerSegment === 'marine'
                        ? resolvePassengerRank(row) || '—'
                        : resolvePassengerDesignation(row) || '—'}
                  </TableCell>
                ) : null}
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
                  <TableCell align="center" sx={{ width: 72, whiteSpace: 'nowrap' }}>
                    {!isProcessing ? (
                      <Tooltip title={docAction.full}>
                        <Button
                          size="small"
                          variant="outlined"
                          aria-label={docAction.full}
                          onClick={e => {
                            e.stopPropagation()
                            onSelect(row.id)
                          }}
                          sx={mergeButtonSx(getOutlinedButtonSx(), {
                            fontSize: 11,
                            fontWeight: 700,
                            minWidth: 0,
                            px: 1,
                            py: 0.25,
                            height: 26,
                            lineHeight: 1.2,
                            color: colors.greenDark,
                            borderColor: colors.greenBright,
                            bgcolor: 'transparent',
                            '&:hover': {
                              borderColor: colors.greenDark,
                              bgcolor: colors.greenMuted,
                              color: colors.greenDark,
                            },
                          })}
                        >
                          {docAction.short}
                        </Button>
                      </Tooltip>
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
          direction="row"
          alignItems="center"
          sx={{ px: 2.5, py: 1.75, bgcolor: colors.surface }}
        >
          <Typography sx={{ fontSize: '12px', color: colors.textSecondary }}>
            {singleListing
              ? `${processed === 1 ? '1 applicant ready' : 'Processing passport…'}`
              : `${verified} verified · ${needsReview} needs review · ${processing} processing`}
          </Typography>
        </Stack>
      )}
    </Box>
  )
}
