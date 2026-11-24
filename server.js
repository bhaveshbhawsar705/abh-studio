import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT) || 5000;
const app = express();

app.use(express.json());

// API route for contact submissions
app.post("/api/contact", (req, res) => {
  const { name, email, phone, contactMethod, projectType, message } = req.body || {};
  console.log("Inquiry received:", {
    name,
    contactMethod,
    email,
    phone,
    projectType,
    timestamp: new Date().toISOString(),
  });
  res.json({ success: true, message: "Inquiry received" });
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

// SPA catch-all (Express 4 & 5 compatible)
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
