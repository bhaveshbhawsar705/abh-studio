import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5000;
const app = express();

app.use(express.json());

// API route for contact submissions
app.post("/api/contact", (req, res) => {
  const { name, email, phone, contactMethod, projectType, message } = req.body || {};
  console.log("Inquiry received:", { name, contactMethod, email, phone, projectType, timestamp: new Date().toISOString() });
  res.json({ success: true, message: "Inquiry received" });
});

// Serve static frontend bundle
const distDir = path.resolve(__dirname, "artifacts/abh-studio/dist/public");
app.use(express.static(distDir));

// SPA catch-all
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`ABH Studio server listening on port ${port}`);
});
