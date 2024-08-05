import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const directoryPath = path.join(process.cwd(), 'memory'); // Assuming 'memory' is your folder name

  try {
    const files = fs.readdirSync(directoryPath);
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read files' });
  }
}
