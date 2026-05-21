import { Box, Typography, Button } from '@mui/material'
import { Construction } from 'lucide-react'

interface ComingSoonProps {
  title?: string
}

export default function ComingSoon({ title = 'Coming Soon' }: ComingSoonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 2,
      }}
    >
      <Construction size={64} style={{ opacity: 0.4 }} />
      <Typography variant="h2">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        This module is under development
      </Typography>
      <Button variant="contained" href="/">
        Back to Dashboard
      </Button>
    </Box>
  )
}
