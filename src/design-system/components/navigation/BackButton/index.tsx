import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import type { SxProps } from '@mui/material'

export interface BackButtonProps {
  label?: string
  onClick?: () => void
  href?: string
  sx?: SxProps
}

export default function BackButton({ label = 'Back', onClick, href, sx }: BackButtonProps) {
  const navigate = useNavigate()

  function handleClick() {
    if (onClick) {
      onClick()
    } else if (href) {
      navigate(href)
    } else {
      navigate(-1)
    }
  }

  return (
    <Button
      size="small"
      startIcon={<ArrowBackIcon fontSize="small" />}
      onClick={handleClick}
      sx={{
        color: 'text.secondary',
        textTransform: 'none',
        fontWeight: 400,
        px: 1,
        '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
        ...sx as object,
      }}
    >
      {label}
    </Button>
  )
}
