const prisma = require("../lib/prisma");

// Categories that can be stored on a board (per schema spec).
const VALID_CATEGORIES = ["celebration", "thank-you", "inspiration"];

// GET /boards — list boards, with optional category filter and title search.
async function getBoards(req, res) {
  try {
    const { category, search, mine } = req.query;

    const where = {};
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }
    if (category && category !== "all" && category !== "recent") {
      where.category = category;
    }

    // "My Boards" filter — only the authenticated user's boards. Guests get [].
    if (mine === "true") {
      if (!req.userId) {
        return res.status(200).json([]);
      }
      where.userId = req.userId;
    }

    // "recent" returns the 6 most recently created boards.
    if (category === "recent") {
      const boards = await prisma.board.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      return res.status(200).json(boards);
    }

    const boards = await prisma.board.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch boards" });
  }
}

// GET /boards/:id — single board including its cards.
async function getBoardById(req, res) {
  try {
    const id = Number(req.params.id);
    const board = await prisma.board.findUnique({
      where: { id },
      include: { cards: { include: { comments: true } } },
    });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.status(200).json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch board" });
  }
}

// POST /boards — create a board (requires auth; owner = current user).
async function createBoard(req, res) {
  try {
    const { title, category, imageUrl } = req.body;

    if (!title || !category || !imageUrl) {
      return res
        .status(400)
        .json({ error: "title, category, and imageUrl are required" });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `category must be one of: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    // Ownership and display author both come from the authenticated user.
    const board = await prisma.board.create({
      data: {
        title,
        category,
        imageUrl,
        author: req.username || null,
        userId: req.userId,
      },
    });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ error: "Failed to create board" });
  }
}

// DELETE /boards/:id — delete a board (cascade-deletes its cards).
async function deleteBoard(req, res) {
  try {
    const id = Number(req.params.id);
    const board = await prisma.board.findUnique({ where: { id } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    // Owned boards can only be deleted by their owner. Legacy/guest boards
    // (userId === null) have no owner, so anyone may delete them.
    if (board.userId !== null && board.userId !== req.userId) {
      return res.status(403).json({ error: "You do not own this board" });
    }
    const deleted = await prisma.board.delete({ where: { id } });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete board" });
  }
}

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
};
