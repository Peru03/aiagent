const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByUsername } = require("../models/userModel");

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  getUserByUsername(username, async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role  },
    });
  });
};

module.exports = { login };
