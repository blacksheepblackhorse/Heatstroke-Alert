const express = require("express");
const app = express();
const path = require("path");

let latestData = {
  status: "❌ Not Sensing",
  cadence: 0,
  sway: 0,
  step_variability: 0,
  total_steps: 0
};

app.use(express.json());
app.use(express.static("public"));

// ESP32 posts data here
app.post("/data", (req, res) => {
  latestData = req.body;
  res.sendStatus(200);
});

// Frontend polls this for live updates
app.get("/status", (req, res) => {
  res.json(latestData);
});

// Optional fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
