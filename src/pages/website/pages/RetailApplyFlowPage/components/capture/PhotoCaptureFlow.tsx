import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
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
              sx={{ ...getQuietButtonSx(), flex: 1, px: 3, py: 1.5, minHeight: 44 }}
            >
              Retake
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => onConfirm(draft)}
              sx={{ ...getAccentButtonSx(), flex: 1, px: 3, py: 1.5, minHeight: 44, border: 'none' }}
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
              borderRadius: applyRadius.control,
            }}
          />
        </CaptureFrame>
        <TipList tips={PHOTO_TIPS} />
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
              borderRadius: applyRadius.control,
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

      <TipList tips={PHOTO_TIPS} />

      {mode === 'live' && status === 'live' ? (
        <Box
          component="button"
          type="button"
          onClick={handleCapture}
          sx={{
            ...getAccentButtonSx(),
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            mt: 2.5,
            minWidth: 180,
            justifyContent: 'center',
            py: 1.5,
            px: 3,
            border: 'none',
          }}
        >
          <Camera size={16} /> Capture photo
        </Box>
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
        borderRadius: applyRadius.card,
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
          borderRadius: applyRadius.control,
          border: '2px solid rgba(255, 255, 255, 0.92)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: applyRadius.control,
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

function TipList({ tips }: { tips: readonly string[] }) {
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
            fontFamily: applyFont.body,
            fontSize: 13,
            lineHeight: 1.45,
            color: applyFlow.inkMuted,
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
