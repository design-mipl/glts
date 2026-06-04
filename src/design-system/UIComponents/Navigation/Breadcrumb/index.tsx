import { Breadcrumbs, Typography, useMediaQuery, Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { SxProps } from '@mui/material'
import type { MouseEvent } from 'react'
import { getPreviousCrumbHref, navigateToAppPath } from '@/shared/utils/routerNavigationUtils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  sx?: SxProps
  /** When false, hides the leading back icon (parent crumb links still work). */
  showBack?: boolean
}

const crumbLinkSx = {
  textDecoration: 'none',
  color: 'text.secondary',
  cursor: 'pointer',
  '&:hover': {
    color: 'text.primary',
    textDecoration: 'underline',
  },
} as const

export default function Breadcrumb({ items, separator, maxItems, sx, showBack = true }: BreadcrumbProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const isCompact = useMediaQuery(theme.breakpoints.down('lg'))
  const effectiveMax = maxItems ?? (isCompact ? 2 : undefined)
  const previousCrumbHref = getPreviousCrumbHref(items)

  const goToHref = (href: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault()
    navigateToAppPath(navigate, href)
  }

  const handleBack = () => {
    if (previousCrumbHref) {
      navigateToAppPath(navigate, previousCrumbHref)
      return
    }
    navigate(-1)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        position: 'relative',
        zIndex: 11,
        ...(sx as object),
      }}
    >
      {showBack && items.length > 1 ? (
        <IconButton
          type="button"
          size="small"
          aria-label="Go back"
          onClick={handleBack}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          <ArrowLeft size={16} />
        </IconButton>
      ) : null}
      <Breadcrumbs
        separator={separator ?? <ChevronRight size={16} style={{ color: 'inherit', opacity: 0.4 }} />}
        maxItems={effectiveMax}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const href = item.href?.trim()

          if (isLast) {
            return (
              <Typography
                key={`${item.label}-${i}`}
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                {item.label}
              </Typography>
            )
          }

          if (href) {
            return (
              <Typography
                key={`${item.label}-${i}`}
                component="a"
                href={href}
                variant="body2"
                onClick={goToHref(href)}
                sx={crumbLinkSx}
              >
                {item.label}
              </Typography>
            )
          }

          return (
            <Typography key={`${item.label}-${i}`} variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}
