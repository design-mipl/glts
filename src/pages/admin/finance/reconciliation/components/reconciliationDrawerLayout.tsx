import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

export const RECONCILIATION_DRAWER_WIDTH = 560

export function ReconciliationMetaItem({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <Stack spacing={0.25} minWidth={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 11 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.35,
          wordBreak: 'break-word',
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        }}
      >
        {value?.trim() ? value : '—'}
      </Typography>
    </Stack>
  )
}

export function ReconciliationSectionHeading({ children }: { children: string }) {
  return (
    <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12, color: 'text.primary' }}>
      {children}
    </Typography>
  )
}

export function ReconciliationSummaryCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        px: 1.75,
        py: 1.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'action.hover',
      }}
    >
      <Stack spacing={1.25}>
        <ReconciliationSectionHeading>{title}</ReconciliationSectionHeading>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 2, rowGap: 1.5 }}>
          {children}
        </Box>
      </Stack>
    </Box>
  )
}

export function ReconciliationStatusFootnotes({
  isSubmitted,
  isRejected,
  reconciledBy,
  reconciledAt,
  rejectionReason,
}: {
  isSubmitted: boolean
  isRejected: boolean
  reconciledBy?: string
  reconciledAt?: string
  rejectionReason?: string
}) {
  return (
    <>
      {isSubmitted ? (
        <Typography variant="caption" color="text.secondary">
          Submitted by {reconciledBy || '—'} on {formatDisplayDate(reconciledAt)}
        </Typography>
      ) : null}
      {isRejected ? (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
            Rejected by {reconciledBy || '—'} on {formatDisplayDate(reconciledAt)}
          </Typography>
          {rejectionReason ? (
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              Reason: {rejectionReason}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
    </>
  )
}

export function ReconciliationDrawerFooter({
  onClose,
  isPending,
  onReject,
  onSubmit,
  submitting,
  rejecting,
  submitDisabled,
}: {
  onClose: () => void
  isPending: boolean
  onReject: () => void
  onSubmit: () => void
  submitting: boolean
  rejecting: boolean
  submitDisabled?: boolean
}) {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
      <Button label="Close" variant="neutral" onClick={onClose} />
      {isPending ? (
        <>
          <Button
            label="Reject"
            variant="contained"
            color="error"
            onClick={onReject}
            disabled={submitting || rejecting}
          />
          <Button
            label="Submit"
            variant="contained"
            onClick={onSubmit}
            disabled={submitting || rejecting || submitDisabled}
            loading={submitting}
          />
        </>
      ) : null}
    </Stack>
  )
}
