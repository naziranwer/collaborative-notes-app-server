const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header (Bearer token)
  if (
    req.header("Authorization") &&
    req.header("Authorization").startsWith("Bearer")
  ) {
    token = req.header("Authorization").split(" ")[1]; // Extract token from "Bearer <token>"
  }
  // Check for token in cookies (if any)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info in the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = authMiddleware;
