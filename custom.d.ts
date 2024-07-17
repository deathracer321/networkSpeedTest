declare module 'speedtest-net' {
    export interface SpeedTestOptions {
      acceptLicense: boolean;
    }
  
    export interface BandwidthResult {
      bandwidth: number;
    }
  
    export interface SpeedTestResult {
      download: BandwidthResult;
      upload: BandwidthResult;
    }
  
    export default function speedTest(options: SpeedTestOptions): Promise<SpeedTestResult>;
  }
  