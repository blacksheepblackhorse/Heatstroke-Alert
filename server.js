app.post("/alert", (req, res) => {
  const status = req.body.status;
  console.log("Received status:", status);  // ✅ LOG what's coming from ESP32
  lastUpdateTime = Date.now();              // ✅ Track the update time

  if (status === "heatstroke") {
    latestStatus = "⚠️ HEATSTROKE DETECTED!";
  } else if (status === "normal") {
    latestStatus = "✅ Normal";
  } else {
    latestStatus = "❓ Unknown Status";      // ✅ catches errors
  }

  res.sendStatus(200);
});

