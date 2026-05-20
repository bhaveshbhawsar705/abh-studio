import { Router } from "express";
import nodemailer from "nodemailer";
import { db, contactSubmissionsTable } from "@workspace/db";
import { appendToSheet, ensureHeaders } from "../lib/sheets";

const router = Router();

const projectLabels: Record<string, string> = {
  "web-development": "Web Development",
  "social-media": "Social Media Management",
  "digital-marketing": "Digital Marketing",
  "full-package": "Full Digital Package",
};

router.post("/contact", async (req, res) => {
  const { name, email, phone, contactMethod, projectType, message } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    contactMethod?: string;
    projectType?: string;
    message?: string;
  };

  if (!name || !projectType || !message || !contactMethod) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  if (contactMethod === "email" && !email) {
    res.status(400).json({ error: "Email is required." });
    return;
  }

  if (contactMethod === "phone" && !phone) {
    res.status(400).json({ error: "Phone is required." });
    return;
  }

  const now = new Date();
  const projectLabel = projectLabels[projectType] ?? projectType;

  try {
    await db.insert(contactSubmissionsTable).values({
      name,
      email: email || null,
      phone: phone || null,
      contactMethod,
      projectType,
      message,
    });
    req.log.info({ name, projectType }, "Contact submission saved to database");
  } catch (dbErr) {
    req.log.error({ err: dbErr }, "Failed to save contact submission to database");
  }

  try {
    await ensureHeaders();
    await appendToSheet([
      name,
      contactMethod,
      email || "",
      phone || "",
      projectLabel,
      message,
      now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    ]);
    req.log.info({ name }, "Contact submission appended to Google Sheet");
  } catch (sheetErr) {
    req.log.error({ err: sheetErr }, "Failed to append to Google Sheet");
  }

  const zohoUser = process.env["ZOHO_USER"];
  const zohoPassword = process.env["ZOHO_PASSWORD"];
  const contactEmail = process.env["CONTACT_EMAIL"] || zohoUser;

  if (!zohoUser || !zohoPassword) {
    req.log.warn("Email credentials not configured");
    res.json({ success: true });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 587,
    secure: false,
    auth: { user: zohoUser, pass: zohoPassword },
  });

  const contactDisplay = contactMethod === "email" ? email : phone;

  try {
    await transporter.sendMail({
      from: `"ABH Studio Website" <${zohoUser}>`,
      to: contactEmail,
      replyTo: email || undefined,
      subject: `New Inquiry: ${projectLabel} — ${name}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a12; color: #e0e0f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #4f8cff; padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #fff; letter-spacing: -0.5px;">New Project Inquiry</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 14px;">Received from ABH Studio website</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 130px;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Contact</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px;">${contactDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Project Type</td>
                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 15px; font-weight: 600; color: #4f8cff;">${projectLabel}</td>
              </tr>
            </table>
            <div style="margin-top: 28px;">
              <p style="color: rgba(255,255,255,0.45); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px;">Message</p>
              <p style="font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.8); margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="padding: 20px 32px; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.06);">
            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.25);">Hit reply to respond directly to ${name}</p>
          </div>
        </div>
      `,
    });
    req.log.info({ name, projectType }, "Contact form email sent");
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
  }

  res.json({ success: true });
});

export default router;
