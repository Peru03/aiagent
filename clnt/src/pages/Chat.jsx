import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import API from "../config";

function ChatUI({ messages = [], setMessages, onSend }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message immediately

    // Send message to backend
    onSend(input);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const userId = user.id;
const handleCancelOrder = async (orderId) => {
  if (!orderId) return;


    // Cancel order (choose DELETE or PUT depending on backend)
 
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `❌ Order has been cancelled successfully.`,
      },
    ]);
  
};

  const handleConfirmOrder = async (msg) => {
    // Extract product, quantity, price from the bot message
    console.log("DFDSFD");
    console.log(msg);

    const regex = /(\d+)\s*(?:kg|packet|packets|litre|litres?)?\s*of\s+([A-Za-z]+)/i;
    const productMatch = msg.text.match(regex);
    console.log({"ProductMatch: " : productMatch});

    if (!productMatch) return;

    const quantity = parseInt(productMatch[1]);
    const product = productMatch[2];
    const priceMatch = msg.text.match(/₹([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

    try {
      const res = await API.post("/orders", {
        product,
        quantity,
        price,
        userId,
        status: "Confirmed",
      });
      console.log("Order created:", res.data.message);

      alert(`Order confirmed! ID: ${res.data.orderId}`);
       setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: `✅ Order placed successfully! Order ID: ${res.data.orderId}`,
      },
    ]);
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        maxWidth: 900,
        width: "100%",
        mx: "auto",
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Typography variant="h6" align="center">
          Customer Support Chat
        </Typography>
      </Box>

      {/* Messages List */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f5f5f5" }}>
        <List>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              alignItems="flex-start"
              sx={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.sender === "bot" && (
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  <Box
                    sx={{
                      bgcolor: msg.sender === "user" ? "primary.main" : "white",
                      color: msg.sender === "user" ? "white" : "black",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      maxWidth: "70%",
                    }}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {/* Render Confirm button if bot asks for order confirmation */}
                    {msg.sender === "bot" && msg.text.includes("confirm") && (
                      <Box mt={1} display="flex" gap={1}>
                        <button
                          onClick={() => handleConfirmOrder(msg)}
                          style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleCancelOrder(msg)}
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          No
                        </button>
                      </Box>
                    )}
                  </Box>
                }
              />
              {msg.sender === "user" && (
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>
                </ListItemAvatar>
              )}
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderTop: "1px solid #ddd",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message..."
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <IconButton color="primary" sx={{ ml: 1 }} onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default ChatUI;
