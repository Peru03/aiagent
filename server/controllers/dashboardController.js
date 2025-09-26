// controllers/statsController.js
const db = require("../config/db");

exports.getStats = function (req, res) {
  try {
    // console.log(req.query);
    
    const id = req.query.id;
    const role = req.query.role;

    let ordersQuery = "";
    let usersQuery = "";
    let ordersParams = [];
    let usersParams = [];

    if (role === "admin") {
      ordersQuery = "SELECT COUNT(*) AS count FROM orders";
      usersQuery = "SELECT COUNT(*) AS count FROM users";
    } else {
      ordersQuery = "SELECT COUNT(*) AS count FROM orders WHERE user_id = ?";
      ordersParams = [id];
      usersQuery = "SELECT 1 AS count"; // Regular user
    }

    // Execute orders query
    db.query(ordersQuery, ordersParams, function (err, ordersResult) {
      if (err) {
        console.error("Orders query error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // Execute users query
      db.query(usersQuery, usersParams, function (err, usersResult) {
        if (err) {
          console.error("Users query error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        res.json({
          ordersCount: ordersResult[0].count,
          usersCount: usersResult[0].count,
        });
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
