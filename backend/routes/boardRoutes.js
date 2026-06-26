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

// Mounted at /boards
const router = express.Router();

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);
router.delete("/:id", deleteBoard);

// Cards nested under a board.
router.get("/:boardId/cards", getCardsByBoard);
router.post("/:boardId/cards", createCard);

module.exports = router;
