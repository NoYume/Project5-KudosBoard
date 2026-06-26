require("dotenv/config");
const prisma = require("../lib/prisma");

// Sample boards, each with a few cards, to demo the app.
const boards = [
  {
    title: "Project Launch Celebration",
    category: "celebration",
    imageUrl: "https://picsum.photos/seed/launch/400/300",
    author: "Della",
    cards: [
      {
        message: "We shipped on time — amazing teamwork!",
        gifUrl: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
        author: "Sam",
        upvotes: 5,
      },
      {
        message: "Best release demo I've ever seen.",
        gifUrl: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
        author: "Priya",
        upvotes: 2,
      },
    ],
  },
  {
    title: "Thank You, Support Team",
    category: "thank-you",
    imageUrl: "https://picsum.photos/seed/thanks/400/300",
    author: "Marcus",
    cards: [
      {
        message: "Thanks for staying late to unblock the deploy 🙏",
        gifUrl: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
        author: "Della",
        upvotes: 8,
      },
      {
        message: "You always answer my questions with patience.",
        gifUrl: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
        upvotes: 3,
      },
    ],
  },
  {
    title: "Daily Inspiration",
    category: "inspiration",
    imageUrl: "https://picsum.photos/seed/inspire/400/300",
    cards: [
      {
        message: "Done is better than perfect. Keep shipping!",
        gifUrl: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
        author: "Priya",
        upvotes: 12,
      },
    ],
  },
  {
    title: "Q2 Goals Smashed",
    category: "celebration",
    imageUrl: "https://picsum.photos/seed/q2/400/300",
    author: "Sam",
    cards: [],
  },
];

async function main() {
  // Start clean so re-seeding is idempotent.
  await prisma.card.deleteMany();
  await prisma.board.deleteMany();

  for (const { cards, ...board } of boards) {
    await prisma.board.create({
      data: {
        ...board,
        cards: { create: cards },
      },
    });
  }

  const boardCount = await prisma.board.count();
  const cardCount = await prisma.card.count();
  console.log(`Seeded ${boardCount} boards and ${cardCount} cards.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
