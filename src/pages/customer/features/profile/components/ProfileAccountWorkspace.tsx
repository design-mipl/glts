import { Box, Stack, Typography } from '@mui/material'
import { Building2, Download, MapPin } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { CustomerDetailWorkspace } from '@/pages/customer/features/shared/components/detail'
import { CustomerStatusChip, getCustomerStatusTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { useProfileAccount } from '../hooks/useProfileAccount'
import type { ProfileTabId } from '../types/accountWorkspace'
import { CompanyProfileTab } from './tabs/CompanyProfileTab'
import { BillingAgreementTab } from './tabs/BillingAgreementTab'
import { PersonalProfileTab } from './tabs/PersonalProfileTab'

const PROFILE_TABS = [
  { value: 'company', label: 'Company profile' },
  { value: 'billing', label: 'Billing & agreement' },
  { value: 'personal', label: 'Personal profile' },
] as const

const VALID_TABS = new Set<ProfileTabId>(['company', 'billing', 'personal'])

function parseTab(raw: string | null): ProfileTabId {
  if (raw && VALID_TABS.has(raw as ProfileTabId)) return raw as ProfileTabId
  return 'company'
}

function MetaItem({ icon, label }: { icon: ReactNode; label: string }) {
  const colors = usePublicBrandColors()
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" component="span">
      <Box component="span" sx={{ display: 'flex', color: colors.textMuted }}>
        {icon}
      </Box>
      <Typography component="span" sx={{ fontSize: 13, color: colors.textSecondary }}>
        {label}
      </Typography>
    </Stack>
  )
}

export function ProfileAccountWorkspace() {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const { base, companyName } = useCustomerPortalBase()
  const { workspace, updatePersonalAccount, setSessions } = useProfileAccount()
  const [personalEditToken, setPersonalEditToken] = useState(0)

  const tab = parseTab(searchParams.get('tab'))

  const setTab = useCallback(
    (next: string) => {
      const id = parseTab(next)
      setSearchParams({ tab: id }, { replace: true })
    },
    [setSearchParams],
  )

  const { company, billing, personal } = workspace
  const overview = company.overview
  const { billing: billingIdentity } = company

  const handleDownloadAgreement = useCallback(() => {
    showToast({ title: 'Agreement download queued', variant: 'info' })
  }, [showToast])

  const headerMeta = useMemo(
    () => (
      <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="center" useFlexGap>
        <MetaItem icon={<Building2 size={14} />} label={overview.companyType} />
        <Typography sx={{ color: colors.textMuted, fontSize: 13 }}>·</Typography>
        <MetaItem icon={<Building2 size={14} />} label={overview.customerCategory} />
        {billingIdentity.gstVerified && (
          <>
            <Typography sx={{ color: colors.textMuted, fontSize: 13 }}>·</Typography>
            <MetaItem icon={<Building2 size={14} />} label="GST registered" />
          </>
        )}
        <Typography sx={{ color: colors.textMuted, fontSize: 13 }}>·</Typography>
        <MetaItem icon={<MapPin size={14} />} label={company.operational.assignedBranch} />
      </Stack>
    ),
    [
      overview.companyType,
      overview.customerCategory,
      billingIdentity.gstVerified,
      company.operational.assignedBranch,
      colors.textMuted,
    ],
  )

  const headerStatus = useMemo(
    () => (
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        <CustomerStatusChip label={overview.companyStatus} tone={getCustomerStatusTone(overview.companyStatus)} />
        <CustomerStatusChip
          label={billing.agreement.status === 'active' ? 'Agreement active' : billing.agreement.status}
          tone={getCustomerStatusTone(billing.agreement.status)}
        />
      </Stack>
    ),
    [overview.companyStatus, billing.agreement.status],
  )

  const headerActions = useMemo(() => {
    if (tab === 'billing') {
      return (
        <Button variant="outlined" startIcon={<Download size={16} />} onClick={handleDownloadAgreement}>
          Download agreement PDF
        </Button>
      )
    }
    if (tab === 'personal') {
      return (
        <Button variant="outlined" onClick={() => setPersonalEditToken(t => t + 1)}>
          Edit personal information
        </Button>
      )
    }
    return undefined
  }, [tab, handleDownloadAgreement])

  return (
    <CustomerDetailWorkspace
      breadcrumbs={[
        { label: 'Dashboard', href: `${base}/dashboard` },
        { label: 'Profile & account' },
      ]}
      header={{
        title: overview.companyName || companyName,
        subtitle: `${company.operational.gltsTeam} · Onboarded ${overview.onboardingDate}`,
        meta: headerMeta,
        status: headerStatus,
        actions: headerActions,
      }}
      tabs={[...PROFILE_TABS]}
      tabValue={tab}
      onTabChange={setTab}
    >
      {tab === 'company' && <CompanyProfileTab data={company} />}
      {tab === 'billing' && <BillingAgreementTab data={billing} onDownloadAgreement={handleDownloadAgreement} />}
      {tab === 'personal' && (
        <PersonalProfileTab
          data={personal}
          onUpdateAccount={updatePersonalAccount}
          onSetSessions={setSessions}
          openEditRequestId={personalEditToken}
        />
      )}
    </CustomerDetailWorkspace>
  )
}
