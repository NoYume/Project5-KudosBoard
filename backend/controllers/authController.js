const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_TTL = "7d";
const SALT_ROUNDS = 10;

// Sign a token carrying the user's id and username (so middleware can set both
// without a DB round-trip on every request).
function signToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

// Strip the password hash before returning a user to the client.
function publicUser(user) {
  return { id: user.id, username: user.username, createdAt: user.createdAt };
}

// POST /auth/signup — create an account and return a token.
async function signup(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { username, password: hashed },
    });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Failed to sign up" });
  }
}

// POST /auth/login — verify credentials and return a token.
async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(200).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Failed to log in" });
  }
}

// GET /auth/me — return the currently authenticated user.
async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

module.exports = { signup, login, me };
