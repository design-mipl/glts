import { useState } from 'react'
import { Box, Typography, Stack, Grid } from '@mui/material'
import {
  Breadcrumb, Tabs, Menu, Stepper, BackButton,
  CommandPalette, Divider, Button,
} from '@/design-system/components'
import type { MenuItem_T } from '@/design-system/components'
import { Settings, Users, FileText, BarChart2, Home } from 'lucide-react'

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Management', href: '/management' },
  { label: 'Users' },
]

const tabItems = [
  { label: 'Overview', value: 'overview' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Settings', value: 'settings' },
  { label: 'Team', value: 'team', badge: 5 },
]

const stepperSteps = [
  { label: 'Account', description: 'Create your account' },
  { label: 'Profile', description: 'Set up your profile' },
  { label: 'Preferences', description: 'Choose preferences' },
  { label: 'Review', description: 'Review & confirm' },
]

const menuItems: MenuItem_T[] = [
  { label: 'Profile', icon: <Users size={14} />, onClick: () => {} },
  { label: 'Settings', icon: <Settings size={14} />, onClick: () => {} },
  { label: '---', divider: true },
  { label: 'Reports', icon: <FileText size={14} />, onClick: () => {} },
  { label: '---2', divider: true },
  { label: 'Sign out', onClick: () => {}, variant: 'destructive' },
]

export function NavigationShowcase() {
  const [activeTab, setActiveTab] = useState('overview')
  const [activeStep, setActiveStep] = useState(1)
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Breadcrumb */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Breadcrumb</Typography>
          <Stack gap={2}>
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />
            <Breadcrumb items={breadcrumbItems} />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Tabs */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Tabs</Typography>
          <Tabs
            items={tabItems}
            value={activeTab}
            onChange={setActiveTab}
          />
          <Box sx={{ p: 2, mt: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active tab: {tabItems.find(t => t.value === activeTab)?.label}
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Stepper */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Stepper</Typography>
          <Stepper steps={stepperSteps} activeStep={activeStep} />
          <Stack direction="row" gap={1.5} sx={{ mt: 2 }}>
            <Button variant="outlined" size="sm" disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>
              Back
            </Button>
            <Button variant="contained" size="sm" disabled={activeStep === stepperSteps.length - 1} onClick={() => setActiveStep(s => s + 1)}>
              Next
            </Button>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* BackButton & Menu */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>BackButton</Typography>
          <BackButton label="Back to Users" onClick={() => {}} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Menu</Typography>
          <Menu
            trigger={<Button variant="outlined" size="sm">Open Menu</Button>}
            items={menuItems}
          />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* CommandPalette */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>CommandPalette</Typography>
          <Button variant="outlined" size="sm" onClick={() => setCommandOpen(true)}>
            Open Command Palette (âŒ˜K)
          </Button>
          <CommandPalette
            open={commandOpen}
            onClose={() => setCommandOpen(false)}
            onSearch={async (query) => {
              const all = [
                { id: 'dashboard', type: 'page' as const, title: 'Dashboard', icon: <Home size={14} />, href: '/' },
                { id: 'analytics', type: 'page' as const, title: 'Analytics', icon: <BarChart2 size={14} />, href: '/analytics' },
                { id: 'users', type: 'page' as const, title: 'Users', icon: <Users size={14} />, href: '/users' },
                { id: 'settings', type: 'page' as const, title: 'Settings', icon: <Settings size={14} />, href: '/settings' },
                { id: 'reports', type: 'page' as const, title: 'Reports', icon: <FileText size={14} />, href: '/reports' },
              ]
              const filtered = query ? all.filter(r => r.title.toLowerCase().includes(query.toLowerCase())) : all
              return { pages: filtered, records: [], users: [] }
            }}
          />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* AppShell note */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>AppShell / Sidebar / Topbar</Typography>
          <Typography variant="body2" color="text.secondary">
            AppShell, Sidebar, and Topbar are the live layout wrapping this entire page.
            The sidebar on the left and topbar at the top are real instances of these components.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

