import { Breadcrumbs, Typography, Link, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Link as RouterLink } from 'react-router-dom'
import type { SxProps } from '@mui/material'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  sx?: SxProps
}

export default function Breadcrumb({ items, separator, maxItems, sx }: BreadcrumbProps) {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('lg'))
  const effectiveMax = maxItems ?? (isXs ? 2 : undefined)

  return (
    <Breadcrumbs
      separator={separator ?? <NavigateNextIcon sx={{ fontSize: 16, color: 'text.disabled' }} />}
      maxItems={effectiveMax}
      sx={{ ...sx as object }}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        if (isLast) {
          return (
            <Typography
              key={i}
              variant="body2"
              fontWeight={600}
              color="text.primary"
            >
              {item.label}
            </Typography>
          )
        }
        if (item.href) {
          return (
            <Link
              key={i}
              component={RouterLink}
              to={item.href}
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              {item.label}
            </Link>
          )
        }
        return (
          <Typography key={i} variant="body2" color="text.secondary">
            {item.label}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}
