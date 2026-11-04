// Beginner Guide: X-Men. See batman.js for a fully commented example of the format.

export default {
  slug: 'getting-into-the-x-men',
  title: 'Getting Into the X-Men',
  character: 'X-Men',
  publisher: 'Marvel Comics',
  accent: '#f2a900',
  level: 'familiar',
  tagline: 'Dozens of spin-offs and decades of history. Here is a path through it.',
  audience:
    "Readers who know the X-Men from film or animation and want a clear route into the comics.",
  intro: [
    "The X-Men are one of the hardest comics to start, because there is not one X-Men series. For decades there have been many, with overlapping teams, spin-offs and crossovers.",
    "The way in is to read complete stories rather than chase a reading order. Each recommendation here is a self-contained story that shows why the X-Men matter.",
    "The guide begins with an accessible modern run, then covers the classics that every later story references.",
  ],
  heroComicIds: [
    'x-men-dark-phoenix-saga',
    'astonishing-x-men-gifted',
    'x-men-days-of-future-past',
    'house-of-x-powers-of-x',
  ],
  beforeYouStart: [
    {
      term: 'Mutant',
      definition:
        'In Marvel comics, a person born with an extra power. The X-Men are mutants who use their gifts to protect a world that fears them.',
    },
    {
      term: 'Run',
      definition:
        "A stretch of issues by the same writer or art team, such as Joss Whedon and John Cassaday's run on Astonishing X-Men.",
    },
    {
      term: 'Collected edition',
      definition:
        'A book that gathers several monthly issues into one story. The "collects" line tells you which issues are inside.',
    },
  ],
  steps: [
    {
      id: 'astonishing',
      comicId: 'astonishing-x-men-gifted',
      title: 'Astonishing X-Men Vol. 1: Gifted',
      issues: 'Astonishing X-Men #1–6',
      entry: 'start',
      why: 'A character-driven run designed to be welcoming. It introduces the team clearly and the main conflict, a possible "mutant cure", is easy to understand.',
      expect: 'Witty dialogue and a team that feels like a family.',
    },
    {
      id: 'dark-phoenix',
      comicId: 'x-men-dark-phoenix-saga',
      title: 'X-Men: The Dark Phoenix Saga',
      issues: 'X-Men #129–138',
      entry: 'easy',
      why: "The story many later X-Men comics refer back to. Understanding it explains why Jean Grey's name comes up so often.",
      expect: 'Classic 1980s superhero drama on a cosmic scale.',
    },
    {
      id: 'days-of-future-past',
      comicId: 'x-men-days-of-future-past',
      title: 'X-Men: Days of Future Past',
      issues: 'X-Men #141–142',
      entry: 'easy',
      why: 'Two issues that explain why the Sentinels are a major X-Men threat, in a story that has been adapted and referenced many times.',
      expect: 'A short, tense time-travel story.',
    },
    {
      id: 'god-loves',
      comicId: 'x-men-god-loves-man-kills',
      title: 'X-Men: God Loves, Man Kills',
      issues: 'Marvel Graphic Novel #5',
      entry: 'easy',
      why: 'It shows what the X-Men are really about: prejudice and how people respond to it. A standalone graphic novel, so no other reading is required.',
      expect: 'A serious, grounded story with a clear message.',
    },
    {
      id: 'new-x-men',
      comicId: 'new-x-men-e-is-for-extinction',
      title: 'New X-Men Vol. 1: E Is for Extinction',
      issues: 'New X-Men #114–117',
      entry: 'later',
      why: "A bold early-2000s reinvention of the team. It is more rewarding if you already know who the main X-Men are.",
      expect: 'Stylish, strange and full of big ideas.',
    },
    {
      id: 'house-of-x',
      comicId: 'house-of-x-powers-of-x',
      title: 'House of X / Powers of X',
      issues: 'House of X #1–6; Powers of X #1–6',
      entry: 'later',
      why: 'The 2019 relaunch that set the direction of the X-Men line. It is easier to appreciate once you know the characters.',
      expect: 'Dense, ambitious world-building across two interwoven series.',
    },
  ],
  paths: [
    {
      id: 'essentials',
      label: 'Just the Essentials',
      description: 'An accessible entry and the two classics everything refers back to.',
      stepIds: ['astonishing', 'dark-phoenix', 'days-of-future-past'],
    },
    {
      id: 'classic',
      label: 'Classic Starting Point',
      description: 'The 1980s stories that built the X-Men.',
      stepIds: ['god-loves', 'dark-phoenix', 'days-of-future-past'],
    },
    {
      id: 'modern',
      label: 'Modern Starting Point',
      description: 'Twenty-first-century X-Men, from an accessible run to a major relaunch.',
      stepIds: ['astonishing', 'new-x-men', 'house-of-x'],
    },
    {
      id: 'full',
      label: 'The Full Guide',
      description: 'Every recommendation in order.',
      stepIds: ['astonishing', 'dark-phoenix', 'days-of-future-past', 'god-loves', 'new-x-men', 'house-of-x'],
    },
  ],
  defaultPathId: 'essentials',
  whatsNext:
    'Once you have a favorite character or writer, use Discover to find more of their work.',
}
