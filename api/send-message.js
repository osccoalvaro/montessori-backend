import { z, ZodError } from 'zod';
import sheets, { SHEET_ID } from '../sheetClient.js'; // Ajusta la ruta si es necesario

const contactFormSchema = z.object({
  date: z.string(),
  nombre: z.string().trim().min(1, { message: 'Nombre is required' }),
  apellido: z.string().trim().min(1, { message: 'Apellido is required' }),
  dni: z.string().trim().min(1, { message: 'DNI is required' }),
  email: z.string().trim().min(1, { message: 'Correo is required' }),
  telefono: z.string().trim().min(1, { message: 'Teléfono is required' }),
  grado: z.string().trim().min(1, { message: 'Grado is required' }),
});

export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const body = contactFormSchema.parse(req.body);
      const rows = Object.values(body);
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Data!A:G',
        insertDataOption: 'INSERT_ROWS',
        valueInputOption: 'RAW',
        requestBody: {
          values: [rows],
        },
      });
      res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error });
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
