import type { MinerError, MinerInfo, MinerResponse, MinerService } from "./minerService";

interface SystemInfo {
  ASICModel: string;
  asicCount: number;
  autofanspeed: 0 | 1;
  bestDiff: string;
  boardtemp1: number;
  boardtemp2: number;
  boardVersion: string;
  coreVoltage: number;
  coreVoltageActual: number;
  current: number;
  fanSpeed: number;
  fanspeed: number;
  flipscreen: 0 | 1;
  freeHeap: number;
  frequency: number;
  hashRate: number;
  hostname: string;
  invertscreen: 0 | 1;
  invertfanpolarity: 0 | 1;
  power: number;
  runningPartition: string;
  sharesAccepted: number;
  sharesRejected: number;
  ssid: string;
  smallCoreCount: number;
  stratumPort: number;
  stratumURL: string;
  stratumUser: string;
  temp: number;
  uptimeSeconds: number;
  version: string;
  voltage: number;
  wifiStatus: string;
}

enum ErrorCode {
  NETWORK_OR_CONNECTION_ERROR,
  REQUEST_TIMEOUT,
  UNEXPECTED_RESPONSE,
  UNEXPECTED_ERROR,
}

const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.NETWORK_OR_CONNECTION_ERROR]: "Network or connection error occurred.",
  [ErrorCode.REQUEST_TIMEOUT]: "The request timed out.",
  [ErrorCode.UNEXPECTED_RESPONSE]: "Received an unexpected response from the server.",
  [ErrorCode.UNEXPECTED_ERROR]: "An unexpected error occurred.",
};

class EspError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
  ) {
    super(message ?? "");
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof EspError) {
    return errorMessages[error.code] ?? "Unknown error occurred.";
  }

  return "Unknown error occurred.";
}

async function getSystemInfo(ip: string): Promise<SystemInfo> {
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

  try {
    const response = await fetch(`http://${ip}/api/system/info`, { signal: controller.signal });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Unexpected response: ${response.status} ${response.statusText}`);
      throw new EspError(ErrorCode.UNEXPECTED_RESPONSE, `Status: ${response.status}`);
    }

    return await response.json();
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new EspError(ErrorCode.REQUEST_TIMEOUT, error.message);
    } else if (error instanceof TypeError) {
      throw new EspError(ErrorCode.NETWORK_OR_CONNECTION_ERROR, error.message);
    } else {
      throw new EspError(ErrorCode.UNEXPECTED_ERROR, `${JSON.stringify(error)}`);
    }
  }
}

async function getInfo(ip: string): Promise<MinerResponse<MinerInfo, MinerError>> {
  try {
    const systemInfo = await getSystemInfo(ip);

    const expectedHashRate = Math.floor(
      systemInfo.frequency * ((systemInfo.smallCoreCount * systemInfo.asicCount) / 1000),
    );

    return {
      success: true,
      data: {
        name: systemInfo.hostname,
        hashRate: systemInfo.hashRate,
        expectedHashRate: expectedHashRate,
        power: systemInfo.power,
        temperature: systemInfo.temp,
        stratumUser: systemInfo.stratumUser,
        shares: {
          accepted: systemInfo.sharesAccepted,
          rejected: systemInfo.sharesRejected,
        },
      },
    };
  } catch (error: unknown) {
    console.error(`Miner ${ip} | getInfo | ${JSON.stringify(error)}`);
    const message = getErrorMessage(error);

    return {
      success: false,
      error: {
        message: message,
      },
    };
  }
}

/**
 * 
 export function useSystemRestart(device: Device): UseSystemRestartReturn {
   const [response, setData] = useState<boolean | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
 
   const restart = () => {
     setIsLoading(true);
     const fetchSystemInfo = async () => {
       try {
         setIsLoading(true);
         console.log(`restarting ${device.ip}`);
         const response = await fetch(`http://${device.ip}/api/system/restart`, { method: "POST" });
 
         if (!response.ok) {
           throw new Error(`Error fetching data: ${response.statusText}`);
         }
 
         setData(response.ok);
       } catch (err: any) {
         setError(err.message);
         console.log(err);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchSystemInfo();
   };
 
   return { response, isLoading, error, restart };
 }
 
 */

function createService(ip: string): MinerService {
  return {
    getInfo: () => getInfo(ip),
  };
}

export default { createService };
