import { Box, CircularProgress, Typography } from '@mui/material'

interface AdminListingLoadingStateProps {
  label?: string
}

export function AdminListingLoadingState({
  label = 'Loading records',
}: AdminListingLoadingStateProps) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.25,
        py: 8,
        px: 2,
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: 13 }}>
        {label}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
        Please wait while this listing is prepared.
      </Typography>
    </Box>
  )
}
