// Guide registry. To add a guide: create a file next to batman.js, import it
// here and add it to `guides`. The order below is the order guides appear in.

import batman from './batman.js'
import spiderMan from './spider-man.js'
import xMen from './x-men.js'
import superman from './superman.js'
import daredevil from './daredevil.js'

export const guides = [batman, spiderMan, xMen, superman, daredevil]

// How much comics knowledge a guide assumes.
export const guideLevels = {
  beginner: {
    label: 'No experience needed',
    description: 'Written for people who have never read the character, or any comics.',
  },
  familiar: {
    label: 'Know the character',
    description: 'Assumes you know the character from film, TV or games, but not the comics.',
  },
  returning: {
    label: 'Returning reader',
    description: 'For readers who have read comics before and want a fresh way back in.',
  },
}

// How hard each recommendation is to jump into.
export const entryLabels = {
  start: 'Start here',
  easy: 'Easy to follow',
  later: 'Better after the basics',
}

export function getGuideBySlug(slug) {
  return guides.find((guide) => guide.slug === slug)
}

export function getGuidesForCharacter(character) {
  return guides.filter((guide) => guide.character === character)
}

// Guides that recommend a particular comic (used on comic detail pages).
export function getGuidesForComic(comicId) {
  return guides.filter((guide) => guide.steps.some((step) => step.comicId === comicId))
}
