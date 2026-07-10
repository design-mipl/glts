import type { SxProps, Theme } from '@mui/material/styles'

export const DOCUMENTATION_LISTING_TABLE_SX: SxProps<Theme> = {
  height: 240,
  minHeight: 240,
  '& .MuiTableContainer-root': {
    height: '100%',
    maxHeight: '100%',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    height: '34px',
    minHeight: '34px',
    maxHeight: '34px',
    verticalAlign: 'middle',
  },
}
