import { TableRow, TableCell, Collapse, Box } from '@mui/material'
import type { ReactNode } from 'react'

export interface ExpandedRowProps {
  colSpan: number
  open: boolean
  children: ReactNode
}

export default function ExpandedRow({ colSpan, open, children }: ExpandedRowProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ p: 0, border: 0 }}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ py: 2, px: 3, bgcolor: 'action.hover' }}>
            {children}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}
