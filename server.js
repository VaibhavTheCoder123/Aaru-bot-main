const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "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";

// Test route
app.get("/", (req, res) => {
  res.send("Aaru Bot Backend is Running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    console.log("Received:", messages);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // free & stable
        messages: messages.map(m => ({
          role: m.role === "model" ? "assistant" : m.role,
          content: m.text
        }))
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message);
    res.json({ reply: "Server error 😢" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});