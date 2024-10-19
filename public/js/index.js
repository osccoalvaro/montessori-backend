import express from 'express';
import compression from 'compression';
import { z, ZodError } from 'zod';
import sheets, { SHEET_ID } from './sheetClient.js';
import { config } from 'dotenv';
import cors from 'cors';
config({ path: './.env' });

const app = express();

// Habilitar la compresión
app.use(compression());

// Habilitar CORS
app.use(cors({
  origin: 'https://montessori.pe',
  //origin: 'http://127.0.0.1:5500'
}));

// Middlewares
app.use(express.json());
app.use(express.static('public'));

const contactFormSchema = z.object({
  date: z.string(),
  nombre: z.string().trim().min(1, { message: 'Nombre is required' }),
  apellido: z.string().trim().min(1, { message: 'Apellido is required' }),
  dni: z.string().trim().min(1, { message: 'DNI is required' }),
  email: z.string().trim().min(1, { message: 'Correo is required' }),
  telefono: z.string().trim().min(1, { message: 'Teléfono is required' }),
  grado: z.string().trim().min(1, { message: 'Grado is required' }),
});

/*
nombre: z.string().required({ message: 'Nombre is required' }),
nombre: z.string().nonempty({ message: 'Nombre is required' }),
*/

app.post('/send-message', async (req, res) => {
  try {
    const body = contactFormSchema.parse(req.body);
    // Object to Sheets
    const rows = Object.values(body);
    console.log(rows);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Data!A:G',
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'RAW',
      requestBody: {
        values: [rows],
      },
    });
    res.json({ message: 'Data added successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error });
    }
  }
});

app.listen(process.env.PORT, () => {
  console.log('Server running in port http://localhost:3000')
});