export type CountrySortMode = 'default' | 'alphabetical'

function sortGroup<T extends { id: string; name: string }>(
  items: T[],
  mode: CountrySortMode,
  indexById: Map<string, number>,
): T[] {
  if (mode === 'alphabetical') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  }
  return [...items].sort((a, b) => (indexById.get(a.id) ?? 0) - (indexById.get(b.id) ?? 0))
}

export function orderCountriesForDisplay<T extends { id: string; name: string }>(
  countries: T[],
  favoriteIds: Set<string>,
  mode: CountrySortMode,
): { favorites: T[]; others: T[] } {
  const indexById = new Map(countries.map((c, i) => [c.id, i]))
  const favorites: T[] = []
  const others: T[] = []

  for (const country of countries) {
    if (favoriteIds.has(country.id)) {
      favorites.push(country)
    } else {
      others.push(country)
    }
  }

  return {
    favorites: sortGroup(favorites, mode, indexById),
    others: sortGroup(others, mode, indexById),
  }
}
