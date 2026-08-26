import { useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { Camera, RotateCcw, Upload } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx } from '@/shared/theme/publicBrand'
import { useCameraCapture } from '../hooks/useCameraCapture'
import { StepShell } from './StepShell'
import type { RetailCapturedImage } from '../types'

interface CaptureStepProps {
  title: string
  helperText: string
  frameLabel: string
  image?: RetailCapturedImage
  onCapture: (image: RetailCapturedImage) => void
  onBack: () => void
  onContinue: () => void
}

export function CaptureStep({ title, helperText, frameLabel, image, onCapture, onBack, onContinue }: CaptureStepProps) {
  const colors = usePublicBrandColors()
  const { videoRef, status, start, stop, capture } = useCameraCapture()

  useEffect(() => {
    if (!image) start()
    return () => stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCapture() {
    const dataUrl = capture()
    if (!dataUrl) return
    stop()
    onCapture({ dataUrl, capturedAt: new Date().toISOString() })
  }

  function handleRetake() {
    onCapture(undefined as unknown as RetailCapturedImage)
    start()
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      stop()
      onCapture({ dataUrl: reader.result as string, capturedAt: new Date().toISOString() })
    }
    reader.readAsDataURL(file)
  }

  return (
    <StepShell title={title} helperText={helperText} onBack={onBack} onContinue={onContinue} continueDisabled={!image}>
      <Box
        sx={{
          borderRadius: BORDER_RADIUS.lg,
          border: `1.5px dashed ${colors.border}`,
          backgroundColor: colors.surfaceAlt,
          minHeight: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <img src={image.dataUrl} alt={frameLabel} style={{ width: '100%', maxHeight: 360, objectFit: 'contain' }} />
        ) : status === 'live' ? (
          <video ref={videoRef} muted playsInline style={{ width: '100%', maxHeight: 360, objectFit: 'cover' }} />
        ) : (
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Camera size={28} color={colors.textMuted} />
            <Typography sx={{ fontSize: '13px', color: colors.textMuted, mt: 1 }}>
              {status === 'starting' && 'Starting camera…'}
              {status === 'denied' && 'Camera access denied — upload a photo instead.'}
              {status === 'unavailable' && 'Camera unavailable — upload a photo instead.'}
              {status === 'idle' && frameLabel}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
        {!image && status === 'live' && (
          <Box component="button" onClick={handleCapture} sx={{ ...getPrimaryButtonSx(colors), border: 'none', cursor: 'pointer', px: 2.5, py: 1 }}>
            Capture
          </Box>
        )}
        {image && (
          <Box
            component="button"
            onClick={handleRetake}
            sx={{ ...getOutlinedButtonSx(), border: `1px solid ${colors.border}`, backgroundColor: 'transparent', cursor: 'pointer', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <RotateCcw size={14} /> Retake
          </Box>
        )}
        <Box
          component="label"
          sx={{ ...getOutlinedButtonSx(), border: `1px solid ${colors.border}`, backgroundColor: 'transparent', cursor: 'pointer', px: 2, py: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
        >
          <Upload size={14} /> Upload instead
          <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
        </Box>
      </Box>
    </StepShell>
  )
}
