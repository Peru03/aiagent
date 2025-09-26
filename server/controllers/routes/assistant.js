// routes/assistant.js (CommonJS)
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const pkg = require("../config/db.js"); // CommonJS db

// const { db } = pkg;
const db = require("../config/db.js");
require("dotenv").config({ path: ".env" });

const router = express.Router();
//console.log('GEMINI_API_KEY', !!process.env.GEMINI_API_KEY);
const googleAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// Fetch products from DB
// async function fetchProducts() {
//   try {
//     const [rows] = await db.execute(
//       "SELECT id, name, stock, unit, price_per_unit FROM products"
//     );

//     return rows.map((row) => ({
//       id: row.id,
//       name: row.name,
//       stock: row.stock,
//       unit: row.unit,
//       pricePerUnit: row.price_per_unit,
//     }));
//   } catch (err) {
//     console.error("DB fetch error:", err);
//     return []; // fallback empty array
//   }
// }

async function fetchProducts() {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, stock, unit, price FROM products",
      (err, rows) => {
        if (err) {
          console.error("DB fetch error:", err);
          return resolve([]); // fallback
        }
        resolve(
          rows.map(row => ({
            id: row.id,
            name: row.name,
            stock: row.stock,
            unit: row.unit,
            pricePerUnit: row.price
          }))
        );
      }
    );
  });
}

// Build system prompt
async function buildSystemPrompt() {
  const products = await fetchProducts();

  return `
You are a conversational AI assistant for an e-commerce platform.

Your tasks:
1. Understand user requests which can vary from asking for list of items, getting specificaition for specific item,collect thier list of items for order, remove the item for the list, cancle this whole order.
2. Extract {product, Price}.
3. Always ask for product quantity when the user wants to order a specific item.
4. Calculate total price accumulation each item quantity multiply by price.
3. Always refer to the product list below for availability and pricing.
4. Respond step by step:
   - Confirm product + quantity
   - Show total price
   - Ask for final confirmation
   - On confirmation, reply in JSON format: {"action":"create_order","product":"Rice","quantity":2}
5. For "my orders", say: {"action":"get_orders"}
6. For "cancel order <id>", say: {"action":"cancel_order","id":123}
7. For "track order <id>", say: {"action":"track_order","id":123}
10. If input is unrelated: "I can only help with shopping and orders."

Current Product List (name, unit, price, stock):
${products
  .map(
    (p) =>
      `${p.name} (${p.unit}) - ₹${p.pricePerUnit}/${p.unit}, Stock: ${p.stock}`
  )
  .join("\n")}
`;
}

// POST /api/assistant/chat

router.post("/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    const prompt = await buildSystemPrompt();
    const finalPrompt = `${prompt}\n\nUser: ${userMessage}`;
    const result = await geminiModel.generateContent(finalPrompt);

    // Correctly extract the text from Gemini response
    const reply = result.response.text() || "Sorry, I couldn't generate a reply.";

    // Send reply back to frontend
    res.json({ reply });
  } catch (err) {
    console.error("Error in assistant chat:", err);
    res.status(500).json({ error: err.message || "Assistant failed" });
  }
});
// router.post("/chat", async (req, res) => {
//   try {
//     const { userMessage } = req.body;

//     const prompt = await buildSystemPrompt();
//     const finalPrompt = `${prompt}\n\nUser: ${userMessage}`;

//     const result = await model.generateContent(finalPrompt);
//     // const reply = result.response.text();
//     const reply = result.output[0].content[0].text.res.json({ reply });
//   } catch (err) {
//     console.error("Error in assistant chat:", err);
//     res.status(500).json({ error: "Assistant failed" });
//   }
// });

// Export router as CommonJS
module.exports = router;
