const express = require("express");
const {
  upvoteCard,
  deleteCard,
  togglePin,
  addComment,
} = require("../controllers/cardController");

// Mounted at /cards
const router = express.Router();

router.patch("/:id/upvote", upvoteCard);
router.patch("/:id/pin", togglePin);
router.post("/:id/comments", addComment);
router.delete("/:id", deleteCard);

module.exports = router;
