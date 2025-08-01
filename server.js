const express = require("express");
const app = express();
const path = require("path");

let latestData = {
  status: "❌ Not Sensing",
  recruit: "-",  // ✅ Added so frontend won't break
  cadence: 0,
  sway: 0,
  step_variability: 0,
  total_steps: 0
};

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static("public")); // Serves index.html from /public folder

// Endpoint for ESP32 to POST data
app.post("/data", (req, res) => {
  latestData = req.body;
  console.log("📩 Received from ESP32:", latestData);
  res.sendStatus(200);
});

// Endpoint for frontend to GET current status
app.get("/status", (req, res) => {
  res.json(latestData);
});

// Fallback to index.html for all other routes (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
