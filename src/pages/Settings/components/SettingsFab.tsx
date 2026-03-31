import { Box, Tooltip } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Settings } from 'lucide-react'

interface SettingsFabProps {
  onClick: () => void
}

export default function SettingsFab({ onClick }: SettingsFabProps) {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <Tooltip title="Customize theme" placement="left">
      <Box
        onClick={onClick}
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(isLight ? '#000000' : '#ffffff', 0.1)}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          color: 'text.secondary',
          transition: 'color 150ms ease, box-shadow 150ms ease',
          '&:hover': {
            color: 'primary.main',
            boxShadow: '0 4px 12px rgba(0,0,0,0.16)',
          },
        }}
      >
        <Settings size={18} strokeWidth={1.75} />
      </Box>
    </Tooltip>
  )
}
