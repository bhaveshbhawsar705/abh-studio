import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5000;
const app = express();

app.use(express.json());

// API route for contact submissions (supports both form payloads + optional Google Sheets)
app.post("/api/contact", async (req, res) => {
  const body = req.body || {};
  const name = body.name || body.contact || "Anonymous";
  const contactMethod = body.contactMethod || "WHATSAPP";
  const email = body.email || (contactMethod === "EMAIL" ? body.contact : "");
  const phone = body.phone || (contactMethod === "PHONE" || contactMethod === "WHATSAPP" ? body.contact : "");
  const projectType = body.projectType || body.service || "General Inquiry";
  const message = body.message || (body.timeline ? `Timeline: ${body.timeline}, Size: ${body.size}` : "");

  console.log("Inquiry received:", {
    name,
    contactMethod,
    email,
    phone,
    projectType,
    message,
    timestamp: new Date().toISOString(),
  });

  // Optional Google Sheets logging
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_SHEET_ID) {
    try {
      const { appendContactSubmission } = await import("./server/googleSheets.js");
      await appendContactSubmission({
        service: projectType,
        size: body.size || "Standard",
        timeline: body.timeline || "Immediate",
        contact_method: contactMethod,
        contact: phone || email || name,
        created_at: new Date().toISOString(),
      });
    } catch (sheetErr) {
      console.error("Google Sheets append error:", sheetErr.message);
    }
  }

  res.json({ success: true, message: "Inquiry received" });
});

// Analytics event endpoint
app.post("/api/analytics/event", async (req, res) => {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY && process.env.GOOGLE_SHEET_ID) {
    try {
      const { appendAnalyticsEvent } = await import("./server/googleSheets.js");
      const { eventType, path: eventPath } = req.body || {};
      if (eventType) {
        await appendAnalyticsEvent({
          event_type: String(eventType).trim(),
          path: String(eventPath || "").slice(0, 512),
          referrer: req.get("referer") || "",
          user_agent: req.get("user-agent") || "",
          created_at: new Date().toISOString(),
        });
      }
    } catch (sheetErr) {
      console.error("Google Sheets analytics error:", sheetErr.message);
    }
  }
  res.status(204).end();
});

// Determine static dist directory (support both root dist and artifacts path)
const possibleDistDirs = [
  path.resolve(__dirname, "dist"),
  path.resolve(__dirname, "artifacts/abh-studio/dist/public"),
  path.resolve(__dirname, "../dist"),
  path.resolve(__dirname, "../artifacts/abh-studio/dist/public"),
];

const distDir = possibleDistDirs.find((dir) => fs.existsSync(path.join(dir, "index.html"))) || possibleDistDirs[0];

app.use(express.static(distDir));

// SPA catch-all (Express 4 & 5 compatible unpathed fallback)
app.use((_req, res) => {
  const indexPath = path.join(distDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Site is building or index.html not found.");
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`ABH Studio server listening on port ${port} (serving ${distDir})`);
});
