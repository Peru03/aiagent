const db = require('../db'); // Your DB connection setup

// Helper: Parse user input
function parseOrderInput(input) {
  const regex = /(\d+)\s*(kg|g|pcs)?\s*(\w+)/i;
  const match = input.match(regex);
  if (match) {
    const quantity = parseInt(match[1]);
    const unit = match[2] || 'pcs';
    const productName = match[3];
    return { productName, quantity, unit };
  }
  return null;
}

exports.handleUserMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  // Parse input
  const parsed = parseOrderInput(message);
  if (!parsed) {
    return res.json({ reply: "Sorry, I couldn't understand. Please specify product and quantity." });
  }

  // Check product availability
  const [products] = await db.query('SELECT * FROM products WHERE name LIKE ?', [`%${parsed.productName}%`]);
  if (!products.length) {
    return res.json({ reply: "Product not found." });
  }

  const product = products[0];
  if (product.stock < parsed.quantity) {
    return res.json({ reply: "Insufficient stock for this product." });
  }

  const totalPrice = product.price * parsed.quantity;

  // Send confirmation prompt
  return res.json({
    reply: `Confirm order: ${parsed.quantity} ${parsed.unit} of ${product.name} for $${totalPrice}?`,
    productId: product.id,
    quantity: parsed.quantity,
    totalPrice
  });
};

exports.confirmOrder = async (req, res) => {
  const { productId, quantity, totalPrice } = req.body;
  const userId = req.user.id;

  // Insert order
  await db.query(
    'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
    [userId, productId, quantity, totalPrice, 'Pending']
  );

  // Update stock
  await db.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);

  res.json({ reply: 'Order confirmed and stock updated!' });
};