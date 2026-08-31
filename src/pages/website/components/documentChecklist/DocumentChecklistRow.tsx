import { Box, Stack, Typography } from '@mui/material'
import { AlertCircle, Check, CircleHelp, Loader2, Upload } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
} from '@/pages/website/theme/applyFlowTheme'
import { StatusPill, type ApplyStatusTone } from '@/pages/website/theme/applyFormControls'

export type DocumentChecklistStatusTone = 'original' | 'completed' | 'neutral'

interface DocumentChecklistRowProps {
  icon: LucideIcon
  name: string
  description?: string
  completed?: boolean
  optional?: boolean
  onInfoClick: () => void
  /** Required when no `statusTag` — drives the Upload control. */
  onFileSelect?: (file: File) => void
  /**
   * When set, replaces Upload / Completed (e.g. Original Documents step
   * with an "Original required" annotation).
   */
  statusTag?: {
    label: string
    tone?: DocumentChecklistStatusTone
  }
  /**
   * Verification state after a file arrives. `verifying` while we read it, `error` when it
   * could not be read — an errored row keeps its Upload control so the fix is one click,
   * rather than sending the person back to a separate error screen.
   */
  status?: 'verifying' | 'error'
  /** Shown in place of `description` when `status` is `error`. */
  errorHint?: string
  /**
   * Tighter vertical rhythm for long lists. A fifteen-document checklist at the default
   * spacing is mostly whitespace and forces scrolling past what you came to check.
   */
  dense?: boolean
}

function pillTone(tone: DocumentChecklistStatusTone): ApplyStatusTone {
  if (tone === 'original') return 'attention'
  if (tone === 'completed') return 'done'
  return 'idle'
}

/**
 * One document in a checklist.
 *
 * Rows are separated by hairlines rather than being individually rounded and hover-filled —
 * a checklist is a list, and boxing each line made twelve documents read as twelve cards.
 * The icon uses one neutral treatment for every document type (no per-type colour), and
 * green appears only once a file is actually in.
 */
export function DocumentChecklistRow({
  icon: Icon,
  name,
  description,
  completed = false,
  optional = false,
  onInfoClick,
  onFileSelect,
  statusTag,
  status,
  errorHint,
  dense = false,
}: DocumentChecklistRowProps) {
  const isVerifying = status === 'verifying'
  const isError = status === 'error'

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={dense ? 2.5 : 3}
      sx={{
        px: 0,
        py: dense ? 1.5 : 2.5,
        minHeight: dense ? 44 : undefined,
        borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: dense ? 26 : 32,
          height: dense ? 26 : 32,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          backgroundColor: applyFlow.canvas,
          border: `1px solid ${
            isError
              ? 'rgba(180, 35, 24, 0.4)'
              : completed
                ? applyFlow.successBorder
                : isVerifying
                  ? applyFlow.accentBorder
                  : applyFlow.hairline
          }`,
          color: isError
            ? applyFlow.critical
            : completed
              ? applyFlow.success
              : isVerifying
                ? applyFlow.accentInk
                : applyFlow.inkMuted,
          transition: `border-color 180ms ${applyMotion.easeOut}, color 180ms ${applyMotion.easeOut}`,
        }}
      >
        {isVerifying ? (
          <Loader2
            size={dense ? 12 : 14}
            strokeWidth={2.4}
            style={{ animation: 'docSpin 900ms linear infinite' }}
          />
        ) : isError ? (
          <AlertCircle size={dense ? 12 : 14} strokeWidth={2.2} />
        ) : completed ? (
          <Check size={dense ? 12 : 14} strokeWidth={3} />
        ) : (
          <Icon size={dense ? 12 : 14} strokeWidth={1.8} />
        )}
        <Box
          component="style"
          // Scoped keyframe for the verifying spinner.
          dangerouslySetInnerHTML={{
            __html: '@keyframes docSpin{to{transform:rotate(360deg)}}',
          }}
        />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: dense ? 13 : 13.5,
              fontWeight: 600,
              color: applyFlow.ink,
              lineHeight: 1.3,
            }}
          >
            {name}
            {optional ? (
              <Box component="span" sx={{ color: applyFlow.inkFaint, fontWeight: 400 }}>
                {' '}
                · optional
              </Box>
            ) : null}
          </Typography>
          <Box
            component="button"
            type="button"
            aria-label={`Why we ask for ${name}`}
            onClick={onInfoClick}
            sx={{
              appearance: 'none',
              border: 'none',
              background: 'none',
              p: 0,
              m: 0,
              cursor: 'pointer',
              color: applyFlow.inkFaint,
              display: 'inline-flex',
              flexShrink: 0,
              transition: `color 150ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { color: applyFlow.accentInk },
              },
              '&:focus-visible': {
                outline: 'none',
                color: applyFlow.accentInk,
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
                borderRadius: '50%',
              },
            }}
          >
            <CircleHelp size={13} />
          </Box>
        </Stack>
        {isError || description ? (
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 12,
              color: isError ? applyFlow.critical : applyFlow.inkMuted,
              mt: 0.5,
              lineHeight: 1.45,
            }}
          >
            {isError ? errorHint || "We couldn't read that file. Try a clearer scan or a PDF." : description}
          </Typography>
        ) : null}
      </Box>

      {isVerifying ? (
        <StatusPill tone="idle">Processing</StatusPill>
      ) : statusTag ? (
        <StatusPill tone={pillTone(statusTag.tone ?? 'neutral')}>{statusTag.label}</StatusPill>
      ) : completed ? (
        <StatusPill tone="done">Uploaded</StatusPill>
      ) : (
        <Box
          component="label"
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.25,
            minHeight: 36,
            '@media (pointer: coarse)': { minHeight: 44 },
            px: 3,
            borderRadius: applyRadius.chip,
            border: `1px solid ${isError ? 'rgba(180, 35, 24, 0.45)' : applyFlow.accentBorder}`,
            backgroundColor: isError ? applyFlow.criticalSoft : applyFlow.accentSoft,
            color: isError ? applyFlow.critical : applyFlow.accentInk,
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: onFileSelect ? 'pointer' : 'default',
            transition: `background-color 150ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { backgroundColor: `rgba(254, 193, 7, 0.22)` },
            },
            '&:active': { transform: 'scale(0.97)' },
            '&:focus-within': {
              borderColor: applyFlow.accent,
              boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
            },
          }}
        >
          <Upload size={12} strokeWidth={2.2} /> {isError ? 'Upload again' : 'Upload'}
          {onFileSelect ? (
            <input
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onFileSelect(file)
              }}
            />
          ) : null}
        </Box>
      )}
    </Stack>
  )
}
