const express = require("express");
const {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
} = require("../controllers/boardController");
const {
  getCardsByBoard,
  createCard,
} = require("../controllers/cardController");
const { requireAuth, attachUser } = require("../middleware/auth");

// Mounted at /boards
const router = express.Router();

router.get("/", attachUser, getBoards); // attachUser enables the ?mine=true filter
router.post("/", requireAuth, createBoard);
router.get("/:id", getBoardById);
router.delete("/:id", requireAuth, deleteBoard);

// Cards nested under a board.
router.get("/:boardId/cards", getCardsByBoard);
router.post("/:boardId/cards", attachUser, createCard); // guest-friendly

module.exports = router;
