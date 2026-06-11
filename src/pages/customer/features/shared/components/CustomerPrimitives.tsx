import { Box, Card, Chip, LinearProgress, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, AlertTriangle, CheckCircle2, Circle, Clock, FileText } from 'lucide-react'
import { Button, Tabs } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { publicShadows, usePublicBrandColors, type PublicBrandColors } from '@/shared/theme/publicBrand'

export type CustomerTone = 'success' | 'warning' | 'info' | 'critical' | 'neutral'

function getToneStyles(colors: PublicBrandColors): Record<CustomerTone, { bg: string; text: string; border: string }> {
  return {
  success: { bg: colors.greenMuted, text: colors.greenDark, border: 'rgba(115, 192, 100, 0.24)' },
  warning: { bg: 'rgba(245, 158, 11, 0.14)', text: '#B45309', border: 'rgba(245, 158, 11, 0.26)' },
  info: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563EB', border: 'rgba(59, 130, 246, 0.24)' },
  critical: { bg: 'rgba(239, 68, 68, 0.12)', text: '#DC2626', border: 'rgba(239, 68, 68, 0.24)' },
  neutral: { bg: colors.surfaceAlt, text: colors.textSecondary, border: colors.border },
  }
}

// Shared by customer listing/detail pages when mapping backend statuses to UI tones.
// eslint-disable-next-line react-refresh/only-export-components
export function getCustomerStatusTone(status?: string): CustomerTone {
  const normalized = (status ?? '').toLowerCase()
  if (normalized.includes('approved') || normalized.includes('valid') || normalized.includes('active') || normalized.includes('uploaded') || normalized.includes('verified') || normalized.includes('completed')) return 'success'
  if (normalized.includes('pending') || normalized.includes('missing') || normalized.includes('review') || normalized.includes('correction') || normalized.includes('invalid')) return 'warning'
  if (normalized.includes('reject') || normalized.includes('error') || normalized.includes('disabled')) return 'critical'
  if (normalized.includes('submit') || normalized.includes('processing') || normalized.includes('progress') || normalized.includes('embassy')) return 'info'
  return 'neutral'
}

export interface CustomerPageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
  badge?: string
  meta?: ReactNode
  action?: ReactNode
}

export function CustomerPageHeader({ title, subtitle, eyebrow, badge, meta, action }: CustomerPageHeaderProps) {
  const colors = usePublicBrandColors()

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={2}
      sx={{ mb: 2.5 }}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: eyebrow || badge ? 0.75 : 0 }}>
          {eyebrow && (
            <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: colors.greenDark, textTransform: 'uppercase' }}>
              {eyebrow}
            </Typography>
          )}
          {badge && <CustomerStatusChip label={badge} tone="info" />}
        </Stack>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, md: 28 }, color: colors.navy, lineHeight: 1.15 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.75, fontSize: 14, color: colors.textSecondary, maxWidth: 720 }}>
            {subtitle}
          </Typography>
        )}
        {meta && <Box sx={{ mt: 1.75 }}>{meta}</Box>}
      </Box>
      {action && <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>{action}</Box>}
    </Stack>
  )
}

export interface CustomerCardProps {
  title?: string
  subtitle?: string
  icon?: LucideIcon
  action?: ReactNode
  children: ReactNode
  tone?: CustomerTone
  sx?: object
}

export function CustomerCard({ title, subtitle, icon: Icon, action, children, tone, sx }: CustomerCardProps) {
  const colors = usePublicBrandColors()
  const toneStyles = getToneStyles(colors)
  const toneStyle = tone ? toneStyles[tone] : null
  return (
    <Card
      elevation={0}
      sx={{
        border: `${BORDER_WIDTH.thin} solid ${toneStyle?.border ?? colors.border}`,
        borderRadius: BORDER_RADIUS.xl,
        boxShadow: publicShadows.card,
        bgcolor: colors.white,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {(title || subtitle || action || Icon) && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${colors.border}` }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
            {Icon && (
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: BORDER_RADIUS.lg,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: toneStyle?.bg ?? colors.greenMuted,
                  color: toneStyle?.text ?? colors.greenDark,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
              {title && <Typography sx={{ fontWeight: 800, fontSize: 15, color: colors.navy }}>{title}</Typography>}
              {subtitle && <Typography sx={{ fontSize: 12, color: colors.textMuted }}>{subtitle}</Typography>}
            </Box>
          </Stack>
          {action}
        </Stack>
      )}
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Card>
  )
}

export interface CustomerStatusChipProps {
  label: string
  tone?: CustomerTone
  size?: 'sm' | 'md'
}

export function CustomerStatusChip({ label, tone = getCustomerStatusTone(label), size = 'sm' }: CustomerStatusChipProps) {
  const colors = usePublicBrandColors()
  const toneStyles = getToneStyles(colors)
  const cfg = toneStyles[tone]
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: size === 'sm' ? 22 : 26,
        borderRadius: BORDER_RADIUS.full,
        border: `1px solid ${cfg.border}`,
        bgcolor: cfg.bg,
        color: cfg.text,
        fontSize: size === 'sm' ? 11 : 12,
        fontWeight: 800,
      }}
    />
  )
}

export interface CustomerTimelineItem {
  id: string
  title: string
  description?: string
  status: 'completed' | 'in_progress' | 'pending' | 'blocked'
  timestamp?: string
}

const timelineIcon = {
  completed: CheckCircle2,
  in_progress: Clock,
  pending: Circle,
  blocked: AlertCircle,
}

const timelineTone: Record<CustomerTimelineItem['status'], CustomerTone> = {
  completed: 'success',
  in_progress: 'info',
  pending: 'neutral',
  blocked: 'critical',
}

export function CustomerTimeline({ items }: { items: CustomerTimelineItem[] }) {
  const colors = usePublicBrandColors()
  const toneStyles = getToneStyles(colors)

  return (
    <Stack spacing={0}>
      {items.map((item, index) => {
        const tone = toneStyles[timelineTone[item.status]]
        const Icon = timelineIcon[item.status]
        const last = index === items.length - 1
        return (
          <Stack key={item.id} direction="row" spacing={1.5} alignItems="flex-start">
            <Stack alignItems="center" sx={{ pt: 0.25 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: BORDER_RADIUS.full,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: tone.bg,
                  color: tone.text,
                  border: `1px solid ${tone.border}`,
                }}
              >
                <Icon size={15} />
              </Box>
              {!last && <Box sx={{ width: 2, minHeight: 36, bgcolor: colors.border, my: 0.5 }} />}
            </Stack>
            <Box sx={{ flex: 1, pb: last ? 0 : 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.navy }}>{item.title}</Typography>
              {(item.description || item.timestamp) && (
                <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.textMuted }}>
                  {[item.description, item.timestamp].filter(Boolean).join(' · ')}
                </Typography>
              )}
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}

export interface CustomerInfoField {
  label: string
  value: ReactNode
}

export function CustomerReadonlyField({ label, value }: CustomerInfoField) {
  const colors = usePublicBrandColors()

  return (
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy }}>{value}</Typography>
    </Box>
  )
}

export function CustomerInfoGrid({ items, columns = 2 }: { items: CustomerInfoField[]; columns?: 1 | 2 | 3 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, minmax(0, 1fr))` },
        gap: 2.25,
      }}
    >
      {items.map(item => <CustomerReadonlyField key={item.label} {...item} />)}
    </Box>
  )
}

export interface CustomerChecklistItem {
  id: string
  label: string
  required?: boolean
  status: 'uploaded' | 'missing' | 'invalid' | 'pending' | 'verified'
  /** Overrides chip text when set (e.g. workflow-specific travel ticket / insurance status). */
  statusLabel?: string
  reviewComment?: string
}

const CUSTOMER_DOCUMENT_CHECKLIST_GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  gap: 1.5,
} as const

function CustomerDocumentChecklistItemCard({
  item,
  onReuploadItem,
}: {
  item: CustomerChecklistItem
  onReuploadItem?: (item: CustomerChecklistItem) => void
}) {
  const colors = usePublicBrandColors()
  const isInvalid = item.status === 'invalid'
  const isMissing = item.status === 'missing'
  const showUploadAction = isInvalid || isMissing
  const showComment = Boolean(item.reviewComment?.trim()) && (isInvalid || isMissing)
  const statusLabel =
    item.statusLabel ??
    (item.status === 'invalid' ? 'marked invalid' : item.status.replace('_', ' '))

  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: SHADOWS.sm,
        bgcolor: colors.white,
      }}
    >
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Typography sx={{ minWidth: 0, flex: 1, fontSize: 13, fontWeight: item.required ? 700 : 600, color: colors.navy }}>
            {item.label}
            {item.required ? (
              <Typography component="span" sx={{ ml: 0.25, color: colors.textMuted, fontSize: 11 }}>
                *
              </Typography>
            ) : null}
          </Typography>
          <CustomerStatusChip
            label={statusLabel}
            tone={isInvalid ? 'critical' : getCustomerStatusTone(item.status)}
          />
        </Stack>

        {showComment ? (
          <Box
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: BORDER_RADIUS.md,
              bgcolor: colors.surfaceAlt,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5 }}>
              <Typography component="span" sx={{ fontWeight: 700, fontSize: 12, color: colors.navy }}>
                GLTS note:{' '}
              </Typography>
              {item.reviewComment}
            </Typography>
          </Box>
        ) : null}

        {showUploadAction && onReuploadItem ? (
          <Box sx={{ mt: 'auto', pt: showComment ? 0 : 0.5 }}>
            <Button variant="outlined" size="sm" onClick={() => onReuploadItem(item)}>
              Upload document
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Card>
  )
}

function isRejectedCustomerChecklistItem(item: CustomerChecklistItem): boolean {
  return item.status === 'invalid'
}

export function CustomerDocumentChecklist({
  country,
  title,
  items,
  onReuploadItem,
}: {
  country?: string
  title?: string
  items: CustomerChecklistItem[]
  onReuploadItem?: (item: CustomerChecklistItem) => void
}) {
  const colors = usePublicBrandColors()
  const cardTitle = title ?? (country ? `Checklist · ${country}` : 'Document checklist')
  const rejectedItems = items.filter(isRejectedCustomerChecklistItem)
  const remainingItems = items.filter(item => !isRejectedCustomerChecklistItem(item))

  return (
    <Stack spacing={2}>
      {rejectedItems.length > 0 ? (
        <Box
          sx={{
            p: 1.5,
            borderRadius: BORDER_RADIUS.lg,
            border: `1px solid rgba(239, 68, 68, 0.35)`,
            bgcolor: 'rgba(239, 68, 68, 0.06)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: BORDER_RADIUS.md,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'rgba(239, 68, 68, 0.12)',
                color: '#DC2626',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={16} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#DC2626' }}>
                Rejected documents
              </Typography>
              <Typography sx={{ fontSize: 12, color: colors.textSecondary }}>
                {rejectedItems.length} document{rejectedItems.length === 1 ? '' : 's'} need your attention.
              </Typography>
            </Box>
          </Stack>
          <Box sx={CUSTOMER_DOCUMENT_CHECKLIST_GRID_SX}>
            {rejectedItems.map(item => (
              <CustomerDocumentChecklistItemCard
                key={item.id}
                item={item}
                onReuploadItem={onReuploadItem}
              />
            ))}
          </Box>
        </Box>
      ) : null}

      {remainingItems.length > 0 ? (
        <CustomerCard title={cardTitle} subtitle="Required documents for this visa type" icon={FileText} tone="info">
          <Box sx={CUSTOMER_DOCUMENT_CHECKLIST_GRID_SX}>
            {remainingItems.map(item => (
              <CustomerDocumentChecklistItemCard
                key={item.id}
                item={item}
                onReuploadItem={onReuploadItem}
              />
            ))}
          </Box>
        </CustomerCard>
      ) : null}
    </Stack>
  )
}

export function CustomerEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  const colors = usePublicBrandColors()

  return (
    <Stack alignItems="center" textAlign="center" spacing={1.25} sx={{ py: 6, px: 2 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: BORDER_RADIUS.full, display: 'grid', placeItems: 'center', bgcolor: colors.greenMuted, color: colors.greenDark }}>
        <FileText size={22} />
      </Box>
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.navy }}>{title}</Typography>
      {description && <Typography sx={{ fontSize: 13, color: colors.textMuted, maxWidth: 420 }}>{description}</Typography>}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Stack>
  )
}

export function CustomerActionPanel({
  title,
  description,
  progress,
  action,
}: {
  title: string
  description?: string
  progress?: number
  action?: ReactNode
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: BORDER_RADIUS.xl,
        border: `1px solid ${colors.border}`,
        bgcolor: colors.surface,
        boxShadow: SHADOWS.xs,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy }}>{title}</Typography>
          {description && <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.textMuted }}>{description}</Typography>}
          {progress != null && <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.25, height: 6, borderRadius: BORDER_RADIUS.full }} />}
        </Box>
        {action}
      </Stack>
    </Box>
  )
}

export function CustomerTabs({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (value: string) => void
  items: { value: string; label: string; badge?: number | string }[]
}) {
  return <Tabs value={value} onChange={onChange} variant="underline" size="sm" items={items} sx={{ mb: 2 }} />
}
