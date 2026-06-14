import { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseCard, ConfirmDialog, EmptyState, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { vendorService } from '@/shared/services/vendorService'
import type { Vendor } from '@/shared/types/vendor'
import { VendorDetailSummary } from '../components/VendorDetailSummary'
import { VendorActivityTab } from '../components/detail/VendorActivityTab'
import { VendorDocumentsTab } from '../components/detail/VendorDocumentsTab'
import { VendorFinanceTab } from '../components/detail/VendorFinanceTab'
import { VendorOverviewTab } from '../components/detail/VendorOverviewTab'
import { VendorServicesRatesTab } from '../components/detail/VendorServicesRatesTab'

export function VendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [vendor, setVendor] = useState<Vendor>()
  const [activeTab, setActiveTab] = useState('overview')
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('deactivate')

  const reload = useCallback(() => {
    if (!vendorId) return
    setVendor(vendorService.getById(vendorId))
    setLoading(false)
  }, [vendorId])

  useEffect(() => {
    reload()
  }, [reload])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!vendor) {
    return (
      <EmptyState
        variant="no-data"
        title="Vendor not found"
        action={{ label: 'Back to vendors', onClick: () => navigate('/admin/vendor-management/vendors') }}
      />
    )
  }

  const handleStatusConfirm = () => {
    const nextStatus = statusAction === 'activate' ? 'active' : 'inactive'
    vendorService.setStatus(vendor.id, nextStatus)
    showToast({
      title: nextStatus === 'active' ? 'Vendor activated' : 'Vendor deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    reload()
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Vendor Management', href: '/admin/vendor-management/vendors' },
          { label: 'Vendors', href: '/admin/vendor-management/vendors' },
          { label: vendor.vendorName },
        ]}
        summary={
          <VendorDetailSummary
            vendor={vendor}
            onEdit={() => navigate(`/admin/vendor-management/vendors/${vendor.id}/edit`)}
            onActivate={
              vendor.status === 'inactive'
                ? () => {
                    setStatusAction('activate')
                    setStatusOpen(true)
                  }
                : undefined
            }
            onDeactivate={
              vendor.status === 'active'
                ? () => {
                    setStatusAction('deactivate')
                    setStatusOpen(true)
                  }
                : undefined
            }
          />
        }
      >
        <BaseCard>
          <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              items={[
                { label: 'Overview', value: 'overview' },
                { label: 'Services & rates', value: 'services', badge: vendor.serviceMappings.length },
                { label: 'Documents', value: 'documents', badge: vendor.documents.length },
                { label: 'Finance', value: 'finance' },
                { label: 'Activity timeline', value: 'activity', badge: vendor.activities.length },
              ]}
              value={activeTab}
              onChange={setActiveTab}
              variant="underline"
              size="sm"
              scrollable
            />
          </Box>
          <Box sx={{ p: 2.5 }}>
            {activeTab === 'overview' ? <VendorOverviewTab vendor={vendor} /> : null}
            {activeTab === 'services' ? <VendorServicesRatesTab vendor={vendor} onUpdated={reload} /> : null}
            {activeTab === 'documents' ? <VendorDocumentsTab vendor={vendor} onUpdated={reload} /> : null}
            {activeTab === 'finance' ? <VendorFinanceTab vendor={vendor} /> : null}
            {activeTab === 'activity' ? <VendorActivityTab vendor={vendor} /> : null}
          </Box>
        </BaseCard>
      </AdminDetailShell>

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        onConfirm={handleStatusConfirm}
        title={statusAction === 'deactivate' ? 'Deactivate vendor?' : 'Activate vendor?'}
        description={`${statusAction === 'deactivate' ? 'Deactivate' : 'Activate'} "${vendor.vendorName}"?`}
        confirmLabel={statusAction === 'deactivate' ? 'Deactivate' : 'Activate'}
        variant={statusAction === 'deactivate' ? 'destructive' : 'default'}
      />
    </>
  )
}
