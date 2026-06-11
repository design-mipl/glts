import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'glts:portal-favorite-countries'

function readFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

function writeFavoriteIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore quota / private mode errors
  }
}

export function useFavoriteCountries() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set(readFavoriteIds()))

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setFavoriteIds(new Set(readFavoriteIds()))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback(
    (countryId: string) => favoriteIds.has(countryId),
    [favoriteIds],
  )

  const toggleFavorite = useCallback((countryId: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (next.has(countryId)) {
        next.delete(countryId)
      } else {
        next.add(countryId)
      }
      writeFavoriteIds(Array.from(next))
      return next
    })
  }, [])

  return { favoriteIds, isFavorite, toggleFavorite }
}
