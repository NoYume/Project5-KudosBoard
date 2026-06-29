require("dotenv/config");
const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

// Demo accounts. All share the same password for easy local testing.
// `owner` maps each board below to one of these usernames.
const DEMO_PASSWORD = "password123";
const users = [
  { username: "della", email: "della@example.com" },
  { username: "marcus", email: "marcus@example.com" },
  { username: "sam", email: "sam@example.com" },
];

// Sample boards, each with a few cards, to demo the app. `owner` is the
// username of the demo user who owns the board (used for owner-only delete).
const boards = [
  {
    title: "Project Launch Celebration",
    category: "celebration",
    imageUrl: "https://picsum.photos/seed/launch/400/300",
    author: "Della",
    owner: "della",
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
    owner: "marcus",
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
    author: "Sam",
    owner: "sam",
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
    owner: "sam",
    cards: [],
  },
];

async function main() {
  // Start clean so re-seeding is idempotent. TRUNCATE ... RESTART IDENTITY
  // also resets the autoincrement sequences so IDs start back at 1.
  await prisma.$executeRawUnsafe(
    'TRUNCATE "Card", "Board", "User" RESTART IDENTITY CASCADE;'
  );

  // Create demo users (all share DEMO_PASSWORD) and map username -> id.
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userIdByName = {};
  for (const { username, email } of users) {
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
    });
    userIdByName[username] = user.id;
  }

  for (const { cards, owner, ...board } of boards) {
    await prisma.board.create({
      data: {
        ...board,
        userId: owner ? userIdByName[owner] : null,
        cards: { create: cards },
      },
    });
  }

  const userCount = await prisma.user.count();
  const boardCount = await prisma.board.count();
  const cardCount = await prisma.card.count();
  console.log(
    `Seeded ${userCount} users, ${boardCount} boards and ${cardCount} cards.`
  );
  console.log(`Demo login — username: della / password: ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
