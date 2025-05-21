const express = require('express');
const app = express();
const cors = require('cors');

let latestStatus = "✅ Normal";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/alert', (req, res) => {
  console.log("Received alert:", req.body);
  if (req.body.status === "heatstroke") {
    latestStatus = "⚠️ HEATSTROKE DETECTED!";
  }
  res.sendStatus(200);
});

app.get('/status', (req, res) => {
  res.json({ status: latestStatus });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
