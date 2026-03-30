import { Fab, Tooltip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

interface SettingsFabProps {
  onClick: () => void
}

export default function SettingsFab({ onClick }: SettingsFabProps) {
  return (
    <Tooltip title="Customize theme" placement="left">
      <Fab
        color="primary"
        size="medium"
        onClick={onClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 24 },
          right:  { xs: 16, md: 24 },
          zIndex: 1050,
        }}
      >
        <SettingsIcon />
      </Fab>
    </Tooltip>
  )
}
