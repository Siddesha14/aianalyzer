const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.get("/test", async (req, res) => {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello Gemini" }] }]
      })
    });

    const data = await response.text(); // <-- NOT JSON
    res.send(data);

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
