import { Tabs, Tab, Box } from '@mui/material'
import { publicColors, publicFonts } from '../../../../../shared/theme/publicBrand'

interface TabsNavigationProps {
  activeTab: number
  onTabChange: (value: number) => void
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <Box sx={{ borderBottom: `1px solid ${publicColors.border}`, mb: 4 }}>
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
            color: publicColors.textSecondary,
            py: 2,
            minHeight: 52,
          },
          '& .Mui-selected': { color: publicColors.navy, fontWeight: 700 },
          '& .MuiTabs-indicator': { backgroundColor: publicColors.greenBright, height: 3, borderRadius: '3px 3px 0 0' },
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
