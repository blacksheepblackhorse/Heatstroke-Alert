const express = require('express');
const app = express();
const path = require('path');

app.use(express.json()); // to parse JSON body
app.use(express.static(path.join(__dirname, 'public')));

let latestData = {
  name: "N/A",
  cadence: 0,
  sway: 0,
  step_variability: 0
};

app.post('/data', (req, res) => {
  const { name, cadence, sway, step_variability } = req.body;
  latestData = { name, cadence, sway, step_variability };
  console.log(`✅ Data received from ${name}:`, latestData);
  res.status(200).send('Data received');
});

app.get('/data', (req, res) => {
  res.json(latestData); // frontend will fetch from here
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
