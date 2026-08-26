import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Camera } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useCameraCapture } from '../../hooks/useCameraCapture'
import type { RetailCapturedImage } from '../../types'
import { CaptureFlowShell, CaptureHeadline } from './CaptureFlowShell'
import { CaptureModeBar, type CaptureInputMode } from './CaptureModeBar'

interface PhotoCaptureFlowProps {
  initialImage?: RetailCapturedImage
  onConfirm: (image: RetailCapturedImage) => void
  onClose: () => void
}

function readFileAsImage(file: File): Promise<RetailCapturedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () =>
      resolve({ dataUrl: reader.result as string, capturedAt: new Date().toISOString() })
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function PhotoCaptureFlow({ initialImage, onConfirm, onClose }: PhotoCaptureFlowProps) {
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
        size="lg"
        contentMinHeight={{ xs: 480, sm: 560 }}
        header={<CaptureHeadline lead="Look ahead," accent="straight at the camera" />}
        footer={
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              width: '100%',
              maxWidth: 420,
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
        <Box
          sx={{
            position: 'relative',
            width: 'min(100%, 360px)',
            aspectRatio: '1 / 1.15',
            bgcolor: 'transparent',
            borderRadius: BORDER_RADIUS.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2.5,
          }}
        >
          <CornerGuides />
          <Box
            component="img"
            src={draft.dataUrl}
            alt="Photo preview"
            sx={{
              width: '78%',
              height: '78%',
              objectFit: 'cover',
              borderRadius: BORDER_RADIUS.md,
            }}
          />
        </Box>
      </CaptureFlowShell>
    )
  }

  return (
    <CaptureFlowShell
      onClose={onClose}
      size="lg"
      contentMinHeight={{ xs: 480, sm: 560 }}
      header={<CaptureHeadline lead="Look ahead," accent="straight at the camera" />}
      footer={<CaptureModeBar mode={mode} onChange={setMode} />}
    >
      <Box
        sx={{
          position: 'relative',
          width: 'min(88vw, 400px)',
          aspectRatio: '1',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid rgba(115, 192, 100, 0.45)`,
          bgcolor: colors.surfaceAlt,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {mode === 'live' && status === 'live' ? (
          <Box
            component="video"
            ref={videoRef}
            muted
            playsInline
            autoPlay
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
        ) : (
          <Box sx={{ textAlign: 'center', px: 3 }}>
            <Camera size={28} color={colors.textMuted} />
            <Typography sx={{ mt: 1, fontSize: 13, color: colors.textMuted }}>
              {status === 'starting' && 'Starting camera…'}
              {status === 'denied' && 'Camera denied — upload from device instead.'}
              {status === 'unavailable' && 'Camera unavailable — upload from device instead.'}
              {(status === 'idle' || mode === 'upload') && 'Position your face in the circle'}
            </Typography>
          </Box>
        )}
      </Box>

      {mode === 'live' && status === 'live' ? (
        <Button
          label="Capture photo"
          variant="contained"
          color="primary"
          startIcon={<Camera size={16} />}
          onClick={handleCapture}
          sx={{ mt: 3, minWidth: 180 }}
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

function CornerGuides() {
  const arm = 18
  const thick = 2
  const color = 'rgba(15, 23, 42, 0.85)'
  const corner = (top: boolean, left: boolean) => (
    <Box
      sx={{
        position: 'absolute',
        top: top ? 14 : 'auto',
        bottom: top ? 'auto' : 28,
        left: left ? 28 : 'auto',
        right: left ? 'auto' : 28,
        width: arm,
        height: arm,
        '&::before': {
          content: '""',
          position: 'absolute',
          [top ? 'top' : 'bottom']: 0,
          [left ? 'left' : 'right']: 0,
          width: arm,
          height: thick,
          bgcolor: color,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          [top ? 'top' : 'bottom']: 0,
          [left ? 'left' : 'right']: 0,
          width: thick,
          height: arm,
          bgcolor: color,
        },
      }}
    />
  )
  return (
    <>
      {corner(true, true)}
      {corner(true, false)}
      {corner(false, true)}
      {corner(false, false)}
    </>
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
  }
}
