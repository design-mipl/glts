import { useMemo, useState } from 'react'
import type { TeamMaster, TeamMasterFormData } from '@/shared/types/teamMaster'

export const INITIAL_TEAM_FORM: TeamMasterFormData = {
  name: '',
  description: '',
  status: 'active',
}

export function teamToFormData(row: TeamMaster): TeamMasterFormData {
  return {
    name: row.name,
    description: row.description,
    status: row.status,
  }
}

export function useTeamForm(initialData?: TeamMasterFormData) {
  const [formData, setFormData] = useState<TeamMasterFormData>(
    initialData ?? INITIAL_TEAM_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Team name is required'
    if (!formData.status) next.status = 'Status is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = (data?: TeamMasterFormData) => {
    setFormData(data ?? INITIAL_TEAM_FORM)
    setErrors({})
  }

  return { formData, setFormData, errors, isValid, validate, reset }
}
