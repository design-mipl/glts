import { Box, Typography, Button } from '@mui/material'
import { LayoutDashboard } from 'lucide-react'

export default function Dashboard() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        maxWidth: 640,
      }}
    >
      <LayoutDashboard size={40} strokeWidth={1.5} style={{ opacity: 0.35 }} />
      <Typography variant="h1">Dashboard</Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome to Greenlight Travel Solutions. Use the sidebar to manage bookings and
        reference modules while you build out travel features.
      </Typography>
      <Button variant="contained" href="/billings">
        View sample module
      </Button>
    </Box>
  )
}
