import { useState } from 'react'
import MuiIconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import MuiTooltip from '@mui/material/Tooltip'
import { Copy, Check } from 'lucide-react'
import type { SxProps, Theme } from '@mui/material/styles'

export interface CopyButtonProps {
  value: string
  label?: string
  size?: 'sm' | 'md'
  iconOnly?: boolean
  tooltip?: string
  successTooltip?: string
  sx?: SxProps<Theme>
}

export default function CopyButton({
  value,
  label,
  size = 'md',
  iconOnly = true,
  tooltip = 'Copy',
  successTooltip = 'Copied!',
  sx,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const iconSize = size === 'sm' ? 16 : 18
  const dim = size === 'sm' ? 28 : 36

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const icon = copied ? <Check size={iconSize} style={{ color: 'var(--mui-palette-success-main)' }} /> : <Copy size={iconSize} />

  if (iconOnly) {
    return (
      <MuiTooltip title={copied ? successTooltip : tooltip} arrow>
        <MuiIconButton
          onClick={handleCopy}
          size="small"
          sx={[{ width: dim, height: dim }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        >
          {icon}
        </MuiIconButton>
      </MuiTooltip>
    )
  }

  return (
    <MuiTooltip title={copied ? successTooltip : tooltip} arrow>
      <Button
        onClick={handleCopy}
        size="small"
        variant="outlined"
        startIcon={icon}
        sx={sx}
      >
        {label ?? 'Copy'}
      </Button>
    </MuiTooltip>
  )
}
