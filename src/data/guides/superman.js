// Beginner Guide: Superman. See batman.js for a fully commented example of the format.

export default {
  slug: 'essential-superman-stories',
  title: 'Essential Superman Stories',
  character: 'Superman',
  publisher: 'DC Comics',
  accent: '#1f6fe0',
  level: 'beginner',
  tagline: 'The first superhero, in a handful of stories that each stand on their own.',
  audience:
    'Anyone curious about Superman, including people who think he is too simple to be interesting.',
  intro: [
    "Superman is the first and best known superhero, and some people assume his comics are old-fashioned. The best Superman books show why that is not the case.",
    "DC has retold Superman's story many times, so the stories here are chosen because each works on its own. You can read them in almost any order.",
    "If you only read one, make it the first.",
  ],
  heroComicIds: [
    'all-star-superman',
    'superman-for-all-seasons',
    'superman-birthright',
    'superman-up-in-the-sky',
  ],
  beforeYouStart: [
    {
      term: 'Origin retelling',
      definition:
        "A new version of a hero's beginning. Superman's has been retold many times, so you can pick whichever version appeals most.",
    },
    {
      term: 'Elseworlds',
      definition:
        "DC's label for stories set outside the main timeline. Red Son and Kingdom Come are examples, so they never require outside reading.",
    },
    {
      term: 'Collected edition',
      definition:
        'A book that gathers several monthly issues into one story. The "collects" line tells you which issues are inside.',
    },
  ],
  steps: [
    {
      id: 'all-star',
      comicId: 'all-star-superman',
      title: 'All-Star Superman',
      issues: 'All-Star Superman #1–12',
      entry: 'start',
      why: 'A self-contained story built to show what makes Superman great. It assumes you know nothing, and it is often named as a favorite Superman story.',
      expect: 'Imaginative, hopeful and surprisingly moving.',
    },
    {
      id: 'for-all-seasons',
      comicId: 'superman-for-all-seasons',
      title: 'Superman For All Seasons',
      issues: 'Superman For All Seasons #1–4',
      entry: 'easy',
      why: "A warm story about Clark Kent's life, told by four people close to him. It focuses on character over spectacle.",
      expect: 'A gentle, nostalgic read.',
    },
    {
      id: 'birthright',
      comicId: 'superman-birthright',
      title: 'Superman: Birthright',
      issues: 'Superman: Birthright #1–12',
      entry: 'easy',
      why: 'A modern origin story that follows Clark through his early years. Useful if you want the "how it began" version.',
      expect: 'A straightforward superhero origin with clear stakes.',
    },
    {
      id: 'secret-origin',
      comicId: 'superman-secret-origin',
      title: 'Superman: Secret Origin',
      issues: 'Superman: Secret Origin #1–6',
      entry: 'easy',
      why: 'Another take on the origin, with more focus on his early days in Metropolis. Read it if you enjoy origin stories.',
      expect: 'A faster, more modern superhero style.',
    },
    {
      id: 'up-in-the-sky',
      comicId: 'superman-up-in-the-sky',
      title: 'Superman: Up in the Sky',
      issues: 'Superman: Up in the Sky #1–6',
      entry: 'easy',
      why: "A modern Superman adventure that works without prior knowledge. It shows what Superman does when the problem is bigger than punching.",
      expect: 'A quest across space with an emotional core.',
    },
    {
      id: 'red-son',
      comicId: 'superman-red-son',
      title: 'Superman: Red Son',
      issues: 'Superman: Red Son #1–3',
      entry: 'later',
      why: "A \"what if\" that is more interesting when you know the usual Superman. Out of continuity, so it never needs a refresher.",
      expect: 'A clever alternate history that asks big questions.',
    },
    {
      id: 'man-of-tomorrow',
      comicId: 'superman-whatever-happened-to-the-man-of-tomorrow',
      title: 'Superman: Whatever Happened to the Man of Tomorrow?',
      issues: 'Superman #423; Action Comics #583',
      entry: 'later',
      why: "A farewell to the older Superman, written by Alan Moore. It makes the most sense if you already know the classic cast.",
      expect: 'A loving tribute with a bittersweet tone.',
    },
    {
      id: 'kingdom-come',
      comicId: 'kingdom-come',
      title: 'Kingdom Come',
      issues: 'Kingdom Come #1–4',
      entry: 'later',
      why: "A painted epic about a possible future for DC's heroes. A good capstone once you know several of them.",
      expect: 'A dense, ambitious story with a lot of heroes.',
    },
  ],
  paths: [
    {
      id: 'essentials',
      label: 'Just the Essentials',
      description: 'Three self-contained stories that capture Superman.',
      stepIds: ['all-star', 'for-all-seasons', 'up-in-the-sky'],
    },
    {
      id: 'classic',
      label: 'Classic Starting Point',
      description: 'Stories that honor the classic version of Superman.',
      stepIds: ['for-all-seasons', 'man-of-tomorrow', 'all-star', 'kingdom-come'],
    },
    {
      id: 'modern',
      label: 'Modern Starting Point',
      description: 'Newer stories with a contemporary feel.',
      stepIds: ['birthright', 'secret-origin', 'up-in-the-sky'],
    },
    {
      id: 'full',
      label: 'The Full Guide',
      description: 'Every recommendation in order.',
      stepIds: ['all-star', 'for-all-seasons', 'birthright', 'secret-origin', 'up-in-the-sky', 'red-son', 'man-of-tomorrow', 'kingdom-come'],
    },
  ],
  defaultPathId: 'essentials',
  whatsNext:
    'Looking for more? Browse the other DC heroes in Discover.',
}
