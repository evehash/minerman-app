/* eslint-disable no-undef */
import type {
  ActionResponse,
  DeviceAction,
  DeviceAttributeGroup,
  DeviceDetails,
  DeviceInfo,
  DeviceService,
} from "./deviceService";

export interface SystemInfo {
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

async function fetchSystemInfo(host: string): Promise<SystemInfo> {
  try {
    //setData({ ...data, isLoading: true });
    //console.log(`fetching data form ${device.ip}`);
    const response = await fetch(`http://${host}/api/system/info`);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return await response.json();
  } catch (err: any) {
    console.warn(`Error fetching systemInfo ${host}`, err);
    throw new Error("Not possible retrieve data");
  }
}

async function getInfo(host: string): Promise<DeviceInfo> {
  const systemInfo = await fetchSystemInfo(host);
  console.log(systemInfo);
  return {
    name: systemInfo.hostname,
    hashRate: systemInfo.hashRate,
    expectedHashRate: Math.floor(systemInfo.frequency * ((systemInfo.smallCoreCount * systemInfo.asicCount) / 1000)),
    stratumUser: systemInfo.stratumUser,
    power: systemInfo.power,

    temperature: systemInfo.temp,
    shares: {
      accepted: systemInfo.sharesAccepted,
      rejected: systemInfo.sharesRejected,
    },
  };
}

async function getActions(ip: string): Promise<DeviceAction[]> {
  return [
    {
      icon: "restart",
      label: "Restart",
      performAction: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ success: true, message: `Device restarted ${ip}` });
          }, 5000); // Espera 5 segundos
        });
      },
    },
  ];
}

async function getDetails(ip: string): Promise<DeviceDetails> {
  const systemInfo = await fetchSystemInfo(ip);

  // return {
  //   name: systemInfo.hostname,
  //   stratumUser: systemInfo.stratumUser,
  //   power: systemInfo.power,
  //   hashRate: systemInfo.hashRate,
  //   temperature: systemInfo.temp,
  //   shares: {
  //     accepted: systemInfo.sharesAccepted,
  //     rejected: systemInfo.sharesRejected,
  //   },
  // };

  const systemOverview: DeviceAttributeGroup = {
    name: "System overview",
    attributes: [
      {
        name: "ASIC model",
        type: "literal",
        value: systemInfo.ASICModel,
      },
      {
        name: "Hostname",
        type: "literal",
        value: systemInfo.hostname,
      },
      {
        name: "Version",
        type: "literal",
        value: systemInfo.version,
      },
      {
        name: "Board version",
        type: "literal",
        value: systemInfo.boardVersion,
      },
      {
        name: "Uptime",
        type: "seconds",
        value: systemInfo.uptimeSeconds,
      },
      {
        name: "Running partition",
        type: "literal",
        value: systemInfo.runningPartition,
      },
      {
        name: "SSID",
        type: "literal",
        value: systemInfo.ssid,
      },
      {
        name: "IP address",
        type: "literal",
        value: ip,
      },
      {
        name: "WiFi status",
        type: "literal",
        value: systemInfo.wifiStatus,
      },
    ],
  };

  const miningMetris: DeviceAttributeGroup = {
    name: "Mining metrics",
    attributes: [
      {
        name: "Hash rate",
        type: "hash-rate",
        value: systemInfo.hashRate,
      },
      {
        name: "Best difficulty",
        type: "literal",
        value: systemInfo.bestDiff,
      },
      {
        name: "Shares accepted",
        type: "literal",
        value: systemInfo.sharesAccepted,
      },
      {
        name: "Shares rejected",
        type: "literal",
        value: systemInfo.sharesRejected,
      },
    ],
  };

  const hardwareInformation: DeviceAttributeGroup = {
    name: "Hardware information",
    attributes: [
      {
        name: "Power",
        type: "watts",
        value: systemInfo.power,
      },
      {
        name: "Voltage",
        type: "volts",
        value: systemInfo.voltage,
      },
      {
        name: "Current",
        type: "amps",
        value: systemInfo.current,
      },
      {
        name: "Frequency",
        type: "mhz",
        value: systemInfo.frequency,
      },

      {
        name: "Core voltage",
        type: "volts",
        value: systemInfo.coreVoltage,
      },
      {
        name: "Core voltage (actual)",
        type: "volts",
        value: systemInfo.coreVoltageActual,
      },
      {
        name: "Fan speed",
        type: "rpm",
        value: systemInfo.fanSpeed,
      },
      {
        name: "Board temp 1",
        type: "celsius",
        value: systemInfo.boardtemp1,
      },
      {
        name: "Board temp 2",

        type: "celsius",
        value: systemInfo.boardtemp2,
      },
      {
        name: "Chip temperture",
        type: "celsius",
        value: systemInfo.temp,
      },
      {
        name: "Heap memory",
        type: "bytes",
        value: systemInfo.freeHeap,
      },
    ],
  };

  const configuration: DeviceAttributeGroup = {
    name: "Configuration",
    attributes: [
      {
        name: "Auto fan speed",
        type: "binary",
        value: systemInfo.autofanspeed,
      },
      {
        name: "Flip screen",
        type: "binary",
        value: systemInfo.flipscreen,
      },
      {
        name: "Invert screen",
        type: "binary",
        value: systemInfo.invertscreen,
      },
      {
        name: "Invert fan polarity",
        type: "binary",
        value: systemInfo.invertfanpolarity,
      },
    ],
  };

  const stratum: DeviceAttributeGroup = {
    name: "Stratum",
    attributes: [
      {
        name: "Stratum URL",
        type: "literal",
        value: systemInfo.stratumURL,
      },
      {
        name: "Stratum port",
        type: "literal",
        value: systemInfo.stratumPort,
      },
      {
        name: "Stratum user",
        type: "stratum-user",
        value: systemInfo.stratumUser,
      },
    ],
  };

  return {
    name: systemInfo.hostname,
    attributeGroups: [systemOverview, miningMetris, hardwareInformation, configuration, stratum],
  };
}

async function checkConnection(ip: string): Promise<ActionResponse> {
  const info = await getInfo(ip);
  return {
    success: info != null,
    message: "Test value",
  };
}

const adapter: DeviceService = {
  getInfo,
  getActions,
  getDetails,
};

export default adapter;
