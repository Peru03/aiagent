const db = require("../config/db");

// Fetch orders
exports.getOrders = (req, res) => {
  let query = "";
  let params = [];
  const { id, role } = req.query;

  // console.log("HERERERER");
  // console.log(req.query);
  
  // console.log(role);
  
  if (role === "admin") {
  // Admin: fetch all orders with customer name
  query = `
      SELECT o.id, o.user_id, u.username AS customerName, o.product AS productName,o.quantity,o.total_price,  o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
  } else {
    // User: fetch only their own orders
    query = `
      SELECT o.id, o.user_id, u.username AS customerName, o.product AS productName,o.quantity,o.total_price,o.status, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `;
    params.push(id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json(results);
  });
};

// Create order (optional: only admin)




// controllers/orderController.js

exports.createOrder = (req, res) => {
  const { userId, status, product, quantity, price } = req.body;
  const total_price = quantity * price;

 
  // 1️⃣ Check if enough stock exists
  db.query(
    "SELECT stock FROM products WHERE name = ?",
    [product],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", err });
      if (!result[0]) return res.status(404).json({ message: "Product not found" });
      if (result[0].stock < quantity)
        return res.status(400).json({ message: "Insufficient stock" });

      // 2️⃣ Insert order
      db.query(
        "INSERT INTO orders (user_id, product, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)",
        [userId, product, quantity, total_price, status || "pending"],
        (err, insertResult) => {
          if (err) return res.status(500).json({ message: "Failed to create order", err });

          const orderId = insertResult.insertId;

          // 3️⃣ Subtract stock
          db.query(
            "UPDATE products SET stock = stock - ? WHERE name = ?",
            [quantity, product],
            (err, updateResult) => {
              if (err) return res.status(500).json({ message: "Failed to update stock", err });

              res.json({ message: "Order created and stock updated", orderId });
            }
          );
        }
      );
    }
  );
};



// Update order status (admin only)
exports.updateOrderStatus = (req, res) => {
  // console.log("THTH");
  
  // console.log(req.body);
  
  if (req.body.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can update orders" });
  }

  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Order not found" });
      res.json({ message: "Order updated successfully" });
    }
  );
};

// Delete order (admin only)
exports.deleteOrder = (req, res) => {
  console.log(req.query);
  
  if (req.query.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete orders" });
  }

  const { id } = req.params;

  db.query("DELETE FROM orders WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  });
};
