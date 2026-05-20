import { Router } from "express";
import { db, contactSubmissionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/submissions/export", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.submittedAt));

    const headers = ["ID", "Name", "Contact Method", "Email", "Phone", "Project Type", "Message", "Submitted At"];

    const escape = (val: string | null | undefined) => {
      if (val == null) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const projectLabels: Record<string, string> = {
      "web-development": "Web Development",
      "social-media": "Social Media Management",
      "digital-marketing": "Digital Marketing",
      "full-package": "Full Digital Package",
    };

    const csvRows = [
      headers.join(","),
      ...rows.map((r) => [
        r.id,
        escape(r.name),
        escape(r.contactMethod),
        escape(r.email),
        escape(r.phone),
        escape(projectLabels[r.projectType] ?? r.projectType),
        escape(r.message),
        escape(r.submittedAt.toISOString()),
      ].join(",")),
    ];

    const csv = csvRows.join("\n");
    const filename = `abh-submissions-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, "Failed to export submissions");
    res.status(500).json({ error: "Failed to export submissions." });
  }
});

router.get("/submissions", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.submittedAt));
    res.json({ submissions: rows });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch submissions");
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

export default router;
