// Beginner Guide: Daredevil. See batman.js for a fully commented example of the format.

export default {
  slug: 'beginners-guide-to-daredevil',
  title: "Beginner's Guide to Daredevil",
  character: 'Daredevil',
  publisher: 'Marvel Comics',
  accent: '#b3261e',
  level: 'familiar',
  tagline: "A blind lawyer and a street-level vigilante. Daredevil's best stories are crime stories first.",
  audience:
    'Readers who know Daredevil from TV or film, or who are looking for a more grounded superhero comic.',
  intro: [
    "Daredevil is Matt Murdock, a blind lawyer in New York who fights crime at night. Compared with most superheroes, his stories are smaller in scale and closer to crime fiction.",
    "That makes him a good starting point, because his best stories do not depend on a huge cast or cosmic events. Each recommendation here can be read without outside reading.",
    "The guide begins with his origin, then moves to the story that defined him.",
  ],
  heroComicIds: [
    'daredevil-born-again',
    'daredevil-the-man-without-fear',
    'daredevil-by-mark-waid-vol-1',
    'daredevil-yellow',
  ],
  beforeYouStart: [
    {
      term: 'Street-level',
      definition:
        'Superhero stories set in neighborhoods and city streets rather than space or alternate worlds. Daredevil is a classic example.',
    },
    {
      term: 'Origin story',
      definition:
        "The story of how a hero begins. Daredevil's has been retold, so you can start with whichever version you like.",
    },
    {
      term: 'Collected edition',
      definition:
        'A book that gathers several monthly issues into one story. The "collects" line tells you which issues are inside.',
    },
  ],
  steps: [
    {
      id: 'man-without-fear',
      comicId: 'daredevil-the-man-without-fear',
      title: 'Daredevil: The Man Without Fear',
      issues: 'Daredevil: The Man Without Fear #1–5',
      entry: 'start',
      why: "A retelling of Daredevil's origin. It explains who Matt Murdock is, how he trained and why he fights, with no prior knowledge needed.",
      expect: 'A moody crime origin with strong visuals.',
    },
    {
      id: 'yellow',
      comicId: 'daredevil-yellow',
      title: 'Daredevil: Yellow',
      issues: 'Daredevil: Yellow #1–6',
      entry: 'easy',
      why: "A gentle, reflective look back at Daredevil's earliest days. It introduces his closest friends, Foggy Nelson and Karen Page.",
      expect: 'A quieter, more emotional story than most Daredevil comics.',
    },
    {
      id: 'born-again',
      comicId: 'daredevil-born-again',
      title: 'Daredevil: Born Again',
      issues: 'Daredevil #227–233',
      entry: 'easy',
      why: "Often called Daredevil's defining story. The Kingpin tears Matt's life apart and Matt must rebuild. It is written to be self-contained.",
      expect: 'Dark, intense and rich in character.',
    },
    {
      id: 'waid',
      comicId: 'daredevil-by-mark-waid-vol-1',
      title: 'Daredevil by Mark Waid Vol. 1',
      issues: 'Daredevil (2011) #1–6',
      entry: 'start',
      why: "A brighter modern take that begins at issue #1 of a relaunch. It is the best choice if you want a Daredevil comic that feels fresh and energetic.",
      expect: 'Stylish, adventurous and surprisingly cheerful.',
    },
    {
      id: 'guardian-devil',
      comicId: 'daredevil-guardian-devil',
      title: 'Daredevil: Guardian Devil',
      issues: 'Daredevil (1998) #1–8',
      entry: 'later',
      why: "A relaunch story about faith and trust that is more affecting if you already know Matt, Foggy and Karen.",
      expect: 'A dramatic story that mixes crime and faith.',
    },
  ],
  paths: [
    {
      id: 'essentials',
      label: 'Just the Essentials',
      description: 'His origin, his defining story, and a modern take.',
      stepIds: ['man-without-fear', 'born-again', 'waid'],
    },
    {
      id: 'classic',
      label: 'Classic Starting Point',
      description: 'The stories that shaped Daredevil, in order.',
      stepIds: ['man-without-fear', 'yellow', 'born-again'],
    },
    {
      id: 'modern',
      label: 'Modern Starting Point',
      description: 'Newer Daredevil, beginning at a relaunch.',
      stepIds: ['waid', 'guardian-devil'],
    },
    {
      id: 'full',
      label: 'The Full Guide',
      description: 'Every recommendation in order.',
      stepIds: ['man-without-fear', 'yellow', 'born-again', 'waid', 'guardian-devil'],
    },
  ],
  defaultPathId: 'essentials',
  whatsNext:
    'If you enjoy crime-flavored superhero stories, browse more in Discover using the Crime & Noir genre filter.',
}
