import { Tabs, Tab, Box } from '@mui/material'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

interface TabsNavigationProps {
  activeTab: number
  onTabChange: (value: number) => void
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ borderBottom: `1px solid ${colors.border}`, mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onTabChange(v as number)}
        sx={{
          minHeight: 52,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '16px',
            fontFamily: publicFonts.body,
            color: colors.textSecondary,
            py: 2,
            minHeight: 52,
          },
          '& .Mui-selected': { color: colors.navy, fontWeight: 700 },
          '& .MuiTabs-indicator': { backgroundColor: colors.navy, height: 3, borderRadius: '3px 3px 0 0' },
        }}
      >
        <Tab label="Requirements" />
        <Tab label="Timeline" />
        <Tab label="Pricing" />
        <Tab label="FAQs" />
      </Tabs>
    </Box>
  )
}
