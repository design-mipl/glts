import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'

interface VaultItem {
  id: string
  category: string
  fileName: string
}

function buildVaultItems(record: OperationalCase): VaultItem[] {
  const items: VaultItem[] = []

  record.attachmentNames.forEach((fileName, index) => {
    items.push({
      id: `attachment-${index}`,
      category: 'Operational attachment',
      fileName,
    })
  })

  record.groundServices.forEach(service => {
    if (service.receiptFileName) {
      items.push({
        id: `service-${service.id}`,
        category: `${service.serviceName} receipt`,
        fileName: service.receiptFileName,
      })
    }
  })

  record.expenses.forEach(expense => {
    if (expense.receiptFileName) {
      items.push({
        id: `expense-${expense.id}`,
        category: expense.isExtra ? `${expense.serviceName} (extra)` : expense.serviceName,
        fileName: expense.receiptFileName,
      })
    }
  })

  return items
}

export function OperationalDocumentVault({ record }: { record: OperationalCase }) {
  const items = useMemo(() => buildVaultItems(record), [record])

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
        No documents uploaded for this passenger yet.
      </Typography>
    )
  }

  return (
    <Stack spacing={0.75}>
      {items.map(item => (
        <Stack
          key={item.id}
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ color: 'text.secondary', display: 'flex', pt: 0.15 }}>
            <FileText size={16} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
              {item.category}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 12 }} noWrap title={item.fileName}>
              {item.fileName}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}
