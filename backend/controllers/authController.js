const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const { JWT_SECRET } = require("../middleware/auth");

const TOKEN_TTL = "7d";
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
// Pragmatic email check — must look like name@domain.tld.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sign a token carrying the user's id and username (so middleware can set both
// without a DB round-trip on every request).
function signToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

// Strip the password hash before returning a user to the client.
function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
  };
}

// POST /auth/signup — create an account and return a token.
async function signup(req, res) {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      });
    }

    const normalizedEmail = email.toLowerCase();
    // Reject if either the username or email is already in use.
    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: normalizedEmail }] },
    });
    if (existing) {
      const field = existing.username === username ? "Username" : "Email";
      return res.status(409).json({ error: `${field} already taken` });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { username, email: normalizedEmail, password: hashed },
    });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Failed to sign up" });
  }
}

// POST /auth/login — verify credentials and return a token. The `identifier`
// may be either a username or an email address.
async function login(req, res) {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Username/email and password are required" });
    }

    // Look the user up by username OR email (email match is case-insensitive).
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier.toLowerCase() }],
      },
    });
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
