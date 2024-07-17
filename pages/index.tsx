import { useState } from 'react';

export default function Home() {
  const [speedData, setSpeedData] = useState({ download: null, upload: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSpeedTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/speedtest');
      const data = await response.json();
      if (response.ok) {
        setSpeedData(data);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Network Speed Test</h1>
      <button onClick={handleSpeedTest} disabled={loading}>
        {loading ? 'Testing...' : 'Run Speed Test'}
      </button>
      {error && <p>Error: {error}</p>}
      {speedData.download && (
        <div>
          <p>Download Speed: {speedData.download} Mbps</p>
          <p>Upload Speed: {speedData.upload} Mbps</p>
        </div>
      )}
    </div>
  );
}
