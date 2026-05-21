import { Box } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Pagination } from '@/design-system/components'
import { BORDER_WIDTH } from '@/design-system/tokens'

export interface BillingPaginationProps {
  page: number
  pageSize: number
  total: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
  embedded?: boolean
}

export default function BillingPagination({
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
  embedded = false,
}: BillingPaginationProps) {
  const theme = useTheme()
  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <Box
      sx={
        embedded
          ? {
              borderTop: `${BORDER_WIDTH.thin} solid`,
              borderColor: 'divider',
              bgcolor: footerBg,
              '& .MuiBox-root': { py: 1.5, px: 2 },
            }
          : { mt: 2 }
      }
    >
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPage={onPage}
        onPageSize={onPageSize}
      />
    </Box>
  )
}
