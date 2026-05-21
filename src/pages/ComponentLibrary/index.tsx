import { lazy, Suspense, useState } from 'react'
import { Box, Typography, Tab, Tabs as MuiTabs } from '@mui/material'
import RouteFallback from '@/components/RouteFallback'

const LazyPrimitives = lazy(() =>
  import('./components/PrimitivesShowcase').then((m) => ({ default: m.PrimitivesShowcase })),
)
const LazyDisplay = lazy(() =>
  import('./components/DisplayShowcase').then((m) => ({ default: m.DisplayShowcase })),
)
const LazyCards = lazy(() =>
  import('./components/CardsShowcase').then((m) => ({ default: m.CardsShowcase })),
)
const LazyCharts = lazy(() =>
  import('./components/ChartsShowcase').then((m) => ({ default: m.ChartsShowcase })),
)
const LazyDataTable = lazy(() =>
  import('./components/DataTableShowcase').then((m) => ({ default: m.DataTableShowcase })),
)
const LazyFeedback = lazy(() =>
  import('./components/FeedbackShowcase').then((m) => ({ default: m.FeedbackShowcase })),
)
const LazyForms = lazy(() =>
  import('./components/FormsShowcase').then((m) => ({ default: m.FormsShowcase })),
)
const LazyInfographics = lazy(() =>
  import('./components/InfographicsShowcase').then((m) => ({ default: m.InfographicsShowcase })),
)
const LazyNavigation = lazy(() =>
  import('./components/NavigationShowcase').then((m) => ({ default: m.NavigationShowcase })),
)
const LazyResponsive = lazy(() =>
  import('./components/ResponsiveShowcase').then((m) => ({ default: m.ResponsiveShowcase })),
)
const LazyColors = lazy(() =>
  import('./components/ColorTokensShowcase').then((m) => ({ default: m.ColorTokensShowcase })),
)

const tabPanels = [
  { label: 'Primitives', Component: LazyPrimitives },
  { label: 'Display', Component: LazyDisplay },
  { label: 'Cards', Component: LazyCards },
  { label: 'Charts', Component: LazyCharts },
  { label: 'DataTable', Component: LazyDataTable },
  { label: 'Feedback', Component: LazyFeedback },
  { label: 'Forms', Component: LazyForms },
  { label: 'Infographics', Component: LazyInfographics },
  { label: 'Navigation', Component: LazyNavigation },
  { label: 'Responsive', Component: LazyResponsive },
  { label: 'Colors', Component: LazyColors },
] as const

export default function ComponentLibrary() {
  const [activeTab, setActiveTab] = useState(0)
  const { Component } = tabPanels[activeTab]

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1">Component Library</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Complete design system showcase — all custom components
        </Typography>
      </Box>

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
          {tabPanels.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              sx={{ minHeight: 44, py: 0, fontSize: 13, fontWeight: 500 }}
            />
          ))}
        </MuiTabs>
      </Box>

      <Suspense fallback={<RouteFallback label="Loading showcase…" />}>
        <Component />
      </Suspense>
    </Box>
  )
}
