import { Box, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Timeline as DsTimeline } from '@/design-system/UIComponents'
import {
  Badge,
  Button,
  Progress,
  ScrollArea,
  Separator,
} from '../shadcn'
import { ExecutiveCard } from '../cards'
import { UI_KIT_SPACING } from '../tokens'
import { clampProgress } from '../utils'
import type { UiKitListItem, UiKitRankItem, UiKitStateProps } from '../types'

function badgeVariantForTone(
  tone?: UiKitListItem['badgeTone'],
): 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline' {
  switch (tone) {
    case 'positive':
      return 'success'
    case 'negative':
      return 'destructive'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'primary':
      return 'default'
    default:
      return 'secondary'
  }
}

function FeedList({
  items,
  maxItems,
  onShowMore,
  showMoreLabel,
  emptyText,
}: {
  items: UiKitListItem[]
  maxItems: number
  onShowMore?: () => void
  showMoreLabel: string
  emptyText: string
}) {
  const visible = items.slice(0, maxItems)

  if (visible.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        {emptyText}
      </Typography>
    )
  }

  return (
    <Stack spacing={0}>
      <ScrollArea style={{ maxHeight: 360 }}>
        <Stack spacing={0} divider={<Separator />}>
          {visible.map((item) => (
            <Box
              key={item.id}
              component={item.onClick ? 'button' : 'div'}
              type={item.onClick ? 'button' : undefined}
              onClick={item.onClick}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: UI_KIT_SPACING.field,
                width: '100%',
                textAlign: 'left',
                border: 'none',
                background: 'transparent',
                cursor: item.onClick ? 'pointer' : 'default',
                font: 'inherit',
                color: 'inherit',
                py: 1.5,
                px: 0.25,
                borderRadius: 1,
                '&:hover': item.onClick
                  ? { bgcolor: 'action.hover' }
                  : undefined,
                '&:focus-visible': {
                  outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {item.primary}
                </Typography>
                {[item.secondary, item.meta].filter(Boolean).length > 0 ? (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {[item.secondary, item.meta].filter(Boolean).join(' · ')}
                  </Typography>
                ) : null}
              </Box>
              {item.badgeLabel ? (
                <Badge variant={badgeVariantForTone(item.badgeTone)} sx={{ flexShrink: 0 }}>
                  {item.badgeLabel}
                </Badge>
              ) : null}
            </Box>
          ))}
        </Stack>
      </ScrollArea>
      {onShowMore && items.length > maxItems ? (
        <Box sx={{ pt: UI_KIT_SPACING.field }}>
          <Button variant="ghost" size="sm" type="button" onClick={onShowMore}>
            {showMoreLabel}
          </Button>
        </Box>
      ) : null}
    </Stack>
  )
}

export interface ActivityFeedProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  items: UiKitListItem[]
  maxItems?: number
  onShowMore?: () => void
  sx?: SxProps<Theme>
}

export function ActivityFeed({
  title = 'Recent activity',
  subtitle,
  items,
  maxItems = 8,
  onShowMore,
  sx,
  loading,
  ...state
}: ActivityFeedProps) {
  return (
    <ExecutiveCard
      {...state}
      title={title}
      subtitle={subtitle}
      sx={sx}
      loading={loading}
      empty={state.empty ?? (!loading && items.length === 0)}
      emptyTitle="No recent activity"
    >
      <FeedList
        items={items}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all"
        emptyText="No recent activity"
      />
    </ExecutiveCard>
  )
}

export interface AlertPanelProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  items: UiKitListItem[]
  maxItems?: number
  onShowMore?: () => void
  sx?: SxProps<Theme>
}

export function AlertPanel({
  title = 'Alerts',
  subtitle,
  items,
  maxItems = 6,
  onShowMore,
  sx,
  loading,
  ...state
}: AlertPanelProps) {
  return (
    <ExecutiveCard
      {...state}
      title={title}
      subtitle={subtitle}
      sx={sx}
      loading={loading}
      empty={state.empty ?? (!loading && items.length === 0)}
      emptyTitle="No alerts"
    >
      <FeedList
        items={items}
        maxItems={maxItems}
        onShowMore={onShowMore}
        showMoreLabel="View all alerts"
        emptyText="No alerts"
      />
    </ExecutiveCard>
  )
}

export function RiskList(props: AlertPanelProps) {
  return <AlertPanel title={props.title ?? 'Risks'} {...props} />
}

export interface RecommendationPanelProps extends UiKitStateProps {
  title?: string
  items: UiKitListItem[]
  onItemAction?: (id: string) => void
  sx?: SxProps<Theme>
}

export function RecommendationPanel({
  title = 'Recommendations',
  items,
  onItemAction,
  sx,
  ...state
}: RecommendationPanelProps) {
  return (
    <ExecutiveCard {...state} title={title} sx={sx} empty={state.empty ?? items.length === 0}>
      <Stack spacing={0} divider={<Separator />}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={UI_KIT_SPACING.field}
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 1.25 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}>
                {item.primary}
              </Typography>
              {item.secondary ? (
                <Typography variant="caption" color="text.secondary">
                  {item.secondary}
                </Typography>
              ) : null}
            </Box>
            {onItemAction ? (
              <Button variant="ghost" size="sm" type="button" onClick={() => onItemAction(item.id)}>
                Open
              </Button>
            ) : null}
          </Stack>
        ))}
      </Stack>
    </ExecutiveCard>
  )
}

export interface RankingListProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  items: UiKitRankItem[]
  sx?: SxProps<Theme>
}

export function RankingList({
  title = 'Ranking',
  subtitle,
  items,
  sx,
  ...state
}: RankingListProps) {
  return (
    <ExecutiveCard
      {...state}
      title={title}
      subtitle={subtitle}
      sx={sx}
      empty={state.empty ?? items.length === 0}
    >
      <Stack spacing={UI_KIT_SPACING.cluster}>
        {items.map((item, index) => (
          <Box key={item.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {item.rank ?? index + 1}. {item.primary}
              </Typography>
              {item.value != null ? (
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {item.value}
                </Typography>
              ) : null}
            </Stack>
            {item.progress != null ? (
              <Box sx={{ mt: 1 }}>
                <Progress value={clampProgress(item.progress)} />
              </Box>
            ) : null}
          </Box>
        ))}
      </Stack>
    </ExecutiveCard>
  )
}

export function TopClientList(props: RankingListProps) {
  return <RankingList title={props.title ?? 'Top clients'} {...props} />
}

export interface KitTimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  status?: 'completed' | 'active' | 'pending' | 'error'
}

export interface KitTimelineProps extends UiKitStateProps {
  title?: string
  subtitle?: string
  events: KitTimelineEvent[]
  sx?: SxProps<Theme>
}

export function KitTimeline({
  title = 'Timeline',
  subtitle,
  events,
  sx,
  ...state
}: KitTimelineProps) {
  return (
    <ExecutiveCard
      {...state}
      title={title}
      subtitle={subtitle}
      sx={sx}
      empty={state.empty ?? events.length === 0}
    >
      <DsTimeline
        items={events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          status: event.status,
        }))}
        orientation="vertical"
        loading={state.loading}
      />
    </ExecutiveCard>
  )
}

/** Catalog name `Timeline` — wraps DS Timeline inside ExecutiveCard. */
export { KitTimeline as Timeline }

export interface RankingBadgeProps {
  label: string
  tone?: 'success' | 'warning' | 'error' | 'info' | 'neutral'
}

export function RankingBadge({ label, tone = 'neutral' }: RankingBadgeProps) {
  const variant =
    tone === 'success'
      ? 'success'
      : tone === 'warning'
        ? 'warning'
        : tone === 'error'
          ? 'destructive'
          : tone === 'info'
            ? 'info'
            : 'secondary'
  return <Badge variant={variant}>{label}</Badge>
}
