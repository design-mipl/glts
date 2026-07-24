import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, useToast } from '@/design-system/UIComponents'
import { CustomerPageHeader } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  CONTACT_SUPPORT_SECTIONS,
  isContactSupportSectionId,
  type ContactSupportSectionId,
} from '../config/contactSupportSections'
import { ContactSupportWorkspaceShell } from '../components/contact/ContactSupportWorkspaceShell'
import {
  RaiseSupportRequestSection,
  validateSupportRequestForm,
} from '../components/contact/RaiseSupportRequestSection'
import { SupportHistorySection } from '../components/contact/SupportHistorySection'
import { SupportTicketConversationDrawer } from '../components/contact/SupportTicketConversationDrawer'
import { useSupportTickets } from '../hooks/useSupportTickets'

export function ContactSupportPage() {
  const { base } = useCustomerPortalBase()
  const navigate = useNavigate()
  const { '*': contactSplat } = useParams<{ '*': string }>()
  const { showToast } = useToast()
  const ticketsApi = useSupportTickets()

  const [conversationTicketId, setConversationTicketId] = useState<string | null>(null)

  const activeSectionId: ContactSupportSectionId = useMemo(() => {
    const subsection = (contactSplat ?? '').replace(/^\/+/, '').split('/')[0]
    if (subsection === 'history') return 'history'
    return 'raise-request'
  }, [contactSplat])

  useEffect(() => {
    if (activeSectionId === 'history') {
      ticketsApi.refresh()
    }
  }, [activeSectionId, ticketsApi.refresh])

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      if (!isContactSupportSectionId(sectionId)) return
      if (sectionId === 'raise-request') {
        navigate(`${base}/support/contact`)
        return
      }
      navigate(`${base}/support/contact/${sectionId}`)
    },
    [base, navigate],
  )

  const handleSaveDraft = () => {
    ticketsApi.saveDraft()
    showToast({
      title: 'Draft saved',
      description: 'Your support request draft has been saved locally.',
      variant: 'success',
    })
  }

  const handleSubmitTicket = () => {
    const error = validateSupportRequestForm(ticketsApi)
    if (error) {
      showToast({ title: error, variant: 'warning' })
      return
    }
    const ticket = ticketsApi.submitTicket(ticketsApi.draft)
    showToast({
      title: 'Ticket submitted',
      description: `${ticket.ticketNumber} has been created. Our team will respond shortly.`,
      variant: 'success',
    })
    navigate(`${base}/support/contact/history`)
    setConversationTicketId(ticket.id)
  }

  const activeSection = useMemo(
    () => CONTACT_SUPPORT_SECTIONS.find(section => section.id === activeSectionId) ?? CONTACT_SUPPORT_SECTIONS[0],
    [activeSectionId],
  )

  const sectionBody = useMemo(() => {
    if (activeSectionId === 'history') {
      return (
        <SupportHistorySection
          ticketsApi={ticketsApi}
          onViewConversation={setConversationTicketId}
        />
      )
    }
    return <RaiseSupportRequestSection ticketsApi={ticketsApi} />
  }, [activeSectionId, ticketsApi])

  const contentPanel = useMemo(
    () => (
      <Stack spacing={3}>
        <Box sx={{ px: 0.5 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
            {activeSection.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 560 }}>
            {activeSection.description}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ px: 0.5, pt: 0.5 }}>{sectionBody}</Box>
      </Stack>
    ),
    [activeSection, sectionBody],
  )

  const footer =
    activeSectionId === 'raise-request' ? (
      <Stack direction="row" spacing={1.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
        <Button type="button" variant="outlined" onClick={() => ticketsApi.resetDraft()}>
          Clear form
        </Button>
        <Button type="button" variant="outlined" onClick={handleSaveDraft}>
          Save as Draft
        </Button>
        <Button type="button" onClick={handleSubmitTicket}>
          Submit Ticket
        </Button>
      </Stack>
    ) : undefined

  return (
    <Box>
      <CustomerPageHeader
        title="Contact Support"
        subtitle="Raise support requests, track ticket history, and continue conversations with our team."
      />

      <Box sx={{ mt: 3 }}>
        <ContactSupportWorkspaceShell
          sections={CONTACT_SUPPORT_SECTIONS}
          activeSectionId={activeSectionId}
          onSectionClick={handleSectionClick}
          contentPanel={contentPanel}
          footer={footer}
        />
      </Box>

      <SupportTicketConversationDrawer
        open={conversationTicketId !== null}
        ticketId={conversationTicketId}
        ticketsApi={ticketsApi}
        onClose={() => setConversationTicketId(null)}
      />
    </Box>
  )
}
