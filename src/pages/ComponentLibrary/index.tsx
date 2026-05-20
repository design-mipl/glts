import { useState } from 'react'
import { Box, Typography, Tab, Tabs as MuiTabs } from '@mui/material'
import {
  PrimitivesShowcase,
  DisplayShowcase,
  CardsShowcase,
  ChartsShowcase,
  DataTableShowcase,
  FeedbackShowcase,
  FormsShowcase,
  InfographicsShowcase,
  NavigationShowcase,
  ResponsiveShowcase,
  ColorTokensShowcase,
} from './components'

const tabs = [
  { label: 'Primitives',   component: <PrimitivesShowcase /> },
  { label: 'Display',      component: <DisplayShowcase /> },
  { label: 'Cards',        component: <CardsShowcase /> },
  { label: 'Charts',       component: <ChartsShowcase /> },
  { label: 'DataTable',    component: <DataTableShowcase /> },
  { label: 'Feedback',     component: <FeedbackShowcase /> },
  { label: 'Forms',        component: <FormsShowcase /> },
  { label: 'Infographics', component: <InfographicsShowcase /> },
  { label: 'Navigation',   component: <NavigationShowcase /> },
  { label: 'Responsive',   component: <ResponsiveShowcase /> },
  { label: 'Colors',       component: <ColorTokensShowcase /> },
]

export default function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Component Library</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Complete design system showcase — all custom components
        </Typography>
      </Box>

      {/* Sticky tab bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
          mb: 4,
        }}
      >
        <MuiTabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 44 }}
        >
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab.label} sx={{ minHeight: 44, py: 0, fontSize: 13, fontWeight: 500 }} />
          ))}
        </MuiTabs>
      </Box>

      {/* Active showcase */}
      {tabs[activeTab].component}
    </Box>
  )
}
