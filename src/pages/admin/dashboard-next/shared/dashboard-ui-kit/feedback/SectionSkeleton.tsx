import { Stack } from '@mui/material'
import { Skeleton } from '../shadcn'
import { UI_KIT_SPACING } from '../tokens'

export interface SectionSkeletonProps {
  rows?: number
  height?: number
}

export function SectionSkeleton({ rows = 1, height = 120 }: SectionSkeletonProps) {
  return (
    <Stack spacing={UI_KIT_SPACING.field} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, i) => (
        <Stack key={i} spacing={1}>
          <Skeleton sx={{ height: 14, width: '36%' }} />
          <Skeleton sx={{ height, width: '100%' }} />
        </Stack>
      ))}
    </Stack>
  )
}
