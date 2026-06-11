import { Box } from '@mui/material'
import { Tag } from '@/design-system/UIComponents'
import {
  getMasterAudienceTagVariant,
  type MasterAudienceTagItem,
} from '../config/masterAudienceTagConfig'

export interface MasterAudienceTagsProps {
  items: MasterAudienceTagItem[]
}

export function MasterAudienceTags({ items }: MasterAudienceTagsProps) {
  if (items.length === 0) return <>—</>

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {items.map((item) => (
        <Tag
          key={item.key}
          label={item.label}
          size="sm"
          variant={getMasterAudienceTagVariant(item.key)}
        />
      ))}
    </Box>
  )
}
