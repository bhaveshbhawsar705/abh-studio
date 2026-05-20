import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuth() {
  const credentialsJson = process.env["GOOGLE_SERVICE_ACCOUNT_JSON"];
  if (!credentialsJson) return null;

  try {
    const credentials = JSON.parse(credentialsJson);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });
  } catch {
    return null;
  }
}

function parseSheetId(raw: string): string {
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : raw.trim();
}

export async function appendToSheet(row: (string | number | null)[]) {
  const raw = process.env["GOOGLE_SHEET_ID"];
  if (!raw) return;
  const spreadsheetId = parseSheetId(raw);

  const auth = getAuth();
  if (!auth) return;

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

export async function ensureHeaders() {
  const raw = process.env["GOOGLE_SHEET_ID"];
  if (!raw) return;
  const spreadsheetId = parseSheetId(raw);

  const auth = getAuth();
  if (!auth) return;

  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A1:H1",
  });

  const firstRow = res.data.values?.[0];
  if (!firstRow || firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Name", "Contact Method", "Email", "Phone", "Project Type", "Message", "Submitted At"]],
      },
    });
  }
}
