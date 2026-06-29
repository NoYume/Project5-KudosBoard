// Seed data for the frontend-only milestone. Boards and cards live in memory
// (see BoardsContext); this gives the dashboard something to render on load.
// In Milestone 3 this is replaced by data fetched from the Express backend.

export const seedBoards = [
  {
    id: 1,
    title: 'Team Wins This Quarter',
    category: 'celebration',
    imageUrl:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1740&auto=format&fit=crop',
    author: 'Dana',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Thank You, Support Crew',
    category: 'thank-you',
    imageUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1740&auto=format&fit=crop',
    author: 'Marcus',
    createdAt: '2026-06-22T14:30:00.000Z',
  },
  {
    id: 3,
    title: 'Daily Inspiration',
    category: 'inspiration',
    imageUrl:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1740&auto=format&fit=crop',
    author: null,
    createdAt: '2026-06-24T09:15:00.000Z',
  },
  {
    id: 4,
    title: 'Launch Day Shoutouts',
    category: 'celebration',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1740&auto=format&fit=crop',
    author: 'Priya',
    createdAt: '2026-06-25T16:45:00.000Z',
  },
]

// Cards keyed by boardId.
export const seedCards = {
  1: [
    {
      id: 101,
      boardId: 1,
      message: 'We shipped the redesign two days early — incredible hustle!',
      gifUrl: 'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
      author: 'Dana',
      upvotes: 5,
      pinned: false,
      pinnedAt: null,
      createdAt: '2026-06-20T11:00:00.000Z',
      comments: [
        { id: 1001, message: 'So proud of this team!', author: 'Marcus', createdAt: '2026-06-20T12:00:00.000Z' },
      ],
    },
    {
      id: 102,
      boardId: 1,
      message: 'Record-breaking sprint. Coffee is on me Friday.',
      gifUrl: 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
      author: null,
      upvotes: 2,
      pinned: false,
      pinnedAt: null,
      createdAt: '2026-06-21T09:30:00.000Z',
      comments: [],
    },
  ],
  2: [
    {
      id: 201,
      boardId: 2,
      message: 'Thanks for staying late to fix the deploy. You rock.',
      gifUrl: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
      author: 'Marcus',
      upvotes: 8,
      pinned: false,
      pinnedAt: null,
      createdAt: '2026-06-22T15:00:00.000Z',
      comments: [],
    },
  ],
  3: [],
  4: [
    {
      id: 401,
      boardId: 4,
      message: 'Congrats on the launch — what a milestone!',
      gifUrl: 'https://media.giphy.com/media/l0MYEqEzwMWFCg8rm/giphy.gif',
      author: 'Priya',
      upvotes: 3,
      pinned: false,
      pinnedAt: null,
      createdAt: '2026-06-25T17:00:00.000Z',
      comments: [],
    },
  ],
}
