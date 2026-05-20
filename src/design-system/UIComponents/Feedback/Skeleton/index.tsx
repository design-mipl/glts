import Box from '@mui/material/Box'
import MuiSkeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import type { SxProps, Theme } from '@mui/material/styles'
import { tokens } from '../../../tokens'

type SkeletonVariant = 'text' | 'rect' | 'circle' | 'card' | 'table-row' | 'list-item'

export interface SkeletonProps {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
  lines?: number
  animation?: 'pulse' | 'wave' | false
  sx?: SxProps<Theme>
}

function getTextLineWidth(index: number): string {
  const pattern = ['100%', '90%', '75%']
  return pattern[index % pattern.length]
}

export default function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  lines = 3,
  animation = 'wave',
  sx,
}: SkeletonProps) {
  if (variant === 'card') {
    return (
      <Stack spacing={3} sx={sx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
          <MuiSkeleton variant="circular" width={40} height={40} animation={animation} />
          <Box sx={{ flex: 1 }}>
            <MuiSkeleton variant="text" width="48%" animation={animation} />
            <MuiSkeleton variant="text" width="32%" animation={animation} />
          </Box>
        </Box>
        <MuiSkeleton
          variant="rounded"
          height={120}
          animation={animation}
          sx={{ borderRadius: tokens.borderRadius.lg }}
        />
        <MuiSkeleton variant="text" width="100%" animation={animation} />
        <MuiSkeleton variant="text" width="88%" animation={animation} />
        <MuiSkeleton variant="text" width="64%" animation={animation} />
      </Stack>
    )
  }

  if (variant === 'table-row') {
    return (
      <Box
        sx={[
          {
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr',
            gap: tokens.spacing[3],
            alignItems: 'center',
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <MuiSkeleton key={index} variant="text" width="100%" animation={animation} />
        ))}
      </Box>
    )
  }

  if (variant === 'list-item') {
    return (
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      >
        <MuiSkeleton variant="circular" width={36} height={36} animation={animation} />
        <Box sx={{ flex: 1 }}>
          <MuiSkeleton variant="text" width="62%" animation={animation} />
          <MuiSkeleton variant="text" width="40%" animation={animation} />
        </Box>
      </Box>
    )
  }

  if (variant === 'rect') {
    return (
      <MuiSkeleton
        variant="rounded"
        width={width}
        height={height ?? 120}
        animation={animation}
        sx={[
          { borderRadius: tokens.borderRadius.md },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      />
    )
  }

  if (variant === 'circle') {
    const resolvedSize = width ?? height ?? 40

    return (
      <MuiSkeleton
        variant="circular"
        width={resolvedSize}
        height={resolvedSize}
        animation={animation}
        sx={sx}
      />
    )
  }

  return (
    <Stack spacing={2} sx={sx}>
      {Array.from({ length: lines }).map((_, index) => (
        <MuiSkeleton
          key={index}
          variant="text"
          width={index === 0 ? width : getTextLineWidth(index)}
          height={height}
          animation={animation}
        />
      ))}
    </Stack>
  )
}

export interface SkeletonCollectionProps {
  count?: number
  animation?: 'pulse' | 'wave' | false
  sx?: SxProps<Theme>
}

export function SkeletonText(props: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="text" {...props} />
}

export function SkeletonCard(props: Omit<SkeletonProps, 'variant'>) {
  return <Skeleton variant="card" {...props} />
}

export function SkeletonTable({
  count = 3,
  animation = 'wave',
  sx,
}: SkeletonCollectionProps) {
  return (
    <Stack spacing={3} sx={sx}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="table-row" animation={animation} />
      ))}
    </Stack>
  )
}

export function SkeletonList({
  count = 3,
  animation = 'wave',
  sx,
}: SkeletonCollectionProps) {
  return (
    <Stack spacing={3} sx={sx}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="list-item" animation={animation} />
      ))}
    </Stack>
  )
}
