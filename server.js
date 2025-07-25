const express = require('express');
const app = express();
const path = require('path');

let latestData = {
  cadence: 0,
  sway: 0,
  step_variability: 0,
  abnormal_count: 0,
  status: "Not Sensing",
  timestamp: ""
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/data', (req, res) => {
  const data = req.body;
  const now = new Date().toLocaleString();

  let abnormal = 0;

  if (data.cadence < 119.8 || data.cadence > 179.69) abnormal++;
  if (data.sway > 408.51) abnormal++;
  if (data.step_variability > 135.73) abnormal++;

  latestData = {
    ...data,
    abnormal_count: abnormal,
    status: abnormal >= 2 ? "⚠️ WARNING" : "✅ Normal Gait",
    timestamp: now
  };

  console.log("📥 Received data:", latestData);
  res.json({ message: "✅ Data received" });
});

app.get('/api/data', (req, res) => {
  res.json(latestData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
