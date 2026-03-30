import { Box, Typography, Grid, Divider, Skeleton } from '@mui/material'
import type { SxProps } from '@mui/material'
import type { ReactNode } from 'react'
import BaseCard from '../BaseCard'

export interface SummaryField {
  label: string
  value: ReactNode
  span?: 1 | 2
}

export interface SummaryCardProps {
  title?: string
  subtitle?: string
  headerColor?: string
  fields: SummaryField[]
  columns?: 1 | 2 | 3
  actions?: ReactNode
  loading?: boolean
  hoverable?: boolean
  onClick?: () => void
  sx?: SxProps
}

function getColSize(columns: number, span: number) {
  const base = Math.floor(12 / columns)
  return Math.min(12, base * span)
}

export default function SummaryCard({
  title,
  subtitle,
  headerColor,
  fields,
  columns = 2,
  actions,
  loading = false,
  hoverable,
  onClick,
  sx,
}: SummaryCardProps) {
  if (loading) {
    return (
      <BaseCard headerColor={headerColor} sx={sx}>
        <Box sx={{ p: 2.5 }}>
          {title && (
            <>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" height={22} />
                  {subtitle && <Skeleton width="30%" height={16} sx={{ mt: 0.5 }} />}
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </>
          )}
          <Grid container spacing={2}>
            {fields.map((f, i) => (
              <Grid key={i} size={{ xs: getColSize(columns, f.span ?? 1) }}>
                <Skeleton width="45%" height={14} />
                <Skeleton width="70%" height={20} sx={{ mt: 0.5 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </BaseCard>
    )
  }

  return (
    <BaseCard
      headerColor={headerColor}
      hoverable={hoverable}
      onClick={onClick}
      sx={sx}
    >
      <Box sx={{ p: 2.5 }}>
        {/* Header */}
        {(title || actions) && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                {title && (
                  <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
                )}
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
                )}
              </Box>
              {actions && <Box sx={{ ml: 1, flexShrink: 0 }}>{actions}</Box>}
            </Box>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Fields grid */}
        <Grid container spacing={2}>
          {fields.map((field, i) => (
            <Grid key={i} size={{ xs: getColSize(columns, field.span ?? 1) }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  mb: 0.25,
                }}
              >
                {field.label}
              </Typography>
              {typeof field.value === 'string' || typeof field.value === 'number' ? (
                <Typography variant="body2" fontWeight={500} color="text.primary">
                  {field.value}
                </Typography>
              ) : (
                field.value
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </BaseCard>
  )
}
