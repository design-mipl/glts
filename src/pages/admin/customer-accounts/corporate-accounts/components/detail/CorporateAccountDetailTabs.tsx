import { Grid, Stack, Typography } from '@mui/material'
import { Badge, Button } from '@/design-system/UIComponents'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import {
  billingTypeColor,
  billingTypeLabel,
  onboardingDocumentStatusLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../../../agreements/config/agreementStatusConfig'

export function OverviewTab({ account }: { account: CorporateAccount }) {
  const counts = corporateAccountService.getCounts(account)
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Super admin</Typography>
        <Typography variant="body2" fontWeight={600}>{account.superAdmin?.fullName ?? '—'}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Total admins</Typography>
        <Typography variant="body2">{counts.totalAdmins}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Typography variant="caption" color="text.secondary">Entities / Vessels</Typography>
        <Typography variant="body2">{counts.totalEntities} / {counts.totalVessels}</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="caption" color="text.secondary">Workflow flags</Typography>
        <Typography variant="body2">
          Marine {account.workflowConfig.marineWorkflowEnabled ? 'on' : 'off'} · Bulk {account.workflowConfig.bulkUploadEnabled ? 'on' : 'off'} · Retail {account.workflowConfig.retailWorkflowEnabled ? 'on' : 'off'} · Corporate {account.workflowConfig.corporateWorkflowEnabled ? 'on' : 'off'}
        </Typography>
      </Grid>
    </Grid>
  )
}

export function AdminsTab({
  account,
  onSendLogin,
}: {
  account: CorporateAccount
  onSendLogin: (adminId: string) => void
}) {
  const admins = [account.superAdmin, ...account.admins].filter(Boolean)
  return (
    <Stack spacing={1.5}>
      {admins.map((admin) => (
        <Stack key={admin!.id} direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
          <Stack>
            <Typography variant="body2" fontWeight={600}>{admin!.fullName}</Typography>
            <Typography variant="caption" color="text.secondary">{admin!.role} · {admin!.emailAddress}</Typography>
          </Stack>
          <Button label="Send login email" size="sm" variant="outlined" onClick={() => onSendLogin(admin!.id)} />
        </Stack>
      ))}
    </Stack>
  )
}

export function EntitiesTab({ account }: { account: CorporateAccount }) {
  const entities = account.entityIds.map((id) => entityMasterService.getById(id)).filter(Boolean)
  return (
    <Stack spacing={1}>
      {entities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No entities linked.</Typography>
      ) : (
        entities.map((e) => (
          <Typography key={e!.id} variant="body2">{e!.entityName} · {e!.contactPersonName} · {e!.status}</Typography>
        ))
      )}
    </Stack>
  )
}

export function VesselsTab({ account }: { account: CorporateAccount }) {
  const vessels = account.vesselIds.map((id) => vesselMasterService.getById(id)).filter(Boolean)
  return (
    <Stack spacing={1}>
      {vessels.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No vessels linked.</Typography>
      ) : (
        vessels.map((v) => (
          <Typography key={v!.id} variant="body2">{v!.vesselName} · {v!.vesselType} · {v!.status}</Typography>
        ))
      )}
    </Stack>
  )
}

export function BillingTab({ account }: { account: CorporateAccount }) {
  const agreement = commercialAgreementService.getById(account.agreementId)
  if (!agreement) return <Typography variant="body2" color="text.secondary">Agreement not found.</Typography>
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Badge label={workflowTypeLabel[agreement.workflowType]} color={workflowTypeColor[agreement.workflowType]} size="sm" />
        <Badge label={billingTypeLabel[agreement.billingType]} color={billingTypeColor[agreement.billingType]} size="sm" />
      </Stack>
      {agreement.pricingMatrix.map((row) => (
        <Typography key={row.id} variant="body2" color="text.secondary">{row.country} · {row.visaType} · ₹{row.serviceFee.toLocaleString('en-IN')}</Typography>
      ))}
    </Stack>
  )
}

export function DocumentsTab({ account }: { account: CorporateAccount }) {
  const agreement = commercialAgreementService.getById(account.agreementId)
  if (!agreement) return null
  return (
    <Stack spacing={1}>
      {agreement.documents.map((doc) => (
        <Typography key={doc.documentKey} variant="body2">{doc.name}: {onboardingDocumentStatusLabel[doc.status]}</Typography>
      ))}
    </Stack>
  )
}

export function ActivityTab({ account }: { account: CorporateAccount }) {
  return (
    <Stack spacing={1}>
      {account.activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No activity yet.</Typography>
      ) : (
        account.activities.map((act) => (
          <Typography key={act.id} variant="body2" color="text.secondary">{act.action} · {act.detail} · {new Date(act.timestamp).toLocaleString()}</Typography>
        ))
      )}
    </Stack>
  )
}
