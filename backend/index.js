require("dotenv/config");
const express = require("express");
const cors = require("cors");

const boardRoutes = require("./routes/boardRoutes");
const cardRoutes = require("./routes/cardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check / root info.
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Kudos Board API" });
});

app.use("/boards", boardRoutes);
app.use("/cards", cardRoutes);

app.listen(PORT, () => {
  console.log(`Kudos Board API listening on http://localhost:${PORT}`);
});

module.exports = app;
