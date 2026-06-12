import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useStickyHeaderAtTop } from '@/shared/hooks/useStickyHeaderAtTop'

export interface CustomerListingStickyHeaderProps {
  children: ReactNode
  /** Transparent at scroll top; solid backdrop once the page scrolls. Default: true. */
  transparentBackground?: boolean
}

export function CustomerListingStickyHeader({
  children,
  transparentBackground = true,
}: CustomerListingStickyHeaderProps) {
  const colors = usePublicBrandColors()
  const { sentinelRef, showSolidBackground } = useStickyHeaderAtTop(transparentBackground)

  return (
    <>
      {transparentBackground ? (
        <Box ref={sentinelRef} aria-hidden sx={{ height: 1, pointerEvents: 'none' }} />
      ) : null}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: showSolidBackground ? colors.surface : 'transparent',
          transition: theme => theme.transitions.create('background-color', { duration: 200 }),
          pb: 2,
          mb: 0,
        }}
      >
        {children}
      </Box>
    </>
  )
}
