import { google } from 'googleapis';
import { config } from 'dotenv';
config({ path: './.env' });

const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n");

export const SHEET_ID = process.env.SHEET_ID;

const client = new google.auth.JWT(client_email, null, private_key, [
  'https://www.googleapis.com/auth/spreadsheets',
]);

const sheets = google.sheets({ version: 'v4', auth: client });
export default sheets;