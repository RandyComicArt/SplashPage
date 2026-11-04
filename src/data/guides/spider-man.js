// Beginner Guide: Spider-Man. See batman.js for a fully commented example of the format.

export default {
  slug: 'where-to-start-with-spider-man',
  title: 'Where to Start With Spider-Man',
  character: 'Spider-Man',
  publisher: 'Marvel Comics',
  accent: '#d2432f',
  level: 'beginner',
  tagline: "Spider-Man's main series has been restarted many times. These books skip the confusion.",
  audience:
    'Readers who know Spider-Man from movies or games and want a friendly first comic, with no prior reading.',
  intro: [
    "Spider-Man has been published since 1962, and his main series has restarted with new #1 issues many times. Picking the \"right\" issue number to begin with is genuinely confusing.",
    "The trick is to avoid the main series at first. Start with stories written to be complete, either a fresh retelling that skips the backstory or a short story that stands alone.",
    "Once one of these hooks you, the rest of Spider-Man's history gets much easier to explore.",
  ],
  heroComicIds: [
    'ultimate-spider-man-power-and-responsibility',
    'spider-man-life-story',
    'spider-man-blue',
    'miles-morales-ultimate-spider-man',
  ],
  beforeYouStart: [
    {
      term: 'Ultimate',
      definition:
        'A line of Marvel comics that began in 2000, set in a separate universe built for newcomers. It has its own history, so you never need the main comics to follow it.',
    },
    {
      term: 'Collected edition',
      definition:
        'A book that gathers several monthly issues into one story. The "collects" line tells you which issues are inside.',
    },
    {
      term: 'Miles Morales',
      definition:
        'A teenager who becomes Spider-Man in the Ultimate universe. He has since appeared in other Marvel comics and in film and games.',
    },
  ],
  steps: [
    {
      id: 'ultimate-1',
      comicId: 'ultimate-spider-man-power-and-responsibility',
      title: 'Ultimate Spider-Man Vol. 1: Power and Responsibility',
      issues: 'Ultimate Spider-Man #1–7',
      entry: 'start',
      why: "It retells Peter Parker's origin for a modern audience in a fresh continuity, so you don't need to know any earlier stories. It is written for people who have never read a Spider-Man comic.",
      expect: 'A fast, dialogue-heavy teen drama with the superhero story woven through it.',
    },
    {
      id: 'blue',
      comicId: 'spider-man-blue',
      title: 'Spider-Man: Blue',
      issues: 'Spider-Man: Blue #1–6',
      entry: 'easy',
      why: "A short, reflective story of Peter Parker's early romances. It shows what Spider-Man's main universe feels like without asking you to learn its history.",
      expect: 'Quiet and emotional, with soft, painterly art.',
    },
    {
      id: 'life-story',
      comicId: 'spider-man-life-story',
      title: 'Spider-Man: Life Story',
      issues: 'Spider-Man: Life Story #1–6',
      entry: 'easy',
      why: "Peter ages in real time across six issues, each set in a different decade. It is a guided tour of Spider-Man's history, told as one story.",
      expect: 'Each issue feels like a new era. It gives you the highlights, with an alternate twist.',
    },
    {
      id: 'miles',
      comicId: 'miles-morales-ultimate-spider-man',
      title: 'Miles Morales: Ultimate Spider-Man',
      issues: 'Ultimate Comics Spider-Man (2011)',
      entry: 'easy',
      why: "If you know Miles Morales from film or games, this is where his comics story starts. It is set in the same Ultimate universe as the first recommendation.",
      expect: 'A teenage hero finding his feet, with a modern tone.',
    },
    {
      id: 'kraven',
      comicId: 'spider-man-kravens-last-hunt',
      title: "Spider-Man: Kraven's Last Hunt",
      issues:
        'Web of Spider-Man #31–32; The Amazing Spider-Man #293–294; The Spectacular Spider-Man #131–132',
      entry: 'later',
      why: "One of the most acclaimed Spider-Man stories. It is darker and more psychological than most, so it is more rewarding once you know Spider-Man's usual tone.",
      expect: 'A serious, atmospheric story with little of the usual banter.',
    },
  ],
  paths: [
    {
      id: 'essentials',
      label: 'Just the Essentials',
      description: 'The friendliest way in, plus the story that tours his history.',
      stepIds: ['ultimate-1', 'blue', 'life-story'],
    },
    {
      id: 'modern',
      label: 'Modern Starting Point',
      description: 'Stories built for a modern audience, with no old continuity to learn.',
      stepIds: ['ultimate-1', 'miles', 'life-story'],
    },
    {
      id: 'classic',
      label: 'Classic Starting Point',
      description: "Stories set in Spider-Man's main universe, including a landmark 1980s tale.",
      stepIds: ['blue', 'kraven'],
    },
    {
      id: 'full',
      label: 'The Full Guide',
      description: 'Every recommendation in order.',
      stepIds: ['ultimate-1', 'blue', 'life-story', 'miles', 'kraven'],
    },
  ],
  defaultPathId: 'essentials',
  whatsNext:
    "Liked Spider-Man's world? Browse more Spider-Man comics in Discover and follow the writers and artists you enjoyed.",
}
