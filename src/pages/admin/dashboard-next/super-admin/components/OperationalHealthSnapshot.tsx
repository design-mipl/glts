import { Box, Stack, Typography } from '@mui/material'
import { Button, Tooltip } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { StatusBadge } from '../../shared/widgets/StatusBadge'
import type { ApplicationPipelineStageData } from '../../shared/widgets/operations/ApplicationPipeline'
import type { ApplicationPipelineStageId } from '../../shared/config/applicationPipeline'
import type { DashboardStatusTone } from '../../shared/types'

export interface OperationalHealthSnapshotProps {
  stages: ApplicationPipelineStageData[]
  rejectedCount: number
  atRiskCount: number
  loading?: boolean
  onOpenOperations?: () => void
  onStageClick?: (stageId: string) => void
}

interface HealthCard {
  id: string
  label: string
  count: number
  percent: number
  tone: DashboardStatusTone
  stageId?: ApplicationPipelineStageId
}

function sumStages(
  stages: ApplicationPipelineStageData[],
  ids: ApplicationPipelineStageId[],
): number {
  return ids.reduce((acc, id) => {
    const stage = stages.find((s) => s.id === id)
    return acc + (stage?.count ?? 0)
  }, 0)
}

/** High-level ops status — does not replace Operations dashboard. */
export function OperationalHealthSnapshot({
  stages,
  rejectedCount,
  atRiskCount,
  loading,
  onOpenOperations,
  onStageClick,
}: OperationalHealthSnapshotProps) {
  const colors = usePublicBrandColors()
  const verification = sumStages(stages, ['verification_pending'])
  const submission = sumStages(stages, [
    'online_submission_pending',
    'pending_payment',
    'vfs_submission_pending',
  ])
  const collection = sumStages(stages, ['collection_pending'])
  const completed = sumStages(stages, ['collected', 'dispatched'])

  const volume = verification + submission + collection + completed + rejectedCount + atRiskCount
  const pct = (n: number) => (volume > 0 ? Math.round((n / volume) * 100) : 0)

  const cards: HealthCard[] = [
    {
      id: 'verification',
      label: 'Pending verification',
      count: verification,
      percent: pct(verification),
      tone: 'warning',
      stageId: 'verification_pending',
    },
    {
      id: 'submission',
      label: 'Pending submission',
      count: submission,
      percent: pct(submission),
      tone: 'info',
      stageId: 'online_submission_pending',
    },
    {
      id: 'collection',
      label: 'Pending collection',
      count: collection,
      percent: pct(collection),
      tone: 'warning',
      stageId: 'collection_pending',
    },
    {
      id: 'completed',
      label: 'Completed applications',
      count: completed,
      percent: pct(completed),
      tone: 'success',
      stageId: 'collected',
    },
    {
      id: 'rejected',
      label: 'Rejected applications',
      count: rejectedCount,
      percent: pct(rejectedCount),
      tone: rejectedCount > 0 ? 'error' : 'neutral',
    },
    {
      id: 'at-risk',
      label: 'Applications at risk (SLA)',
      count: atRiskCount,
      percent: pct(atRiskCount),
      tone: atRiskCount > 0 ? 'error' : 'success',
    },
  ]

  const empty = !loading && volume === 0

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Operational health snapshot
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Can operations handle today’s workload?
          </Typography>
        </Box>
        <Button label="Operations" variant="text" size="sm" onClick={onOpenOperations} />
      </Stack>

      <Box sx={{ px: 2, pb: 2 }}>
        {empty ? (
          <Typography variant="body2" color="text.secondary">
            No operational volume for the selected filters.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {/* Stacked share bar */}
            <Tooltip content="Share of operational volume by status" placement="top">
              <Stack
                direction="row"
                sx={{
                  height: 10,
                  borderRadius: 999,
                  overflow: 'hidden',
                  bgcolor: 'action.hover',
                }}
              >
                {cards
                  .filter((c) => c.percent > 0)
                  .map((card) => (
                    <Box
                      key={card.id}
                      sx={{
                        width: `${card.percent}%`,
                        bgcolor:
                          card.tone === 'success'
                            ? 'success.main'
                            : card.tone === 'error'
                              ? 'error.main'
                              : card.tone === 'warning'
                                ? 'warning.main'
                                : card.tone === 'info'
                                  ? 'info.main'
                                  : 'grey.500',
                        opacity: 0.85,
                      }}
                    />
                  ))}
              </Stack>
            </Tooltip>

            {cards.map((card) => {
              const hover = `${card.label}: ${card.count} · ${card.percent}%`
              const clickable = Boolean(card.stageId && onStageClick)
              return (
                <Tooltip key={card.id} content={hover} placement="top">
                  <Box
                    role={clickable ? 'button' : undefined}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={() => {
                      if (card.stageId) onStageClick?.(card.stageId)
                    }}
                    onKeyDown={(event) => {
                      if (!clickable || !card.stageId) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onStageClick?.(card.stageId)
                      }
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      px: 1.25,
                      py: 1,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                      cursor: clickable ? 'pointer' : 'default',
                      transition: 'border-color 120ms ease, background-color 120ms ease',
                      '&:hover': clickable
                        ? { borderColor: 'action.selected', bgcolor: 'action.hover' }
                        : undefined,
                    }}
                  >
                    <Box minWidth={0}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {card.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {loading ? '…' : `${card.percent}% of volume`}
                      </Typography>
                    </Box>
                    <StatusBadge label={loading ? '…' : String(card.count)} tone={card.tone} />
                  </Box>
                </Tooltip>
              )
            })}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
