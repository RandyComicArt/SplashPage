// LOCAL STARTER CATALOG — series.
//
// This is a small, hand-checked development dataset, NOT a live feed.
// It exists so the UI has real shapes to render until a live comic API can
// be connected (see src/services/ and the README's "Data" section).
//
// Only include facts you are sure about. A missing field is better than a
// wrong one: the UI hides anything that is not provided.
//
// type: 'ongoing' | 'limited' | 'one-shot' | 'graphic-novel'

export const series = [
  // ----- Batman
  {
    id: 'batman-1940',
    title: 'Batman',
    publisher: 'DC Comics',
    startYear: 1940,
    type: 'ongoing',
    description:
      "DC's flagship Batman series, running since 1940 and restarted with new #1 issues several times. Because the numbering and creative teams change so often, collected editions are the easiest way in.",
  },
  {
    id: 'batman-2011',
    title: 'Batman (2011)',
    publisher: 'DC Comics',
    startYear: 2011,
    type: 'ongoing',
    description:
      "The 2011 relaunch of Batman, which restarted the numbering at #1 as part of DC's New 52 initiative.",
  },
  { id: 'the-dark-knight-returns', title: 'The Dark Knight Returns', publisher: 'DC Comics', startYear: 1986, type: 'limited', issueCount: 4 },
  { id: 'batman-long-halloween', title: 'Batman: The Long Halloween', publisher: 'DC Comics', startYear: 1996, type: 'limited', issueCount: 13 },
  { id: 'batman-killing-joke', title: 'Batman: The Killing Joke', publisher: 'DC Comics', startYear: 1988, type: 'one-shot' },
  { id: 'batman-white-knight', title: 'Batman: White Knight', publisher: 'DC Comics', startYear: 2017, type: 'limited', issueCount: 8 },

  // ----- Spider-Man
  {
    id: 'ultimate-spider-man',
    title: 'Ultimate Spider-Man',
    publisher: 'Marvel Comics',
    startYear: 2000,
    type: 'ongoing',
    description:
      "A 2000 reimagining of Spider-Man in the separate \"Ultimate\" continuity, designed so new readers didn't need to know decades of history.",
  },
  { id: 'ultimate-comics-spider-man', title: 'Ultimate Comics Spider-Man', publisher: 'Marvel Comics', startYear: 2011, type: 'ongoing' },
  { id: 'spider-man-blue', title: 'Spider-Man: Blue', publisher: 'Marvel Comics', startYear: 2002, type: 'limited', issueCount: 6 },
  {
    id: 'amazing-spider-man',
    title: 'The Amazing Spider-Man',
    publisher: 'Marvel Comics',
    startYear: 1963,
    type: 'ongoing',
    description:
      "Marvel's longest-running Spider-Man series. It has been restarted with new #1 issues several times, which is one reason newcomers find it hard to approach.",
  },
  { id: 'spider-man-life-story', title: 'Spider-Man: Life Story', publisher: 'Marvel Comics', startYear: 2019, type: 'limited', issueCount: 6 },

  // ----- X-Men
  {
    id: 'uncanny-x-men',
    title: 'The Uncanny X-Men',
    publisher: 'Marvel Comics',
    startYear: 1963,
    type: 'ongoing',
    description:
      'The original X-Men series, launched in 1963. It was published as X-Men for many years and was retitled The Uncanny X-Men with issue #142.',
  },
  { id: 'marvel-graphic-novel', title: 'Marvel Graphic Novel', publisher: 'Marvel Comics', startYear: 1982, type: 'graphic-novel' },
  { id: 'new-x-men', title: 'New X-Men', publisher: 'Marvel Comics', startYear: 2001, type: 'ongoing' },
  { id: 'astonishing-x-men-2004', title: 'Astonishing X-Men (2004)', publisher: 'Marvel Comics', startYear: 2004, type: 'ongoing' },
  { id: 'house-of-x-powers-of-x', title: 'House of X / Powers of X', publisher: 'Marvel Comics', startYear: 2019, type: 'limited', issueCount: 12 },

  // ----- Superman
  {
    id: 'superman-1939',
    title: 'Superman',
    publisher: 'DC Comics',
    startYear: 1939,
    type: 'ongoing',
    description: 'The long-running Superman series, which began in 1939.',
  },
  { id: 'all-star-superman', title: 'All-Star Superman', publisher: 'DC Comics', startYear: 2005, type: 'limited', issueCount: 12 },
  { id: 'superman-birthright', title: 'Superman: Birthright', publisher: 'DC Comics', startYear: 2003, type: 'limited', issueCount: 12 },
  { id: 'superman-for-all-seasons', title: 'Superman For All Seasons', publisher: 'DC Comics', startYear: 1998, type: 'limited', issueCount: 4 },
  { id: 'superman-red-son', title: 'Superman: Red Son', publisher: 'DC Comics', startYear: 2003, type: 'limited', issueCount: 3 },
  { id: 'superman-secret-origin', title: 'Superman: Secret Origin', publisher: 'DC Comics', startYear: 2009, type: 'limited', issueCount: 6 },
  { id: 'kingdom-come', title: 'Kingdom Come', publisher: 'DC Comics', startYear: 1996, type: 'limited', issueCount: 4 },
  { id: 'superman-up-in-the-sky', title: 'Superman: Up in the Sky', publisher: 'DC Comics', startYear: 2019, type: 'limited', issueCount: 6 },

  // ----- Daredevil
  {
    id: 'daredevil-1964',
    title: 'Daredevil',
    publisher: 'Marvel Comics',
    startYear: 1964,
    type: 'ongoing',
    description: 'The original Daredevil series, which launched in 1964.',
  },
  { id: 'daredevil-man-without-fear', title: 'Daredevil: The Man Without Fear', publisher: 'Marvel Comics', startYear: 1993, type: 'limited', issueCount: 5 },
  { id: 'daredevil-2011', title: 'Daredevil (2011)', publisher: 'Marvel Comics', startYear: 2011, type: 'ongoing' },
  { id: 'daredevil-yellow', title: 'Daredevil: Yellow', publisher: 'Marvel Comics', startYear: 2001, type: 'limited', issueCount: 6 },
  { id: 'daredevil-1998', title: 'Daredevil (1998)', publisher: 'Marvel Comics', startYear: 1998, type: 'ongoing' },

  // ----- More to explore
  { id: 'watchmen', title: 'Watchmen', publisher: 'DC Comics', startYear: 1986, type: 'limited', issueCount: 12 },
  { id: 'the-sandman', title: 'The Sandman', publisher: 'DC Comics', startYear: 1989, type: 'ongoing' },
  { id: 'ms-marvel-2014', title: 'Ms. Marvel (2014)', publisher: 'Marvel Comics', startYear: 2014, type: 'ongoing' },
  { id: 'hawkeye-2012', title: 'Hawkeye (2012)', publisher: 'Marvel Comics', startYear: 2012, type: 'ongoing' },
  { id: 'the-walking-dead', title: 'The Walking Dead', publisher: 'Image Comics', startYear: 2003, type: 'ongoing' },
  { id: 'wonder-woman-2011', title: 'Wonder Woman (2011)', publisher: 'DC Comics', startYear: 2011, type: 'ongoing' },
  { id: 'nimona', title: 'Nimona', publisher: 'HarperCollins', startYear: 2015, type: 'graphic-novel' },
  { id: 'monstress', title: 'Monstress', publisher: 'Image Comics', startYear: 2015, type: 'ongoing' },
]
