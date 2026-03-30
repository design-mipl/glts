import { useState } from 'react'
import SettingsFab from './components/SettingsFab'
import SettingsDrawer from './components/SettingsDrawer'

export default function SettingsPanel() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SettingsFab onClick={() => setOpen(true)} />
      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
