// JWT auth middleware. Tokens are sent as `Authorization: Bearer <token>`.
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// Pull the bearer token out of the Authorization header, or null if absent.
function getToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice(7);
}

// Require a valid token. Sets req.userId / req.username; 401 otherwise.
function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    req.username = payload.username;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Guest-friendly: decode the token if present, but never block the request.
function attachUser(req, res, next) {
  const token = getToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.userId = payload.userId;
      req.username = payload.username;
    } catch {
      // ignore a bad token for optional auth
    }
  }
  next();
}

module.exports = { requireAuth, attachUser, JWT_SECRET };
