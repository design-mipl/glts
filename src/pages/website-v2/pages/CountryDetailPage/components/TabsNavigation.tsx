import { Box, ButtonBase } from '@mui/material'
import { FileText, Clock, CircleHelp } from 'lucide-react'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { applyFlow, applyMotion, tabularNums } from '@/pages/website-v2/theme/applyFlowTheme'

interface TabsNavigationProps {
  activeTab: number
  onTabChange: (value: number) => void
}

const tabs = [
  { index: '01', label: 'Requirements', icon: FileText },
  { index: '02', label: 'Timeline', icon: Clock },
  { index: '03', label: 'FAQs', icon: CircleHelp },
] as const

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      role="tablist"
      sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, borderBottom: `1px solid ${colors.border}`, mb: 4 }}
    >
      {tabs.map(({ index, label, icon: Icon }, i) => {
        const active = activeTab === i
        return (
          <ButtonBase
            key={label}
            role="tab"
            aria-selected={active}
            disableRipple
            onClick={() => onTabChange(i)}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 0.875,
              px: { xs: 1.25, sm: 1.75 },
              py: 1.75,
              borderRadius: '4px 4px 0 0',
              fontFamily: publicFonts.body,
              fontSize: { xs: '13.5px', sm: '14px' },
              fontWeight: active ? 700 : 500,
              color: active ? colors.navy : colors.textSecondary,
              transition: `color 180ms ${applyMotion.easeOut}`,
              '&:hover': { color: colors.navy },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                height: '2px',
                borderRadius: '2px 2px 0 0',
                backgroundColor: applyFlow.accent,
                transform: active ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center',
                transition: `transform 220ms ${applyMotion.easeOut}`,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                fontFamily: publicFonts.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: active ? applyFlow.accentInk : colors.textMuted,
                ...tabularNums,
              }}
            >
              {index}
            </Box>
            <Icon size={15} color={active ? colors.navy : colors.textMuted} strokeWidth={2} />
            {label}
          </ButtonBase>
        )
      })}
    </Box>
  )
}
