// Beginner Guide: Batman.
//
// This file is the reference example for the guide format.
// To add a guide: copy this file, edit the content, then register it in
// ./index.js. Run `npm run check:data` to make sure every comicId exists.
//
// Shape
//   slug            URL-safe id: /guides/<slug>
//   title, character, publisher
//   accent          hex color used for the guide's banner
//   level           'beginner' | 'familiar' | 'returning'  (see ./index.js)
//   audience        who the guide is written for
//   tagline         one-line summary
//   intro           array of paragraphs
//   heroComicIds    comics whose covers make up the banner artwork
//   beforeYouStart  small glossary of terms the guide relies on
//   steps           every recommendation, in the recommended reading order
//       id          unique within the guide
//       comicId     id from the catalog (powers the cover and link)
//       title/issues  shown even if the comic isn't in the catalog
//       entry       'start' | 'easy' | 'later'  — how hard it is to jump in
//       why         WHY it is on the list
//       expect      what the reading experience is like
//       note        optional heads-up (e.g. mature content)
//   paths           alternate routes through the same steps
//       defaultPathId says which one opens first
//   whatsNext       closing paragraph

export default {
  slug: 'where-to-start-with-batman',
  title: 'Where to Start With Batman',
  character: 'Batman',
  publisher: 'DC Comics',
  accent: '#3d4cf2',
  level: 'beginner',
  tagline: 'Batman has been in print since 1939. You only need a handful of books to understand him.',
  audience:
    "Anyone who knows Batman from movies, TV or games and wants to read the comics, with no comics experience needed.",
  intro: [
    "Batman has been in print since 1939. In that time DC has told thousands of stories, restarted its numbering several times and reshaped its continuity more than once. \"Just start at issue #1\" doesn't work here.",
    "The good news is that Batman suits self-contained stories unusually well. Most of the best-known Batman books are collected editions that tell a complete story in a few issues, with no homework required.",
    "This guide begins with who Batman is, widens out to Gotham's crime families and villains, and finishes with modern and out-of-continuity takes. Each recommendation explains why it's here, so you always know what you're getting into.",
  ],
  heroComicIds: [
    'batman-the-long-halloween',
    'batman-year-one',
    'batman-court-of-owls',
    'batman-hush',
  ],
  beforeYouStart: [
    {
      term: 'Collected edition',
      definition:
        'A book that gathers several monthly issues into one story, often called a trade paperback. Every recommendation here is one, so you never have to hunt for back issues.',
    },
    {
      term: 'Continuity',
      definition:
        "The shared history of a character and their universe. Some stories fit into the main timeline; others deliberately don't. Neither is better, but it helps to know which you're reading.",
    },
    {
      term: 'Relaunch',
      definition:
        'When a publisher restarts a series at issue #1 to give new readers a clean entry point. The Court of Owls belongs to one of these.',
    },
    {
      term: 'Out of continuity',
      definition:
        'Stories set outside the main timeline, such as alternate worlds and "what if" tales. They are usually friendly for newcomers because they stand alone.',
    },
    {
      term: 'Issue numbers',
      definition:
        'An issue (like #404) is one monthly comic. The "collects" line under each recommendation tells you which issues are inside the book.',
    },
  ],
  steps: [
    {
      id: 'year-one',
      comicId: 'batman-year-one',
      title: 'Batman: Year One',
      issues: 'Batman #404–407',
      entry: 'start',
      why: "It's the cleanest answer to \"who is Batman?\". The story follows Bruce Wayne's first year back in Gotham and, just as importantly, Jim Gordon's first year as an honest cop. It's four issues, grounded and self-contained, and its version of Gotham is the one many later stories and adaptations build on.",
      expect:
        'A tense, street-level crime story. Bruce is early in his career, still making mistakes.',
    },
    {
      id: 'long-halloween',
      comicId: 'batman-the-long-halloween',
      title: 'Batman: The Long Halloween',
      issues: 'Batman: The Long Halloween #1–13',
      entry: 'easy',
      why: "A strong second step because it widens the world. Crime families, a serial killer and the beginnings of Batman's rogues' gallery all fit into one mystery, and Harvey Dent's role shows how Gotham can break even its heroes.",
      expect:
        'A long, slow-burn noir mystery set in Batman\'s early years. It reads best in a few big sittings.',
    },
    {
      id: 'hush',
      comicId: 'batman-hush',
      title: 'Batman: Hush',
      issues: 'Batman #608–619',
      entry: 'easy',
      why: "A big, colorful blockbuster that parades much of Batman's supporting cast and villains past you, which makes it a useful way to meet everyone. Jim Lee's art makes it one of the most eye-catching Batman books.",
      expect:
        'A fast, plot-heavy mystery with big reveals. It leans on some earlier history, but the story is readable on its own.',
    },
    {
      id: 'court-of-owls',
      comicId: 'batman-court-of-owls',
      title: 'Batman Vol. 1: The Court of Owls',
      issues: 'Batman (2011) #1–7',
      entry: 'start',
      why: "The modern starting point. It begins at issue #1 of a 2011 relaunch, so you don't need anything that came before. It introduces a secret society hiding in Gotham's history and gives Batman a different kind of threat to face.",
      expect:
        'A horror-tinged thriller, full of twists and highly detailed art.',
    },
    {
      id: 'killing-joke',
      comicId: 'batman-the-killing-joke',
      title: 'Batman: The Killing Joke',
      issues: 'One-shot',
      entry: 'easy',
      why: "A short, influential Joker story, and, along with Year One and The Long Halloween, one of the books people reference most. Because it's a one-shot, it's easy to pick up whenever you like.",
      expect: 'A short, dark read that mixes the Joker\'s past with a present-day crime.',
      note: 'Contains mature content, including violence against a main character.',
    },
    {
      id: 'dark-knight-returns',
      comicId: 'batman-the-dark-knight-returns',
      title: 'Batman: The Dark Knight Returns',
      issues: 'The Dark Knight Returns #1–4',
      entry: 'later',
      why: "The story that changed how Batman was written. It shows an older, harder Batman in an alternate future, so it isn't part of the regular timeline. It lands best once you know the character it is reacting to.",
      expect:
        'Dense, satirical and angry, with a lot of 1980s news commentary woven in.',
      note: 'Contains mature content.',
    },
    {
      id: 'white-knight',
      comicId: 'batman-white-knight',
      title: 'Batman: White Knight',
      issues: 'Batman: White Knight #1–8',
      entry: 'later',
      why: "A modern \"what if\" that flips the usual hero and villain roles. It works best once you understand what the Joker means to Batman, so it makes a good capstone.",
      expect:
        'A provocative, stylish story set in its own version of Gotham.',
    },
  ],
  paths: [
    {
      id: 'essentials',
      label: 'Just the Essentials',
      description: 'Three books that cover who Batman is, what Gotham is like, and what modern Batman looks like.',
      stepIds: ['year-one', 'long-halloween', 'court-of-owls'],
    },
    {
      id: 'classic',
      label: 'Classic Starting Point',
      description: 'The stories that defined Batman in the 1980s and 1990s, in a sensible order.',
      stepIds: ['year-one', 'long-halloween', 'killing-joke', 'dark-knight-returns'],
    },
    {
      id: 'modern',
      label: 'Modern Starting Point',
      description: 'Newer stories with modern art and storytelling. No older reading required.',
      stepIds: ['court-of-owls', 'hush', 'white-knight'],
    },
    {
      id: 'full',
      label: 'The Full Guide',
      description: 'Every recommendation, ordered so each story builds on what you already know.',
      stepIds: [
        'year-one',
        'long-halloween',
        'hush',
        'court-of-owls',
        'killing-joke',
        'dark-knight-returns',
        'white-knight',
      ],
    },
  ],
  defaultPathId: 'essentials',
  whatsNext:
    "Once you've finished a path, the best next step is to follow what you enjoyed. Loved the mystery? Browse more Batman stories in Discover and look for the same writers and artists.",
}
