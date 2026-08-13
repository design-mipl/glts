import type { ApplicationMarketRankingPoint } from '../widgets/operations/ApplicationMarketInfographics'

/** Seed jurisdictions when live app.jurisdiction is sparse (Visa Analytics–aligned). */
export const SUBMISSION_JURISDICTION_SEED: ReadonlyArray<[string, number]> = [
  ['Delhi — UK VFS', 6],
  ['Mumbai — China Consulate', 5],
  ['Chennai — USA Consulate', 4],
  ['Hyderabad — Australia Consulate', 3],
  ['Kolkata — Schengen VFS', 3],
  ['Bengaluru — UAE VFS', 2],
]

function jurisdictionLabel(row: { jurisdiction?: string; country?: string }): string {
  const fromApp = row.jurisdiction?.trim()
  if (fromApp) return fromApp
  const country = row.country?.trim()
  if (!country) return 'Unassigned desk'
  return `${country} desk`
}

/** Merge live jurisdiction counts with seed rankings (share % of top rows). */
export function buildSubmissionByJurisdiction(
  rows: Array<{ jurisdiction?: string; country?: string }>,
  seed: ReadonlyArray<[string, number]> = SUBMISSION_JURISDICTION_SEED,
  limit = 10,
): ApplicationMarketRankingPoint[] {
  const live = new Map<string, number>()
  for (const row of rows) {
    const name = jurisdictionLabel(row)
    live.set(name, (live.get(name) ?? 0) + 1)
  }

  const merged = new Map(seed)
  for (const [name, value] of live) {
    merged.set(name, Math.max(merged.get(name) ?? 0, value))
  }

  const ranked = [...merged.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)

  const total = ranked.reduce((sum, r) => sum + r.value, 0) || 1
  return ranked.map((r) => ({
    ...r,
    sharePercent: Math.round((r.value / total) * 100),
  }))
}
