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
      include: { comments: true },
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
      include: { comments: true },
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
      include: { comments: true },
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

// PATCH /cards/:id/pin — toggle a card's pinned state.
async function togglePin(req, res) {
  try {
    const id = Number(req.params.id);
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }
    const pinned = !card.pinned;
    const updated = await prisma.card.update({
      where: { id },
      data: { pinned, pinnedAt: pinned ? new Date() : null },
      include: { comments: true },
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle pin" });
  }
}

// POST /cards/:id/comments — add a comment to a card.
async function addComment(req, res) {
  try {
    const cardId = Number(req.params.id);
    const { message, author } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const card = await prisma.card.findUnique({ where: { id: cardId } });
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const comment = await prisma.comment.create({
      data: { message, author: author || null, cardId },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
}

module.exports = {
  getCardsByBoard,
  createCard,
  upvoteCard,
  deleteCard,
  togglePin,
  addComment,
};
