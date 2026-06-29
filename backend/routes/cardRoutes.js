const express = require("express");
const {
  upvoteCard,
  deleteCard,
  togglePin,
  addComment,
} = require("../controllers/cardController");
const { requireAuth } = require("../middleware/auth");

// Mounted at /cards
const router = express.Router();

router.patch("/:id/upvote", upvoteCard);
router.patch("/:id/pin", togglePin);
router.post("/:id/comments", addComment);
router.delete("/:id", requireAuth, deleteCard); // owner-only (see controller)

module.exports = router;
