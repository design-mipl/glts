import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Camera, Pencil, Upload } from 'lucide-react'
import { Box, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  singleExtractedFields,
  type ExtractedField,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { useCameraCapture } from '../../hooks/useCameraCapture'
import type { RetailCapturedImage, RetailTravellerDetails } from '../../types'
import { CaptureFlowShell, CaptureHeadline } from './CaptureFlowShell'
import { CaptureModeBar, type CaptureInputMode } from './CaptureModeBar'

export interface PassportCaptureResult {
  passport: RetailCapturedImage
  passportBack?: RetailCapturedImage
  passportFields: ExtractedField[]
  details: Partial<RetailTravellerDetails>
}

interface PassportCaptureFlowProps {
  initialPassport?: RetailCapturedImage
  initialPassportBack?: RetailCapturedImage
  initialFields?: ExtractedField[]
  initialDetails?: RetailTravellerDetails
  onConfirm: (result: PassportCaptureResult) => void
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

function fieldsToDetails(fields: ExtractedField[]): Partial<RetailTravellerDetails> {
  const get = (key: string) => fields.find((field) => field.key === key)?.value?.trim() ?? ''
  return {
    fullName: [get('given'), get('surname')].filter(Boolean).join(' ').trim(),
    passportNumber: get('docNo'),
    dateOfBirth: get('dob'),
    nationality: get('issuer'),
  }
}

function seedFields(existing?: ExtractedField[]): ExtractedField[] {
  if (existing?.length) return existing.map((field) => ({ ...field }))
  return singleExtractedFields.map((field) => ({ ...field }))
}

export function PassportCaptureFlow({
  initialPassport,
  initialPassportBack,
  initialFields,
  initialDetails,
  onConfirm,
  onClose,
}: PassportCaptureFlowProps) {
  const colors = usePublicBrandColors()
  const fileRef = useRef<HTMLInputElement>(null)
  const backFileRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<'capture' | 'review'>(initialPassport ? 'review' : 'capture')
  const [mode, setMode] = useState<CaptureInputMode>('live')
  const [front, setFront] = useState<RetailCapturedImage | undefined>(initialPassport)
  const [back, setBack] = useState<RetailCapturedImage | undefined>(initialPassportBack)
  const [fields, setFields] = useState<ExtractedField[]>(() => seedFields(initialFields))
  const [email, setEmail] = useState(initialDetails?.email ?? '')
  const [phone, setPhone] = useState(initialDetails?.phone ?? '')
  const { videoRef, status, start, stop, capture } = useCameraCapture({ facingMode: 'environment' })

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

  async function applyFront(image: RetailCapturedImage) {
    stop()
    setFront(image)
    setFields(seedFields())
    setPhase('review')
  }

  function handleCapture() {
    const dataUrl = capture()
    if (!dataUrl) return
    void applyFront({ dataUrl, capturedAt: new Date().toISOString() })
  }

  async function handleFrontFile(file: File) {
    await applyFront(await readFileAsImage(file))
  }

  async function handleBackFile(file: File) {
    setBack(await readFileAsImage(file))
  }

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => prev.map((field) => (field.key === key ? { ...field, value } : field)))
  }

  function handleRecaptureFront() {
    setFront(undefined)
    setPhase('capture')
    setMode('live')
  }

  function handleConfirm() {
    if (!front) return
    const fromFields = fieldsToDetails(fields)
    onConfirm({
      passport: front,
      passportBack: back,
      passportFields: fields,
      details: {
        ...fromFields,
        email: email.trim(),
        phone: phone.trim(),
      },
    })
  }

  const canContinue =
    Boolean(front) &&
    Boolean(back) &&
    email.trim().length > 3 &&
    phone.trim().length >= 8

  if (phase === 'review' && front) {
    return (
      <CaptureFlowShell
        onClose={onClose}
        size="xl"
        contentAlign="start"
        fitToContent
        header={<CaptureHeadline lead="Passport," accent="review & contact" />}
        footer={
          <Box sx={{ width: '100%', maxWidth: 920, mx: 'auto' }}>
            <Box
              component="button"
              type="button"
              disabled={!canContinue}
              onClick={handleConfirm}
              sx={{
                appearance: 'none',
                width: '100%',
                border: 'none',
                borderRadius: 999,
                py: 1.5,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'inherit',
                cursor: canContinue ? 'pointer' : 'not-allowed',
                bgcolor: canContinue ? colors.navy : colors.surfaceAlt,
                color: canContinue ? '#fff' : colors.textMuted,
              }}
            >
              Continue
            </Box>
          </Box>
        }
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 960,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '320px 1fr' },
            gap: { xs: 2.5, md: 3.5 },
            textAlign: 'left',
            pt: 1,
          }}
        >
          <Stack
            spacing={1.5}
            sx={{
              p: 1.75,
              borderRadius: BORDER_RADIUS.xl,
              border: `1px dashed ${colors.border}`,
              bgcolor: colors.surfaceAlt,
              height: 'fit-content',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={front.dataUrl}
                alt="Passport front"
                sx={{
                  width: '100%',
                  borderRadius: BORDER_RADIUS.lg,
                  display: 'block',
                  bgcolor: colors.white,
                  minHeight: 170,
                  objectFit: 'cover',
                }}
              />
              <Box
                component="button"
                type="button"
                aria-label="Replace passport front"
                onClick={handleRecaptureFront}
                sx={{
                  appearance: 'none',
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  border: 'none',
                  bgcolor: colors.navy,
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
                }}
              >
                <Pencil size={14} />
              </Box>
            </Box>

            {back ? (
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={back.dataUrl}
                  alt="Passport back"
                  sx={{
                    width: '100%',
                    borderRadius: BORDER_RADIUS.lg,
                    display: 'block',
                    bgcolor: colors.white,
                    minHeight: 150,
                    objectFit: 'cover',
                  }}
                />
                <Box
                  component="button"
                  type="button"
                  aria-label="Replace passport back"
                  onClick={() => backFileRef.current?.click()}
                  sx={{
                    appearance: 'none',
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: 'none',
                    bgcolor: colors.navy,
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Pencil size={14} />
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  borderRadius: BORDER_RADIUS.lg,
                  bgcolor: 'rgba(15, 23, 42, 0.04)',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  px: 2,
                  py: 3,
                }}
              >
                <AlertTriangle size={22} color="#DC2626" />
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: colors.navy }}>
                  Passport Back required
                </Typography>
                <Button
                  label="Upload"
                  variant="contained"
                  color="primary"
                  size="sm"
                  startIcon={<Upload size={14} />}
                  onClick={() => backFileRef.current?.click()}
                />
              </Box>
            )}
          </Stack>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                columnGap: 3,
                rowGap: 2,
              }}
            >
              <UnderlineField
                label="First name"
                required
                value={fieldValue(fields, 'given')}
                onChange={(value) => handleFieldChange('given', value)}
              />
              <UnderlineField
                label="Last name"
                value={fieldValue(fields, 'surname')}
                onChange={(value) => handleFieldChange('surname', value)}
              />
              <UnderlineField
                label="Gender"
                required
                value={fieldValue(fields, 'sex')}
                onChange={(value) => handleFieldChange('sex', value)}
                select
                options={['M', 'F', 'X']}
              />
              <UnderlineField
                label="Passport number"
                required
                value={fieldValue(fields, 'docNo')}
                onChange={(value) => handleFieldChange('docNo', value)}
              />
              <UnderlineField
                label="Date of birth"
                required
                value={fieldValue(fields, 'dob')}
                onChange={(value) => handleFieldChange('dob', value)}
              />
              <UnderlineField
                label="Passport issued on"
                required
                value={fieldValue(fields, 'issueDate')}
                onChange={(value) => handleFieldChange('issueDate', value)}
              />
              <UnderlineField
                label="Passport valid till"
                required
                value={fieldValue(fields, 'expiry')}
                onChange={(value) => handleFieldChange('expiry', value)}
              />
            </Box>

            <Box
              sx={{
                mt: 3.5,
                pt: 3,
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>
                Contact Details
              </Typography>
              <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.5, mb: 2 }}>
                Required for sharing essential visa updates in real time.
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  columnGap: 3,
                  rowGap: 2,
                }}
              >
                <UnderlineField
                  label="Email address"
                  required
                  value={email}
                  onChange={setEmail}
                  placeholder="name@email.com"
                />
                <UnderlineField
                  label="Phone number"
                  required
                  value={phone}
                  onChange={setPhone}
                  placeholder="+91 98765 43210"
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          component="input"
          ref={backFileRef}
          type="file"
          accept="image/*,.pdf,.heic"
          hidden
          onChange={async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0]
            if (!file) return
            await handleBackFile(file)
            ;(event.target as HTMLInputElement).value = ''
          }}
        />
      </CaptureFlowShell>
    )
  }

  return (
    <CaptureFlowShell
      onClose={onClose}
      size="lg"
      contentMinHeight={{ xs: 480, sm: 560 }}
      header={<CaptureHeadline lead="Passport," accent="photo page up" />}
      footer={<CaptureModeBar mode={mode} onChange={setMode} />}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 'min(92vw, 560px)',
            aspectRatio: '1.58 / 1',
            borderRadius: 28,
            overflow: 'hidden',
            border: `2px solid rgba(115, 192, 100, 0.45)`,
            bgcolor: colors.surfaceAlt,
            backgroundImage: `
              linear-gradient(rgba(115, 192, 100, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(115, 192, 100, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
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
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box sx={{ textAlign: 'center', px: 3, position: 'relative', zIndex: 1 }}>
              <Camera size={28} color={colors.textMuted} />
              <Typography sx={{ mt: 1, fontSize: 13, color: colors.textMuted }}>
                {status === 'starting' && 'Starting camera…'}
                {status === 'denied' && 'Camera denied — upload from device instead.'}
                {status === 'unavailable' && 'Camera unavailable — upload from device instead.'}
                {(status === 'idle' || mode === 'upload') && 'Align the passport photo page in the frame'}
              </Typography>
            </Box>
          )}
        </Box>

        {mode === 'live' && status === 'live' ? (
          <Button
            label="Capture passport"
            variant="contained"
            color="primary"
            startIcon={<Camera size={16} />}
            onClick={handleCapture}
            sx={{ mt: 3, minWidth: 180 }}
          />
        ) : null}
      </Box>

      <Box
        component="input"
        ref={fileRef}
        type="file"
        accept="image/*,.pdf,.heic"
        hidden
        onChange={async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0]
          if (!file) {
            setMode('live')
            return
          }
          await handleFrontFile(file)
          ;(event.target as HTMLInputElement).value = ''
        }}
      />
    </CaptureFlowShell>
  )
}

function fieldValue(fields: ExtractedField[], key: string): string {
  return fields.find((field) => field.key === key)?.value ?? ''
}

function UnderlineField({
  label,
  value,
  onChange,
  required,
  placeholder,
  select,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  select?: boolean
  options?: string[]
}) {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          color: colors.navy,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 0.75,
        }}
      >
        {label}
        {required ? (
          <Box component="span" sx={{ color: '#DC2626', ml: 0.25 }}>
            *
          </Box>
        ) : null}
      </Typography>
      {select ? (
        <Select
          fullWidth
          variant="standard"
          value={value || ''}
          displayEmpty
          onChange={(event) => onChange(String(event.target.value))}
          disableUnderline
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.navy,
            borderBottom: `1px solid ${colors.border}`,
            pb: 0.5,
            '& .MuiSelect-select': { py: 0.5, pr: '28px !important' },
          }}
        >
          {(options ?? []).map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'M' ? 'Male' : option === 'F' ? 'Female' : option === 'X' ? 'Other' : option}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          fullWidth
          variant="standard"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: 15,
              fontWeight: 700,
              color: colors.navy,
              borderBottom: `1px solid ${value ? colors.border : 'rgba(15,23,42,0.2)'}`,
              borderBottomStyle: value ? 'solid' : 'dashed',
              pb: 0.5,
            },
          }}
        />
      )}
    </Box>
  )
}
