const db = require("../config/db");

const getUserByUsername = (username, callback) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], callback);
};

module.exports = { getUserByUsername };
