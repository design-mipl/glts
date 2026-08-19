import { useState, useEffect } from 'react'
import {
  getAllCountries,
  searchCountries,
  filterCountries,
} from '../services/visaService'
import type { Country } from '../types/visa'

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setCountries(getAllCountries())
    } catch {
      setError('Failed to load countries')
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    countries,
    loading,
    error,
    search: searchCountries,
    filter: filterCountries,
  }
}
