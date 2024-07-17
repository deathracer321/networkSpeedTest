import type { NextApiRequest, NextApiResponse } from 'next';
import speedTest from 'speedtest-net';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const test = speedTest({ acceptLicense: true });
    const results = await test;

    const downloadMbps = results.download.bandwidth * 8 / 1e6;
    const uploadMbps = results.upload.bandwidth * 8 / 1e6;

    res.status(200).json({ download: downloadMbps.toFixed(2), upload: uploadMbps.toFixed(2) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
