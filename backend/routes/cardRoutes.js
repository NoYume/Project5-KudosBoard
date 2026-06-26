const express = require("express");
const { upvoteCard, deleteCard } = require("../controllers/cardController");

// Mounted at /cards
const router = express.Router();

router.patch("/:id/upvote", upvoteCard);
router.delete("/:id", deleteCard);

module.exports = router;
