import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Copy, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'

export interface ProfileCopyFieldProps {
  label: string
  value: string
  verified?: boolean
}

export function ProfileCopyField({ label, value, verified }: ProfileCopyFieldProps) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      showToast({ title: `${label} copied`, variant: 'success' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast({ title: 'Could not copy to clipboard', variant: 'error' })
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </Typography>
        {verified && <CustomerStatusChip label="Verified" tone="success" size="sm" />}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy, fontFamily: 'monospace' }}>{value}</Typography>
        <IconButton size="small" onClick={handleCopy} aria-label={`Copy ${label}`} sx={{ color: colors.textMuted }}>
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
        </IconButton>
      </Stack>
    </Box>
  )
}
