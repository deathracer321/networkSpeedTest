import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './Home.module.css';

// Dynamically import react-d3-speedometer to avoid SSR issues
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), { ssr: false });

interface SpeedData {
  download: number | undefined;
  upload: number | undefined;
}

export default function Home() {
  const [speedData, setSpeedData] = useState<SpeedData>({ download: undefined, upload: undefined });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [varyingValue, setVaryingValue] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      interval = setInterval(() => {
        setVaryingValue(Math.floor(Math.random() * 100) + 1);
      }, 100);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

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
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={isDarkMode ? styles.containerDark : styles.container}>
      <Head>
        <title>My Custom Title</title>
      </Head>
      <button className={styles.themeToggleButton} style={{backgroundColor:isDarkMode?"white":"black",color:isDarkMode?"black":"white"}} onClick={toggleTheme}>
        {isDarkMode ? 'Light' : 'Dark'}
      </button>
      <h1 className={styles.title}>Network Speed Test</h1>
      <button className={styles.button} onClick={handleSpeedTest} disabled={loading}>
        {loading ? 'Testing...' : 'Run Speed Test'}
      </button>
      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.result}>
        <div className={styles.speedometerContainer}>
          <p style={{ textAlign: 'center' }}>Download Speed: {loading ? varyingValue : speedData.download} Mbps</p>
          <ReactSpeedometer
            maxValue={100}
            value={loading ? varyingValue : speedData.download}
            needleColor="red"
            startColor="green"
            segments={10}
            endColor="blue"
            height={210}
          />
        </div>
        <div className={styles.speedometerContainer}>
          <p style={{ textAlign: 'center' }}>Upload Speed: {loading ? varyingValue : speedData.upload} Mbps</p>
          <ReactSpeedometer
            maxValue={100}
            value={loading ? varyingValue : speedData.upload}
            needleColor="red"
            startColor="green"
            segments={10}
            endColor="blue"
            height={210}
          />
        </div>
      </div>
    </div>
  );
}
