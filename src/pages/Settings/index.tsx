import { useState } from 'react'
import { Box } from '@mui/material'
import SettingsFab from './components/SettingsFab'
import SettingsDrawer from './components/SettingsDrawer'

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          bottom: { xs: 16, md: 24 },
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 4,
          pb: { xs: 2, md: 0 },
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Box sx={{ pointerEvents: 'auto' }}>
          <SettingsFab onClick={() => setOpen(true)} />
        </Box>
      </Box>
      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
