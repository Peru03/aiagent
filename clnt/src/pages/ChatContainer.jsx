import React, { useState } from 'react';
// import ChatUI from './ChatUI';
import ChatUI from './Chat';
import API from "../Config";

function ChatContainer() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);

  const handleSend = async (userMessage) => {
    // Immediately add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userMessage },
    ]);

    try {
      const res = await API.post(
        'assistant/chat',
        { userMessage }
      );
      const botReply = res.data.reply;

      // Add bot message
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botReply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: 'Something went wrong.' },
      ]);
    }
  };

  return (
    <ChatUI
      messages={messages}       // pass messages
      setMessages={setMessages} // pass setter
      onSend={handleSend}       // pass send handler
    />
  );
}

export default ChatContainer;
