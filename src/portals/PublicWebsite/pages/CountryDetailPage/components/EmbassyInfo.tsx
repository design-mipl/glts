import { Box, Card, Typography, Stack } from '@mui/material'
import { MapPin, Clock, Phone } from 'lucide-react'

interface EmbassyInfoProps {
  title: string
  location: string
  hours?: string
  phone?: string
}

export function EmbassyInfo({
  title,
  location,
  hours = 'Mon–Fri: 9:00 AM – 4:00 PM',
  phone,
}: EmbassyInfoProps) {
  return (
    <Card sx={{ p: 3, border: '1px solid #E5E7EB', boxShadow: 'none', borderRadius: '10px' }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', display: 'block', mb: 2 }}
      >
        {title}
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <MapPin size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
          <Typography variant="body2" sx={{ color: '#374151' }}>
            {location}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Clock size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
          <Typography variant="body2" sx={{ color: '#374151' }}>
            {hours}
          </Typography>
        </Box>

        {phone && (
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Phone size={16} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography variant="body2" sx={{ color: '#374151' }}>
              {phone}
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
