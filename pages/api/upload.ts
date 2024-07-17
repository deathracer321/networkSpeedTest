import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });

    console.log("Received upload data of size:", data.length);

    return res.status(200).json({ message: 'Upload successful', size: data.length });
  } catch (error: any) {
    console.error("Upload failed:", error.message);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
