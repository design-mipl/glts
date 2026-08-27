import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut } from '@/pages/website-v2/theme/retailFlowTokens'
import { useCameraCapture } from '../../hooks/useCameraCapture'
import type { RetailCapturedImage } from '../../types'
import { CaptureFlowShell, CaptureHeadline } from './CaptureFlowShell'
import { CaptureModeBar, type CaptureInputMode } from './CaptureModeBar'

interface PhotoCaptureFlowProps {
  applicantName: string
  initialImage?: RetailCapturedImage
  onConfirm: (image: RetailCapturedImage) => void
  onClose: () => void
}

const PHOTO_TIPS = [
  'Face fully visible, eyes open, neutral expression',
  'Plain light background, no shadows across the face',
  'Colour photo only, under 5MB',
] as const

function readFileAsImage(file: File): Promise<RetailCapturedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({ dataUrl: reader.result as string, capturedAt: new Date().toISOString() })
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function PhotoCaptureFlow({
  applicantName,
  initialImage,
  onConfirm,
  onClose,
}: PhotoCaptureFlowProps) {
  const colors = usePublicBrandColors()
  const fileRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'capture' | 'preview'>(initialImage ? 'preview' : 'capture')
  const [mode, setMode] = useState<CaptureInputMode>('live')
  const [draft, setDraft] = useState<RetailCapturedImage | undefined>(initialImage)
  const { videoRef, status, start, stop, capture } = useCameraCapture({ facingMode: 'user' })

  useEffect(() => {
    if (phase !== 'capture' || mode !== 'live') {
      stop()
      return
    }
    void start()
    return () => stop()
  }, [phase, mode, start, stop])

  useEffect(() => {
    if (phase === 'capture' && mode === 'upload') {
      fileRef.current?.click()
    }
  }, [phase, mode])

  async function handleFile(file: File) {
    const image = await readFileAsImage(file)
    stop()
    setDraft(image)
    setPhase('preview')
  }

  function handleCapture() {
    const dataUrl = capture()
    if (!dataUrl) return
    stop()
    setDraft({ dataUrl, capturedAt: new Date().toISOString() })
    setPhase('preview')
  }

  function handleRetake() {
    setDraft(undefined)
    setPhase('capture')
    setMode('live')
  }

  if (phase === 'preview' && draft) {
    return (
      <CaptureFlowShell
        onClose={onClose}
        applicantName={applicantName}
        badgeLabel="Capture photo"
        badgeIcon={Camera}
        size="md"
        contentMinHeight={{ xs: 480, sm: 520 }}
        header={<CaptureHeadline lead="Look ahead," accent="straight at the camera" />}
        footer={
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              width: '100%',
              maxWidth: 480,
              mx: 'auto',
              justifyContent: 'center',
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={handleRetake}
              sx={pillButtonSx(colors, 'ghost')}
            >
              Retake
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => onConfirm(draft)}
              sx={pillButtonSx(colors, 'solid')}
            >
              Confirm
            </Box>
          </Box>
        }
      >
        <CaptureFrame>
          <Box
            component={motion.img}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            src={draft.dataUrl}
            alt="Photo preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: BORDER_RADIUS.md,
            }}
          />
        </CaptureFrame>
        <TipList tips={PHOTO_TIPS} muted={colors.textMuted} />
      </CaptureFlowShell>
    )
  }

  return (
    <CaptureFlowShell
      onClose={onClose}
      applicantName={applicantName}
      badgeLabel="Capture photo"
      badgeIcon={Camera}
      size="md"
      contentMinHeight={{ xs: 480, sm: 520 }}
      header={<CaptureHeadline lead="Look ahead," accent="straight at the camera" />}
      footer={<CaptureModeBar mode={mode} onChange={setMode} />}
    >
      <CaptureFrame>
        {mode === 'live' && status === 'live' ? (
          <Box
            component="video"
            ref={videoRef}
            muted
            playsInline
            autoPlay
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)',
              borderRadius: BORDER_RADIUS.md,
            }}
          />
        ) : (
          <Box sx={{ textAlign: 'center', px: 3 }}>
            <Camera size={28} color="rgba(255,255,255,0.55)" />
            <Typography sx={{ mt: 1, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
              {status === 'starting' && 'Starting camera…'}
              {status === 'denied' && 'Camera denied — upload from device instead.'}
              {status === 'unavailable' && 'Camera unavailable — upload from device instead.'}
              {(status === 'idle' || mode === 'upload') && 'Position your face in the frame'}
            </Typography>
          </Box>
        )}
      </CaptureFrame>

      <TipList tips={PHOTO_TIPS} muted={colors.textMuted} />

      {mode === 'live' && status === 'live' ? (
        <Button
          label="Capture photo"
          variant="contained"
          color="primary"
          startIcon={<Camera size={16} />}
          onClick={handleCapture}
          sx={{
            mt: 2.5,
            minWidth: 180,
            transition: `transform 160ms ${retailFlowEaseOut}`,
            '&:active': { transform: 'scale(0.97)' },
          }}
        />
      ) : null}

      <Box
        component="input"
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0]
          if (!file) {
            setMode('live')
            return
          }
          await handleFile(file)
          ;(event.target as HTMLInputElement).value = ''
        }}
      />
    </CaptureFlowShell>
  )
}

function CaptureFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'min(100%, 348px)',
        height: 400,
        bgcolor: '#0B1220',
        borderRadius: BORDER_RADIUS.xl,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2.5,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 14,
          borderRadius: BORDER_RADIUS.lg,
          border: '2px solid rgba(255, 255, 255, 0.92)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: BORDER_RADIUS.md,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

function TipList({ tips, muted }: { tips: readonly string[]; muted: string }) {
  return (
    <Box
      component="ul"
      sx={{
        mt: 2.5,
        mb: 0,
        pl: 2.25,
        maxWidth: 440,
        textAlign: 'left',
        listStyleType: 'disc',
      }}
    >
      {tips.map((tip) => (
        <Typography
          key={tip}
          component="li"
          sx={{
            fontSize: 13,
            lineHeight: 1.45,
            color: muted,
            mb: 0.5,
            '&:last-child': { mb: 0 },
          }}
        >
          {tip}
        </Typography>
      ))}
    </Box>
  )
}

function pillButtonSx(
  colors: ReturnType<typeof usePublicBrandColors>,
  variant: 'solid' | 'ghost',
) {
  return {
    appearance: 'none' as const,
    flex: 1,
    border: variant === 'ghost' ? `1px solid ${colors.border}` : 'none',
    bgcolor: variant === 'solid' ? colors.navy : colors.white,
    color: variant === 'solid' ? '#fff' : colors.navy,
    borderRadius: 999,
    py: 1.35,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: `transform 160ms ${retailFlowEaseOut}, background-color 150ms ease`,
    '&:active': { transform: 'scale(0.97)' },
  }
}
