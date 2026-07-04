import { Link } from '@mui/material'
import { ExternalLink } from 'lucide-react'
import { resolveApplicationTrackingUrl } from '@/shared/services/countryMasterService'

interface ApplicationTrackingUrlLinkProps {
  countryId?: string
  countryName?: string
  countryCode?: string
  label?: string
  sx?: object
}

export function ApplicationTrackingUrlLink({
  countryId,
  countryName,
  countryCode,
  label = 'Open application tracking',
  sx,
}: ApplicationTrackingUrlLinkProps) {
  const url = resolveApplicationTrackingUrl({ countryId, countryName, countryCode })
  if (!url) return null

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        fontSize: 13,
        fontWeight: 600,
        ...sx,
      }}
    >
      {label}
      <ExternalLink size={14} />
    </Link>
  )
}
