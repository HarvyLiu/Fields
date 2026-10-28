/**
 * ─────────────────────────────────────────────────────────────
 *  THE ONLY FILE YOU NEED TO EDIT TO RESHAPE THE WHOLE SITE
 * ─────────────────────────────────────────────────────────────
 *
 *  profiles   → who you are (name, thesis, contact)
 *  tabs       → the sections. Add one here and a tab, a page, a
 *               nav count and a layout all appear.
 *  fields     → what you work IN (disciplines). Used for filtering.
 *  impact     → what your work is FOR (values). A second, separate axis.
 *
 *  Delete an object from `tabs` and that whole section disappears —
 *  nav, route, and its entries are filtered out. Nothing breaks.
 */

/**
 * 'about' is a single page of personal metadata (see `about` below),
 * not a list of entries — but it is registered as a tab like any other,
 * so its nav link, route and numeral come from the same registry.
 */
export type Layout = 'grid' | 'list' | 'timeline' | 'gallery' | 'about';

export interface Tab {
  /** URL slug: /projects */
  id: string;
  /** Tab label */
  label: string;
  /** One line under the page title */
  blurb: string;
  /** How entries in this tab are drawn. 'gallery' reads a gallery file instead */
  layout: Layout;
  /** Set false to hide without deleting */
  enabled: boolean;
}

export interface Field {
  /** Referenced from entry frontmatter: fields: [cs] */
  id: string;
  label: string;
  /** Shown as a filter chip */
  short: string;
  blurb: string;
  /**
   * This field's ink on the DARK ground — so write it bright. A deep
   * ink here looks dead against near-black.
   */
  accent: string;
  /**
   * The same hue as an ink for the LIGHT ground. Leave it out and
   * `accent` is used there too, which will usually be too pale.
   */
  accentLight?: string;
}

export interface AboutItem {
  /** Small uppercase label on the left */
  label: string;
  /** The fact or sentence on the right */
  value: string;
}

/**
 * One block on the About page. Every field is optional except the three
 * that make the heading, so a section can be a paragraph, a list of
 * facts, a bullet list, a pull quote, links — or any combination.
 * Add, reorder or delete sections here; no component needs editing.
 */
export interface AboutSection {
  /** Anchor id, e.g. /about#background */
  id: string;
  /** Small uppercase word at the right of the heading */
  kicker: string;
  title: string;
  /** Opening paragraph */
  intro?: string;
  /** Further paragraphs of prose */
  paragraphs?: string[];
  /** Labelled facts, drawn as hairline rows */
  items?: AboutItem[];
  /** Bulleted lines */
  points?: string[];
  /** Pull quote, set in the display face */
  quote?: string;
  quoteBy?: string;
  /** Pill links at the foot of the section */
  links?: { label: string; href: string }[];
}

export const profile = {
  name: 'Aria Chen',
  location: 'Portland, Oregon',
  /** Your one-sentence argument. Every page echoes it. */
  thesis: 'I build quiet tools that make overlooked things legible.',
  /** Words inside `thesis` to paint in the accent colour. */
  thesisAccent: 'quiet tools',
  /** Small chip under the hero. Set to '' to hide it. */
  status: 'Open to 2027 intake',
  intro:
    'Computer science, English, and music — three vocabularies for the same question: who gets to be understood? I write software that widens access, and I write essays about what that access costs.',
  email: 'aria@example.com',
  /** Shows in the sidebar footer and on the overview */
  links: [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Writing', href: 'https://example.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/example' },
  ],
  /** Update this whenever you add work — shown in the footer */
  updated: '2026-10',
};

export const tabs: Tab[] = [
  {
    id: 'projects',
    label: 'Projects',
    blurb: 'Things I built, and what they actually changed.',
    layout: 'grid',
    enabled: true,
  },
  {
    id: 'writing',
    label: 'Writing',
    blurb: 'Essays, translations, and reviews. The argument in prose.',
    layout: 'grid',
    enabled: true,
  },
  {
    id: 'awards',
    label: 'Awards',
    blurb: 'Recognition, with the work it recognized.',
    layout: 'list',
    enabled: true,
  },
  {
    id: 'certificates',
    label: 'Certificates',
    blurb: 'Structured learning outside the classroom.',
    layout: 'list',
    enabled: true,
  },
  {
    id: 'events',
    label: 'Events',
    blurb: 'Where I showed up, and what I did while there.',
    layout: 'timeline',
    enabled: true,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    blurb: 'Photographs, scans, and the mess behind the work.',
    layout: 'gallery',
    enabled: true,
  },
  {
    id: 'about',
    label: 'About',
    blurb: 'The parts that do not fit in a project card.',
    layout: 'about',
    enabled: true,
  },
];

export const fields: Field[] = [
  {
    id: 'cs',
    label: 'Computer Science',
    short: 'CS',
    blurb: 'Software, systems, and the people who have to use them.',
    accent: '#5ee0b0',
    accentLight: '#0f5f4a',
  },
  {
    id: 'english',
    label: 'English & Writing',
    short: 'English',
    blurb: 'Close reading, essays, translation, and revision.',
    accent: '#f0a878',
    accentLight: '#8a4b2a',
  },
  {
    id: 'music',
    label: 'Music',
    short: 'Music',
    blurb: 'Performance, arranging, and the math underneath sound.',
    accent: '#b39dfa',
    accentLight: '#4a3f7a',
  },
];

/**
 * The second axis. These are values, not subjects: a project is
 * `fields: [cs]` AND `impact: [access]` at the same time.
 */
export const impact = {
  label: 'Social Impact',
  blurb:
    'Not a third subject — the reason the other two exist. I map specific work to the UN Sustainable Development Goals where the connection is honest, and leave it off where it is not.',
  tags: [
    { id: 'access', label: 'Access', note: 'Removing a barrier someone else built.' },
    { id: 'equity', label: 'Equity', note: 'Same starting line, not the same race.' },
    { id: 'care', label: 'Care', note: 'Showing up for people who are easy to skip.' },
    { id: 'climate', label: 'Climate', note: 'The ground everything else stands on.' },
  ],
};

/** Small tweaks that change the whole feel. */
export const theme = {
  /** Any CSS color. Drives the accent type, pills, and active tab.
   *  This one is used on the dark ground, where a light accent reads. */
  accent: '#d3b8ff',
  /** The same accent tuned for the light ground. It is used as text on
   *  a cream page and as a fill behind white text, so it must be dark
   *  enough to carry either. Leave it out and one is derived from
   *  `accent` automatically. */
  accentLight: '#5b3b8c',
  /** Multiplies vertical rhythm. 1 = default, 1.2 = airier. */
  density: 1,
};

/**
 * The About page. Seven blocks in the order they are read — identity,
 * character, the story, the wider interests, what you want from college,
 * the human details, and how to get in touch.
 *
 * Delete a block and it is gone. Reorder the array and the page follows.
 * `links` on the last block reuses `profile.links` above, so a profile
 * link is written once and appears everywhere.
 */
export const about: { sections: AboutSection[] } = {
  sections: [
    {
      id: 'identity',
      kicker: 'Identity',
      title: 'Student identity & goals',
      intro:
        'A senior in Portland applying to study computer science and English at the same time — not as a fallback, and not as a hedge. My transcript is lopsided in two directions on purpose: the systems courses teach me what a tool can do, and the seminars teach me who it is for.',
      items: [
        {
          label: 'Intended major',
          value:
            'Computer Science, with a second major in English and a writing concentration.',
        },
        {
          label: 'Why that major',
          value:
            'The hard part of software is not the software. It is being understood — by the person using it, and by the person who has to maintain it. I want formal training in both halves of that sentence.',
        },
        {
          label: 'Class year',
          value: 'Senior · applying for 2027 entry (Regular Decision).',
        },
        {
          label: 'Hometown',
          value:
            'Portland, Oregon, in a house with three languages and one landline. First-generation; my mother interprets at a hospital and my father repairs elevators.',
        },
      ],
    },
    {
      id: 'qualities',
      kicker: 'Strengths',
      title: "What I'm like to work with",
      intro:
        'Self-descriptions are cheap, so here is what people actually ask me for instead.',
      items: [
        {
          label: 'Patient with confusion',
          value:
            'I re-explain without sighing. If someone does not get it, the failure is in the explanation, not in them.',
        },
        {
          label: 'Precise about sources',
          value:
            'I would rather write “seven of eleven students” than “most students”. I keep the receipts, including for my own claims.',
        },
        {
          label: 'Does the boring part',
          value:
            'The alt text, the migration, the second round of edits. Nobody claps for that work and it is what decides whether the thing ships.',
        },
        {
          label: 'Quiet in a room, loud on the page',
          value:
            'I am not the first person to speak in seminar. I am the one whose notes everyone borrows afterwards.',
        },
        {
          label: 'How others describe me',
          value:
            '“The one who read the documentation nobody else read.” My robotics coach adds “and too calm about it”, which he means as a compliment.',
        },
      ],
      quote: 'Weirdly calm when everything is on fire.',
      quoteBy: 'Robotics coach, after the regional qualifier',
    },
    {
      id: 'story',
      kicker: 'Origin',
      title: 'Why this field',
      intro:
        'I found accessibility the way most people do: by watching someone I love get excluded by a form.',
      paragraphs: [
        'My grandmother lost most of her sight when I was twelve. For a year I read her mail out loud at the kitchen table — bank statements, hospital letters, a recall notice for a kettle she had owned since 1994. Once, the tool that was supposed to read it for her said “graphic” sixty-one times and then stopped. The information was all there. It had simply been built by someone who could see it.',
        'So I rebuilt the reader as a science fair project, because I wanted the letter to be readable at nine at night when nobody was awake to read it aloud. It did not win much. I still list it first, because it is the first time I understood that a technical decision is also a decision about who is allowed to participate.',
        'The English half arrived later and more slowly, in a translation workshop where the same paragraph had to be rendered four ways and defended each time. Both fields turned out to be the same question — what does this sentence mean to someone who is not me, and how would I know?',
      ],
      quote: '“Graphic” sixty-one times, and then nothing at all.',
      quoteBy: 'Braille reader, project notebook',
    },
    {
      id: 'beyond',
      kicker: 'Beyond the major',
      title: 'Interests outside it',
      intro:
        'Not hobbies I put on a form. Each of these shows up in the work somewhere, and each one is a course I would take whether or not it counted.',
      points: [
        'Morphology and creole grammar — why “ungrammatical” is usually a description of power rather than of language.',
        'The history of reading: silent reading, marginalia, and how the printed page trained attention long before a feed did.',
        'Cognitive science, specifically working memory — the reason every interface I design fails at the same step.',
        'The ethics of automated decisions: who audits a model, and what an audit is actually supposed to produce.',
        'Music theory, because counterpoint is the only formal system I know where four independent voices have to agree without any of them giving up.',
      ],
    },
    {
      id: 'college',
      kicker: 'What I want',
      title: "What I'm looking for in college",
      items: [
        {
          label: 'Opportunities',
          value:
            'An accessibility or HCI lab that ships to real users instead of a demo day. A writing center that hires undergraduates and trains them. A course that lets a CS project and an English seminar share the same work, rather than forcing me to choose which one counts.',
        },
        {
          label: 'Learning goals',
          value:
            'Get properly frightened by a systems course. Learn to run a study with humans in it without over-claiming the result. Write something long enough that I have to revise the argument, not just the sentences.',
        },
        {
          label: 'Environment',
          value:
            'Small seminars with people who argue in good faith. A disability community I can plug into rather than build from scratch. A place that does not treat a double major as indecision.',
        },
      ],
    },
    {
      id: 'context',
      kicker: 'Off the record',
      title: 'Quick context',
      intro:
        'The details that do not belong on a résumé but explain how I got here.',
      items: [
        {
          label: 'Languages',
          value:
            'English at home, Mandarin conversationally (my accent is a family joke), two years of ASL that I am slowly losing.',
        },
        {
          label: 'Instruments',
          value:
            'Cello for ten years, enough piano to accompany badly, and a synthesiser I do not fully understand.',
        },
        {
          label: 'Sports',
          value: 'Ultimate frisbee. I am the slow one who knows the rules.',
        },
        {
          label: 'Currently reading',
          value:
            'A biography of the Oxford English Dictionary, and too many essays about type design.',
        },
        {
          label: 'Making',
          value:
            'Bookbinding, badly but with good tools. Every notebook I use is hand-sewn.',
        },
      ],
    },
    {
      id: 'contact',
      kicker: 'Contact',
      title: 'Contact & next steps',
      intro:
        'Email is the fastest way to reach me — the first link below opens a message. I answer within two days during term, and I would rather get a short note than wait for a perfect one.',
      items: [
        {
          label: 'Preferred',
          value:
            'Email. It is the only inbox I check daily; anything sent to a school address will reach me a week late.',
        },
        {
          label: 'Also fine',
          value:
            'A video call, or a longer writing sample on request — the marginalia essay is the one I would send.',
        },
        {
          label: 'Ask me about',
          value:
            'The braille reader, the translation workshop, or a book you think I should be reading instead.',
        },
      ],
      links: [
        { label: 'Email', href: `mailto:${profile.email}` },
        ...profile.links,
      ],
    },
  ],
};

export const tabById = (id: string) => tabs.find((t) => t.id === id);
export const fieldById = (id: string) => fields.find((f) => f.id === id);
export const impactById = (id: string) => impact.tags.find((t) => t.id === id);

export const activeTabs = () => tabs.filter((t) => t.enabled);
