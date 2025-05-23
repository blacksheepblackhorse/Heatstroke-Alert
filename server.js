const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

let latestStatus = "❌ Not Sensing";
let lastUpdateTime = 0;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/alert", (req, res) => {
  const status = req.body.status;
  lastUpdateTime = Date.now();
  if (status === "heatstroke") {
    latestStatus = "⚠️ HEATSTROKE DETECTED!";
  } else if (status === "normal") {
    latestStatus = "✅ Normal";
  }
  res.sendStatus(200);
});

app.get("/status", (req, res) => {
  const now = Date.now();
  if (now - lastUpdateTime > 15000) {
    latestStatus = "❌ Not Sensing";
  }
  res.json({ status: latestStatus });
});

app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

