const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves index.html

// Minimal state the frontend needs
let latest = {
  mode: "Marching",
  status: "❌ Not Sensing",
  reasons: [],
  cadence: 0,
  step_cv: 0,
  stance_cv: 0,
  recruit: "-",
  worn: false,            // ✅ explicit worn flag
  updated_at: 0
};

// ESP32 posts data here (accepts old or new payloads)
app.post("/data", (req, res) => {
  const now = Date.now();

  // Backward-compat mapping
  const cadence = Number(req.body.cadence ?? 0);
  const step_cv =
    req.body.step_cv !== undefined
      ? Number(req.body.step_cv)
      : Number(req.body.step_variability ?? 0);
  const stance_cv =
    req.body.stance_cv !== undefined
      ? Number(req.body.stance_cv)
      : Number(req.body.stance_variability ?? 0);

  // reasons
  let reasons = [];
  if (Array.isArray(req.body.reasons)) {
    reasons = req.body.reasons.slice(0, 2);
  } else if (typeof req.body.reasons === "string") {
    reasons = req.body.reasons.split(";").filter(Boolean).slice(0, 2);
  } else if (typeof req.body.status === "string") {
    if (req.body.status.includes("High Risk")) reasons = ["critical_posture"];
    else if (req.body.status.includes("Warning")) reasons = ["gait_abnormal"];
    else if (req.body.status.includes("Watch")) reasons = ["gait_drifting"];
  }

  // worn: prefer explicit boolean from device; otherwise infer cautiously
  let worn = latest.worn;
  if (typeof req.body.worn === "boolean") {
    worn = req.body.worn;
  } else if (typeof req.body.worn === "string") {
    worn = req.body.worn.toLowerCase() === "true";
  } else if (typeof req.body.status === "string") {
    if (req.body.status.includes("Not Worn")) worn = false;
    else if (
      req.body.status.includes("Standing") ||
      req.body.status.includes("Normal") ||
      req.body.status.includes("Watch") ||
      req.body.status.includes("Warning") ||
      req.body.status.includes("High Risk")
    ) worn = true;
  }

  // status: take device status, but normalize if worn=false
  let status = req.body.status || "✅ Normal";
  if (worn === false) status = "👟 Not Worn";

  latest = {
    mode: req.body.mode || latest.mode || "Marching",
    status,
    reasons,
    cadence,
    step_cv,
    stance_cv,
    recruit: req.body.recruit || latest.recruit || "-",
    worn,                         // ✅ include worn
    updated_at: now
  };

  console.log("📩 Received from ESP32:", latest);
  res.sendStatus(200);
});

// Frontend polls this; if stale, force Not Sensing
app.get("/status", (req, res) => {
  const now = Date.now();
  const stale = !latest.updated_at || (now - latest.updated_at > 12000); // >12s
  if (stale) {
    return res.json({
      mode: latest.mode || "Marching",
      status: "❌ Not Sensing",
      reasons: [],
      cadence: 0,
      step_cv: 0,
      stance_cv: 0,
      recruit: latest.recruit || "-",
      worn: false,                 // ✅ report not worn when stale
      updated_at: latest.updated_at || 0
    });
  }
  res.json(latest);
});

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on :${PORT}`));
