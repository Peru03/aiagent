import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/assistant/chat
router.post("/chat", async (req, res) => {
  try {
    const { userMessage, userId } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, fast, good for prod
      messages: [
        {
          role: "system",
          content: `You are an e-commerce conversational assistant.
- Understand user inputs like "I want 2kg rice".
- Extract {product, quantity} from natural language.
- Check stock/availability by calling backend API (you CANNOT guess stock).
- Respond conversationally, confirm before placing orders.
- If confirmed, call backend API to create order.
- Keep responses short, professional, and user-friendly.
- If asked for "my orders", call backend API to fetch order history.
- If user is admin, support viewing/updating all orders and managing stock.`,
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Error in assistant chat:", err);
    res.status(500).json({ error: "Assistant failed" });
  }
});

export default router;
