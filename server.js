const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyArL5kZlV5Mt0e78i24gZRnmSmgNkGZD6Q";

// Test route
app.get("/", (req, res) => {
  res.send("Aaru Bot Backend is Running 🚀");
});

// Chat route
app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    console.log("Received:", messages);

    // 🔥 Convert chat history into single prompt
    const prompt = messages
      .map(m => `${m.role === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${API_KEY}`,
      {
        prompt: {
          text: "You are Aaru Bot, friendly and helpful.\n" + prompt
        }
      }
    );

    const data = response.data;

    console.log("Gemini Response:", data);

    if (!data.candidates) {
      return res.json({ reply: "No response 😅" });
    }

    const reply = data.candidates[0].output;

    res.json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err.response?.data || err.message);
    res.json({ reply: "Server error 😢" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});