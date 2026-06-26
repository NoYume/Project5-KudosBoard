const prisma = require("../lib/prisma");

// GET /boards/:boardId/cards — all cards for a board.
async function getCardsByBoard(req, res) {
  try {
    const boardId = Number(req.params.boardId);
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    const cards = await prisma.card.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
}

// POST /boards/:boardId/cards — add a card to a board.
async function createCard(req, res) {
  try {
    const boardId = Number(req.params.boardId);
    const { message, gifUrl, author } = req.body;

    if (!message || !gifUrl) {
      return res
        .status(400)
        .json({ error: "message and gifUrl are required" });
    }

    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const card = await prisma.card.create({
      data: { message, gifUrl, author: author || null, boardId },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: "Failed to create card" });
  }
}

// PATCH /cards/:id/upvote — increment a card's upvote count.
async function upvoteCard(req, res) {
  try {
    const id = Number(req.params.id);
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    const updated = await prisma.card.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to upvote card" });
  }
}

// DELETE /cards/:id — delete a card.
async function deleteCard(req, res) {
  try {
    const id = Number(req.params.id);
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    const deleted = await prisma.card.delete({ where: { id } });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete card" });
  }
}

module.exports = {
  getCardsByBoard,
  createCard,
  upvoteCard,
  deleteCard,
};
