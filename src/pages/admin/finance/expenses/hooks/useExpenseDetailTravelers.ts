import { useEffect, useMemo, useState } from 'react'
import { buildOverviewFromDetail } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { VerifyOverviewData } from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { ApplicationExpenseDetailView } from '@/shared/types/applicationExpenseManagement'

export function useExpenseDetailTravelers(
  applicationId: string,
  expenseDetail: ApplicationExpenseDetailView,
) {
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null)

  const applicationDetail = useMemo(
    () => marineApplicationAdminService.getDetail(applicationId),
    [applicationId],
  )

  const isBulk = expenseDetail.recordType === 'bulk'

  const selectableRows = useMemo(() => {
    const verified = applicationDetail.uploadQueueRows.filter(row => row.status === 'verified')
    if (verified.length > 0) return verified
    return applicationDetail.uploadQueueRows.filter(row => row.status !== 'processing')
  }, [applicationDetail.uploadQueueRows])

  const singleListing = !isBulk && selectableRows.length <= 1

  const overview = useMemo(
    () =>
      buildOverviewFromDetail(applicationId, isBulk, applicationDetail.uploadQueueRows, {
        country: expenseDetail.visaCountry,
        countryFlag: '',
        visaType: expenseDetail.visaType,
        travelDate: expenseDetail.travelDate,
        jurisdiction: expenseDetail.jurisdiction,
      }),
    [applicationId, isBulk, applicationDetail.uploadQueueRows, expenseDetail],
  )

  const summaryOverview = useMemo(() => toApplicationReviewOverview(overview), [overview])

  const selectedRow = useMemo((): UploadQueueRow | null => {
    if (selectableRows.length === 0) return null

    if (selectedTravelerId) {
      const match = selectableRows.find(row => row.id === selectedTravelerId)
      if (match) return match
    }

    return selectableRows[0]
  }, [selectableRows, selectedTravelerId])

  useEffect(() => {
    if (!selectedRow) return
    if (selectedTravelerId !== selectedRow.id) {
      setSelectedTravelerId(selectedRow.id)
    }
  }, [selectedRow, selectedTravelerId])

  const expenseByPassengerId = useMemo(
    () => new Map(expenseDetail.passengers.map(p => [p.passengerId, p.individualExpenseTotal])),
    [expenseDetail.passengers],
  )

  const rankByPassengerId = useMemo(
    () => new Map(expenseDetail.passengers.map(p => [p.passengerId, p.rank])),
    [expenseDetail.passengers],
  )

  return {
    applicationDetail: applicationDetail as ApplicationDetailViewModel,
    selectableRows,
    singleListing,
    overview: overview as VerifyOverviewData,
    summaryOverview: summaryOverview as ApplicationReviewOverview,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    expenseByPassengerId,
    rankByPassengerId,
  }
}
