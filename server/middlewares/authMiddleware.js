// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY"); // Replace with your secret
    req.user = decoded; // e.g., { id: '123', role: 'admin' }
    console.log("Token verified, user:", decoded);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Export as an object so you can destructure in routes
module.exports = { authMiddleware };
