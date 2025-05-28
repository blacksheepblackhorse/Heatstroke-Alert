const express = require("express");
const path = require("path"); // <-- ✅ Add this line
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // <-- ✅ Add this line

let latestStatus = "❌ Not Sensing";
let lastUpdateTime = 0;

app.post("/alert", (req, res) => {
  const status = req.body.status;
  console.log("Received status:", status);
  lastUpdateTime = Date.now();

  if (status === "heatstroke") {
  latestStatus = "⚠️ HEATSTROKE DETECTED!";
} else if (status === "normal") {
  latestStatus = "✅ Normal";
} else if (status === "gait-data") {
  const steps = req.body.steps || 0;
  const cadence = req.body.cadence || 0;
  latestStatus = `📊 Steps: ${steps}, Cadence: ${cadence.toFixed(2)} spm`;
} else {
  latestStatus = "❓ Unknown Status";
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));

