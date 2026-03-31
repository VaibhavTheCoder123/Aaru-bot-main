let chatHistory = [];
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = "AIzaSyArL5kZlV5Mt0e78i24gZRnmSmgNkGZD6Q"; // 🔒 keep private

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
          }))
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.json({ reply: "API error 😢" });
    }
    console.log("API RESPONSE:", data);

    const reply = data.candidates[0].content.parts[0].text;

    res.json({ reply });

  } catch (err) {
  console.error("FULL ERROR:", err);
  res.json({ reply: "Server error 😢" });
}
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
app.get("/", (req, res) => {
  res.send("Aaru Bot Backend is Running 🚀");
});