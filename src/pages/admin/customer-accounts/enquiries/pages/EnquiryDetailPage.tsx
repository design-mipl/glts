import { useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Tabs, BaseCard, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { enquiryService } from '@/shared/services/enquiryService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { AddFollowupModal, type FollowupModalValue } from '../components/AddFollowupModal'
import { AssignmentModal, type AssignmentModalValue } from '../components/AssignmentModal'
import { ConvertToQuotationDialog } from '../components/ConvertToQuotationDialog'
import { EnquiryDetailSummary } from '../components/EnquiryDetailSummary'
import { ActivityTimelineTab } from '../components/detail/ActivityTimelineTab'
import { AssignmentOwnershipTab } from '../components/detail/AssignmentOwnershipTab'
import { FollowupsTab } from '../components/detail/FollowupsTab'
import { InternalNotesTab } from '../components/detail/InternalNotesTab'
import { OverviewTab } from '../components/detail/OverviewTab'
import { useEnquiryDetailState } from '../hooks/useEnquiryDetailState'
import { getEnquiryActor } from '../utils/enquiryActor'

const ENQUIRY_LISTING_PATH = '/admin/customer-accounts/enquiries'

const initialAssignment: AssignmentModalValue = {
  assignedTeam: '',
  assignedUser: '',
  branch: '',
  priority: 'medium',
  slaTarget: '',
  assignmentNotes: '',
}

const initialFollowup: FollowupModalValue = {
  followupType: 'call',
  followupDate: '',
  followupTime: '10:00',
  discussionSummary: '',
  nextAction: '',
  assignedUser: '',
  reminderRequired: true,
  followupStatus: 'scheduled',
  outcome: '',
}

export function EnquiryDetailPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, ENQUIRY_LISTING_PATH)
  const { enquiryId } = useParams<{ enquiryId: string }>()
  const { loading, enquiry, reload } = useEnquiryDetailState(enquiryId)

  const [activeTab, setActiveTab] = useState('overview')
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [convertModalOpen, setConvertModalOpen] = useState(false)

  const [assignmentValue, setAssignmentValue] = useState(initialAssignment)
  const [followupValue, setFollowupValue] = useState(initialFollowup)
  const [internalNotes, setInternalNotes] = useState('')

  const tabs = useMemo(
    () => [
      { label: 'Overview', value: 'overview' },
      { label: 'Follow-ups', value: 'followups', badge: enquiry?.followups.length ?? 0 },
      { label: 'Activity', value: 'activity', badge: enquiry?.activities.length ?? 0 },
      { label: 'Team notes', value: 'notes' },
      { label: 'Assignment', value: 'assignment' },
    ],
    [enquiry],
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!enquiry) {
    return (
      <EmptyState
        variant="no-data"
        title="Enquiry not found"
        description="This enquiry may have been removed or the link is incorrect."
        action={{
          label: 'Back to enquiries',
          onClick: () => navigate(listingHref),
        }}
      />
    )
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Client Management', href: listingHref },
          { label: 'Lead Management', href: listingHref },
          { label: enquiry.id },
        ]}
        summary={
          <EnquiryDetailSummary
            enquiry={enquiry}
            onEdit={() => navigate(`/admin/customer-accounts/enquiries/${enquiry.id}/edit`)}
            onConvert={() => setConvertModalOpen(true)}
          />
        }
      >
        <BaseCard sx={{ p: 0, overflow: 'hidden' }}>
          <Tabs items={tabs} value={activeTab} onChange={setActiveTab} variant="underline" size="sm" />
          <Box sx={{ p: 2 }}>
            {activeTab === 'overview' ? (
              <OverviewTab
                enquiry={enquiry}
                onUploadAttachment={async () => {
                  await enquiryService.uploadAttachment(
                    enquiry.id,
                    `requirements-${Date.now()}.pdf`,
                    getEnquiryActor(),
                  )
                  showToast({ title: 'Attachment uploaded', variant: 'success' })
                  await reload()
                }}
              />
            ) : null}
            {activeTab === 'followups' ? (
              <FollowupsTab
                enquiry={enquiry}
                onAdd={() => setFollowupModalOpen(true)}
                onMarkComplete={async (followupId) => {
                  await enquiryService.completeFollowup(enquiry.id, followupId, getEnquiryActor())
                  await reload()
                }}
              />
            ) : null}
            {activeTab === 'activity' ? <ActivityTimelineTab enquiry={enquiry} /> : null}
            {activeTab === 'notes' ? (
              <InternalNotesTab
                value={internalNotes || enquiry.notes.internalNotes || ''}
                onChange={setInternalNotes}
                onSave={async () => {
                  await enquiryService.addNote(enquiry.id, internalNotes, getEnquiryActor())
                  setInternalNotes('')
                  showToast({ title: 'Note saved', variant: 'success' })
                  await reload()
                }}
              />
            ) : null}
            {activeTab === 'assignment' ? (
              <AssignmentOwnershipTab
                enquiry={enquiry}
                onEdit={() => {
                  setAssignmentValue({
                    assignedTeam: enquiry.assignment.assignedTeam ?? '',
                    assignedUser: enquiry.assignment.assignedUser ?? '',
                    branch: enquiry.assignment.branch ?? '',
                    priority: enquiry.assignment.priority,
                    slaTarget: enquiry.assignment.slaTarget?.slice(0, 10) ?? '',
                    assignmentNotes: enquiry.assignment.assignmentNotes ?? '',
                  })
                  setAssignmentModalOpen(true)
                }}
              />
            ) : null}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <AssignmentModal
        open={assignmentModalOpen}
        value={assignmentValue}
        onClose={() => setAssignmentModalOpen(false)}
        onChange={setAssignmentValue}
        onSubmit={async () => {
          await enquiryService.assignOwner(
            enquiry.id,
            {
              assignedTeam: assignmentValue.assignedTeam,
              assignedUser: assignmentValue.assignedUser,
              branch: assignmentValue.branch,
              priority: assignmentValue.priority as typeof enquiry.assignment.priority,
              slaTarget: assignmentValue.slaTarget,
              assignmentNotes: assignmentValue.assignmentNotes,
            },
            getEnquiryActor(),
          )
          setAssignmentModalOpen(false)
          showToast({ title: 'Assignment updated', variant: 'success' })
          await reload()
        }}
      />

      <AddFollowupModal
        open={followupModalOpen}
        value={followupValue}
        onClose={() => setFollowupModalOpen(false)}
        onChange={setFollowupValue}
        onSubmit={async () => {
          await enquiryService.addFollowup(
            enquiry.id,
            {
              ...followupValue,
              followupType: followupValue.followupType as 'call',
              followupStatus: followupValue.followupStatus as 'scheduled',
              createdBy: getEnquiryActor(),
            },
            getEnquiryActor(),
          )
          setFollowupModalOpen(false)
          setFollowupValue(initialFollowup)
          showToast({ title: 'Follow-up scheduled', variant: 'success' })
          await reload()
        }}
      />

      <ConvertToQuotationDialog
        open={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        onConfirm={async () => {
          const result = await enquiryService.convertToQuotation(enquiry.id, getEnquiryActor())
          if (result.ok) {
            showToast({ title: `Quotation ${result.quotationId} generated`, variant: 'success' })
            setConvertModalOpen(false)
            await reload()
            navigate(`/admin/customer-accounts/quotations/${result.quotationId}`)
            return
          }
          showToast({ title: 'Unable to convert enquiry', variant: 'error' })
        }}
      />
    </>
  )
}
