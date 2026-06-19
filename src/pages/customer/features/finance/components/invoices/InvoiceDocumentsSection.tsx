import { Stack } from '@mui/material'
import { Download } from 'lucide-react'
import { Button, useToast } from '@/design-system/UIComponents'
import type { Invoice } from '@/shared/types/invoice'
import { customerFinanceService } from '@/shared/services/customerFinanceService'

interface InvoiceDocumentsSectionProps {
  invoice: Invoice
}

export function InvoiceDocumentsSection({ invoice }: InvoiceDocumentsSectionProps) {
  const { showToast } = useToast()
  const creditNotes = customerFinanceService
    .listSessionInvoices()
    .filter(i => i.sourceInvoiceId === invoice.id && i.invoiceType === 'credit_note')

  const handleDownload = (name: string) => {
    showToast({ title: 'Download started', description: name, variant: 'success' })
  }

  return (
    <Stack spacing={1}>
      {invoice.attachments.map(att => (
        <Button
          key={att.id}
          label={`Download ${att.name}`}
          variant="outlined"
          size="sm"
          startIcon={<Download size={14} />}
          onClick={() => handleDownload(att.name)}
        />
      ))}
      {invoice.attachments.length === 0 && (
        <Button
          label={`Download ${invoice.invoiceId}.pdf`}
          variant="outlined"
          size="sm"
          startIcon={<Download size={14} />}
          onClick={() => handleDownload(`${invoice.invoiceId}.pdf`)}
        />
      )}
      {creditNotes.map(cn =>
        cn.attachments.length > 0 ? (
          cn.attachments.map(att => (
            <Button
              key={att.id}
              label={`Download credit note — ${att.name}`}
              variant="outlined"
              size="sm"
              startIcon={<Download size={14} />}
              onClick={() => handleDownload(att.name)}
            />
          ))
        ) : (
          <Button
            key={cn.id}
            label={`Download credit note — ${cn.invoiceId}.pdf`}
            variant="outlined"
            size="sm"
            startIcon={<Download size={14} />}
            onClick={() => handleDownload(`${cn.invoiceId}.pdf`)}
          />
        ),
      )}
    </Stack>
  )
}
