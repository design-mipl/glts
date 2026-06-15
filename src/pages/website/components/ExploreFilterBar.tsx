import { Box, Typography, MenuItem, Select } from '@mui/material'
import { Zap, Plane, ClipboardList, Umbrella } from 'lucide-react'
import { publicFonts, publicLightColors, usePublicBrandColors } from '../theme/publicSiteTokens'

export interface ExploreFilters {
  visaDelivery: string
  visaType: string
  documents: string
  holidays: string
}

interface ExploreFilterBarProps {
  filters: ExploreFilters
  onChange: (next: ExploreFilters) => void
}

const filterDefs = [
  {
    key: 'visaDelivery' as const,
    label: 'Visa delivery',
    icon: Zap,
    color: publicLightColors.greenBright,
    options: ['Any Time', 'Under 24 hours', 'Under 1 week'],
  },
  {
    key: 'visaType' as const,
    label: 'Type',
    icon: Plane,
    color: '#3B82F6',
    options: ['All Visa Types', 'e-Visa', 'Sticker', 'Visa on arrival'],
  },
  {
    key: 'documents' as const,
    label: 'Documents',
    icon: ClipboardList,
    color: '#F59E0B',
    options: ['Any Documents', 'Passport only', 'Photo + Passport'],
  },
  {
    key: 'holidays' as const,
    label: 'Holidays',
    icon: Umbrella,
    color: '#EC4899',
    options: ['Select Dates', 'Next 30 days', 'Next 90 days'],
  },
]

export function ExploreFilterBar({ filters, onChange }: ExploreFilterBarProps) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: { xs: 'nowrap', lg: 'wrap' },
        gap: 1.5,
        p: 1.5,
        bgcolor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(15, 23, 42, 0.05)',
        width: { xs: 'max-content', lg: '100%' },
        minWidth: '100%',
      }}
    >
      {filterDefs.map(({ key, label, icon: Icon, color, options }) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.75,
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
            bgcolor: colors.surface,
            flexShrink: 0,
            minWidth: 160,
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              bgcolor: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={14} color={color} strokeWidth={2.5} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}
            >
              {label}
            </Typography>
            <Select
              value={filters[key]}
              onChange={e => onChange({ ...filters, [key]: e.target.value })}
              variant="standard"
              disableUnderline
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: publicFonts.body,
                color: colors.text,
                '& .MuiSelect-select': { py: 0, pr: 3 },
              }}
            >
              {options.map(opt => (
                <MenuItem key={opt} value={opt} sx={{ fontSize: '13px' }}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
