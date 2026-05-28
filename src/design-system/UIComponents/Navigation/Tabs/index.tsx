import { Tabs as MuiTabs, Tab, Box, Badge } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import type { SxProps } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface TabItem {
  label: string
  value: string
  icon?: ReactNode
  badge?: number | string
  disabled?: boolean
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  variant?: 'underline' | 'pill' | 'contained'
  scrollable?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md'
  sx?: SxProps
}

export default function Tabs({
  items,
  value,
  onChange,
  variant = 'underline',
  scrollable = true,
  fullWidth = false,
  size = 'md',
  sx,
}: TabsProps) {
  const theme = useTheme()
  const tabHeight = size === 'sm' ? 36 : 44
  const tabAccent = theme.palette.secondary.main

  const tabLabel = (item: TabItem) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      {item.icon && <span style={{ display: 'flex', fontSize: 18 }}>{item.icon}</span>}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <Badge
          badgeContent={item.badge}
          color="primary"
          sx={{ ml: 0.5, '& .MuiBadge-badge': { position: 'static', transform: 'none', fontSize: 11, height: 18, minWidth: 18 } }}
        />
      )}
    </Box>
  )

  if (variant === 'pill') {
    return (
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.06)
            : alpha(theme.palette.common.black, 0.05),
          borderRadius: '9999px',
          p: '4px',
          display: 'inline-flex',
          ...(fullWidth && { width: '100%' }),
          ...sx as object,
        }}
      >
        <MuiTabs
          value={value}
          onChange={(_, v) => onChange(v)}
          variant={scrollable ? 'scrollable' : fullWidth ? 'fullWidth' : 'standard'}
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            minHeight: tabHeight,
            '& .MuiTabs-flexContainer': { gap: 0.5 },
            ...(fullWidth && { width: '100%' }),
          }}
        >
          {items.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={tabLabel(item)}
              disabled={item.disabled}
              sx={{
                minHeight: tabHeight,
                borderRadius: '9999px',
                textTransform: 'none',
                fontWeight: 400,
                fontSize: size === 'sm' ? 13 : 14,
                px: 2,
                py: 0.5,
                color: 'text.secondary',
                transition: 'all 200ms ease',
                '&.Mui-selected': {
                  color: tabAccent,
                  fontWeight: 600,
                  bgcolor: 'background.paper',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                },
              }}
            />
          ))}
        </MuiTabs>
      </Box>
    )
  }

  if (variant === 'contained') {
    return (
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'inline-flex',
          ...(fullWidth && { width: '100%' }),
          ...sx as object,
        }}
      >
        <MuiTabs
          value={value}
          onChange={(_, v) => onChange(v)}
          variant={scrollable ? 'scrollable' : fullWidth ? 'fullWidth' : 'standard'}
          scrollButtons="auto"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{
            minHeight: tabHeight,
            '& .MuiTabs-flexContainer': { gap: 0 },
            ...(fullWidth && { width: '100%' }),
          }}
        >
          {items.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={tabLabel(item)}
              disabled={item.disabled}
              sx={{
                minHeight: tabHeight,
                textTransform: 'none',
                fontWeight: 400,
                fontSize: size === 'sm' ? 13 : 14,
                px: 2,
                color: 'text.secondary',
                borderRight: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderRight: 'none' },
                '&.Mui-selected': {
                  color: tabAccent,
                  fontWeight: 600,
                  bgcolor: 'background.paper',
                  boxShadow: `inset 0 -2px 0 0 ${tabAccent}`,
                },
              }}
            />
          ))}
        </MuiTabs>
      </Box>
    )
  }

  // default: underline
  return (
    <MuiTabs
      value={value}
      onChange={(_, v) => onChange(v)}
      variant={scrollable ? 'scrollable' : fullWidth ? 'fullWidth' : 'standard'}
      scrollButtons="auto"
      TabIndicatorProps={{ style: { backgroundColor: tabAccent } }}
      sx={{
        minHeight: tabHeight,
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...(fullWidth && { width: '100%' }),
        ...sx as object,
      }}
    >
      {items.map((item) => (
        <Tab
          key={item.value}
          value={item.value}
          label={tabLabel(item)}
          disabled={item.disabled}
          sx={{
            minHeight: tabHeight,
            textTransform: 'none',
            fontWeight: 400,
            fontSize: size === 'sm' ? 13 : 14,
            px: 2,
            color: 'text.secondary',
            '&.Mui-selected': {
              color: tabAccent,
              fontWeight: 600,
            },
          }}
        />
      ))}
    </MuiTabs>
  )
}
