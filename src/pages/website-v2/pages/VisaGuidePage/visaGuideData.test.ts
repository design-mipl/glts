import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { VisaGuidePage } from './index'
import { getVisaGuideCountry, toggleVisaGuideRequirement, visaGuideCategories } from './visaGuideData'

const expectedCounts = {
  business: 10,
  transit: 10,
  employment: 11,
  seamen: 11,
  tourist: 13,
} as const

function renderCategory(visaType?: string) {
  const url = visaType ? `/visa-guide/australia?visaType=${visaType}` : '/visa-guide/australia'
  return renderToStaticMarkup(createElement(
    MemoryRouter,
    { initialEntries: [url] },
    createElement(Routes, null, createElement(Route, {
      path: '/visa-guide/:countrySlug',
      element: createElement(VisaGuidePage),
    })),
  ))
}

describe('Australia Visa Guide legacy checklists', () => {
  const country = getVisaGuideCountry('australia')!

  it('opens the direct country route on Business Visa', () => {
    const html = renderCategory()
    expect(html).toContain('Business Visa Requirements')
    expect(html).toContain('aria-selected="true"')
  })

  for (const category of visaGuideCategories) {
    it(`renders ${category.label} with its own expandable rows`, () => {
      const requirements = country.categories[category.id].requirements
      const html = renderCategory(category.id)
      expect(requirements).toHaveLength(expectedCounts[category.id])
      expect(new Set(requirements.map(requirement => requirement.id)).size).toBe(requirements.length)
      expect(html).toContain(`${category.label} Requirements`)
      expect(html.match(/class="visa-guide-requirement-button"/g)).toHaveLength(requirements.length)
      expect(html.match(/aria-expanded="false"/g)).toHaveLength(requirements.length)
      expect(html).not.toContain('Checklist awaiting verification')
      for (const requirement of requirements) {
        expect(html).toContain(requirement.title)
        expect(html).toContain(requirement.summary)
      }
    })
  }

  it('keeps category-specific form numbers separate', () => {
    expect(country.categories.transit.requirements[1].details.join(' ')).toContain('Form 876')
    expect(country.categories.employment.requirements[1].details.join(' ')).toContain('Form 1066')
    expect(country.categories.tourist.requirements[1].details.join(' ')).toContain('Form 1419')
    expect(country.categories.seamen.requirements.some(requirement => requirement.id === 'original-cdc')).toBe(true)
  })

  it('expands rows independently and preserves each category’s open rows', () => {
    let expanded = toggleVisaGuideRequirement({}, 'transit', 'passport')
    expanded = toggleVisaGuideRequirement(expanded, 'transit', 'application-form')
    expanded = toggleVisaGuideRequirement(expanded, 'tourist', 'passport')
    expect(expanded.transit).toEqual(['passport', 'application-form'])
    expect(expanded.tourist).toEqual(['passport'])

    expanded = toggleVisaGuideRequirement(expanded, 'transit', 'passport')
    expect(expanded.transit).toEqual(['application-form'])
    expect(expanded.tourist).toEqual(['passport'])
  })
})
