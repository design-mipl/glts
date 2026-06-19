import { Box } from '@mui/material'
import { type ReactNode } from 'react'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '../adminRecordPageTitle'
import { AdminPageHeader, type AdminPageHeaderProps } from '../AdminPageHeader'
import { useStickyHeaderAtTop } from '@/shared/hooks/useStickyHeaderAtTop'

interface StickyHeaderSurfaceProps {
  transparentBackground?: boolean
  children: ReactNode
  mb?: number
}

function StickyHeaderSurface({
  transparentBackground = true,
  children,
  mb = 0,
}: StickyHeaderSurfaceProps) {
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
          bgcolor: showSolidBackground ? 'background.default' : 'transparent',
          transition: theme => theme.transitions.create('background-color', { duration: 200 }),
          pb: 1.25,
          mb,
        }}
      >
        {children}
      </Box>
    </>
  )
}

type AdminListingStickyHeaderProps = AdminPageHeaderProps & {
  /** Transparent at scroll top; solid backdrop once the page scrolls. Default: true. */
  transparentBackground?: boolean
}

export function AdminListingStickyHeader({
  titleVariant = ADMIN_RECORD_PAGE_TITLE_VARIANT,
  titleSx,
  transparentBackground = true,
  ...props
}: AdminListingStickyHeaderProps) {
  return (
    <StickyHeaderSurface transparentBackground={transparentBackground}>
      <AdminPageHeader
        titleVariant={titleVariant}
        titleSx={{ ...ADMIN_RECORD_PAGE_TITLE_SX, ...titleSx }}
        {...props}
      />
    </StickyHeaderSurface>
  )
}

export function AdminListingStickyHeaderSlot({
  children,
  transparentBackground = true,
}: {
  children: ReactNode
  transparentBackground?: boolean
}) {
  return (
    <StickyHeaderSurface transparentBackground={transparentBackground}>{children}</StickyHeaderSurface>
  )
}
