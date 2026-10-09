import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'

/** The same values used by components, paired with an intended role. */
export const semanticColorGroups = [
  { title: 'Brand', tokens: [
    ['brand.green', ds.semanticColor.brand.green, 'Primary actions and GLTS accents'],
    ['brand.teal', ds.semanticColor.brand.teal, 'Links, icons and expert guidance'],
    ['brand.navy', ds.semanticColor.brand.navy, 'Headings and major dark sections'],
  ] },
  { title: 'Text', tokens: [
    ['text.primary', ds.semanticColor.text.primary, 'Body copy on light surfaces'],
    ['text.secondary', ds.semanticColor.text.secondary, 'Supporting paragraphs'],
    ['text.muted', ds.semanticColor.text.muted, 'Nonessential metadata only'],
    ['text.inverse', ds.semanticColor.text.inverse, 'Headings and text on navy'],
  ] },
  { title: 'Surface', tokens: [
    ['surface.white', ds.semanticColor.surface.white, 'Default page and form surface'],
    ['surface.subtle', ds.semanticColor.surface.subtle, 'Quiet section background'],
    ['surface.elevated', ds.semanticColor.surface.elevated, 'Panels raised by a shared shadow'],
    ['surface.dark', ds.semanticColor.surface.dark, 'Major emphasis or CTA section'],
  ] },
  { title: 'Border', tokens: [
    ['border.subtle', ds.semanticColor.border.subtle, 'Low emphasis separators'],
    ['border.default', ds.semanticColor.border.default, 'Fields and regular panels'],
    ['border.strong', ds.semanticColor.border.strong, 'Hover and stronger grouping'],
  ] },
  { title: 'Interactive', tokens: [
    ['interactive.primaryDefault', ds.semanticColor.interactive.primaryDefault, 'Primary button at rest'],
    ['interactive.primaryHover', ds.semanticColor.interactive.primaryHover, 'Primary button on pointer hover'],
    ['interactive.primaryPressed', ds.semanticColor.interactive.primaryPressed, 'Primary button while pressed'],
    ['interactive.primaryDisabled', ds.semanticColor.interactive.primaryDisabled, 'Unavailable primary action'],
    ['interactive.focusRing', ds.semanticColor.interactive.focusRing, 'Visible keyboard focus ring'],
  ] },
  { title: 'Semantic', tokens: [
    ['status.success', ds.semanticColor.status.success, 'Verified or completed state'],
    ['status.warning', ds.semanticColor.status.warning, 'Attention needed'],
    ['status.error', ds.semanticColor.status.error, 'Missing or failed state'],
    ['status.information', ds.semanticColor.status.information, 'Neutral guidance and notices'],
  ] },
] as const

/** Suggested narrative order. Sections can be combined or omitted when content warrants it. */
export const pagePatterns = [
  { page: 'Home / Retail', steps: ['Hero', 'Visa discovery', 'Trust', 'How it works', 'Services', 'Proof', 'CTA', 'FAQ'], intent: 'Guide a traveler from exploration to a confident next step.' },
  { page: 'Marine', steps: ['Hero', 'Marine problem / why accuracy matters', 'Visa categories', 'Handling process', 'Destinations', 'Operational benefits / proof', 'CTA', 'FAQ'], intent: 'Lead with operational accuracy and show how crew movement is handled.' },
  { page: 'Corporate', steps: ['Hero', 'Business travel problem', 'GLTS solution', 'Corporate workflow', 'Account management / compliance', 'Proof', 'CTA', 'FAQ'], intent: 'Explain control, visibility and account support for business travel.' },
  { page: 'Services', steps: ['Hero', 'Primary services', 'Premium service / Visa Master', 'Supporting services', 'CTA'], intent: 'Move from the core offer to specialist and supporting services.' },
  { page: 'Destinations', steps: ['Intro', 'Search / filters', 'Results', 'Supporting information'], intent: 'Prioritize finding the right destination and its requirements.' },
  { page: 'About', steps: ['Story', 'Expertise', 'Evidence / milestones', 'Team / operations', 'Trust', 'CTA'], intent: 'Connect the company story to evidence of capability.' },
  { page: 'Legal', steps: ['Compact hero', 'Legal navigation', 'Document viewer'], intent: 'Make policies easy to locate and read.' },
] as const

export const usageGuidelines = [
  { component: 'Cards', use: 'Comparing options; independent items; selectable items; content needing clear separation.', avoid: 'Continuous stories, timelines, simple paragraphs, every small feature, or a list that reads better as rows.' },
  { component: 'Buttons', use: 'Primary for the main action; secondary for supporting action; text links for low emphasis navigation.', avoid: 'Multiple competing primary actions in one decision area.' },
  { component: 'Carousels', use: 'Horizontal browsing when the set is naturally browsable and controls are clear.', avoid: 'Hiding content only to reduce page height.' },
  { component: 'Dark sections', use: 'A major emphasis, CTA or premium service moment.', avoid: 'Alternating dark and light sections without narrative reason.' },
  { component: 'Images', use: 'A relevant subject that adds context or advances the story.', avoid: 'Decorative stock imagery with no purpose.' },
  { component: 'Accordions', use: 'Secondary or optional details such as FAQs.', avoid: 'Hiding primary information needed to make a decision.' },
] as const
