import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_HEADERS = {
  'Contact Submissions': ['service', 'size', 'timeline', 'contact_method', 'contact', 'created_at'],
  'Analytics Events': ['event_type', 'path', 'referrer', 'user_agent', 'created_at'],
};

let jwtClient = null;

function getJwtClient() {
  if (jwtClient) return jwtClient;

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set.');
  }

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON.');
  }

  jwtClient = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return jwtClient;
}

// Returns a ready-to-use worksheet, creating it (with headers) if it doesn't
// exist yet. Re-fetches doc metadata each call rather than caching it, since
// this is a low-traffic path (contact form + pageviews) and it avoids ever
// operating on stale sheet/tab info.
async function getSheet(title) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID is not set.');
  }

  const doc = new GoogleSpreadsheet(sheetId, getJwtClient());
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    try {
      sheet = await doc.addSheet({ title, headerValues: SHEET_HEADERS[title] });
    } catch (err) {
      // A concurrent request may have created the tab between our loadInfo
      // check and the addSheet call. Re-fetch and use the existing sheet.
      const msg = err?.data?.error?.message ?? err?.message ?? '';
      if (msg.includes('already exists')) {
        await doc.loadInfo();
        sheet = doc.sheetsByTitle[title];
        if (!sheet) throw err;
      } else {
        throw err;
      }
    }
    return sheet;
  }

  // Existing tab (e.g. created manually) might not have a header row yet.
  try {
    await sheet.loadHeaderRow();
  } catch {
    await sheet.setHeaderRow(SHEET_HEADERS[title]);
  }

  return sheet;
}

export async function appendContactSubmission(row) {
  const sheet = await getSheet('Contact Submissions');
  await sheet.addRow(row);
}

export async function appendAnalyticsEvent(row) {
  const sheet = await getSheet('Analytics Events');
  await sheet.addRow(row);
}
