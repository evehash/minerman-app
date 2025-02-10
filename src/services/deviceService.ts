import avalonNano3Adapter from "./avalon-nano-3";
import axeOsAdapter from "./axe-os";

export interface CheckConnectionResponse {}

interface ActionResponse {
  success: boolean;
  message: string;
}

interface DeviceAction {
  icon: "led-variant-off" | "led-on" | "speedometer" | "speedometer-medium" | "speedometer-slow" | "restart";
  label: string;
  performAction: () => Promise<ActionResponse>;
}

export interface DeviceInfo {
  name: string;
  hashRate: number;
  expectedHashRate: number;
  power: number;
  temperature: number;
  stratumUser: string;
  stratum?: {
    user: string;
  };
  shares: {
    accepted: number;
    rejected: number;
  };
}

//type DeviceAttributeValue = string | { type: string; rawValue: number } | { type: "stratumUser"; rawValue: string };

//type DeviceAttributeType =

// interface DeviceAttribute {
//   name: string;
//   value: DeviceAttributeValue;
// }

type DeviceAttribute =
  | { name: string; type: "amps"; value: number }
  | { name: string; type: "literal"; value: string | number }
  | { name: string; type: "volts"; value: number }
  | { name: string; type: "watts"; value: number }
  | { name: string; type: "rpm"; value: number }
  | { name: string; type: "seconds"; value: number }
  | { name: string; type: "mhz"; value: number }
  | { name: string; type: "celsius"; value: number }
  | { name: string; type: "bytes"; value: number }
  | { name: string; type: "stratum-url"; value: string }
  | { name: string; type: "stratum-user"; value: string }
  | { name: string; type: "hash-rate"; value: number }
  | { name: string; type: "binary"; value: 0 | 1 };

interface DeviceAttributeGroup {
  name: string;
  attributes: DeviceAttribute[];
}

interface DeviceDetails {
  name: string;
  attributeGroups: DeviceAttributeGroup[];
}

export interface DeviceService {
  //isConnected: (ip: string) => Promise<ActionResponse>;
  getInfo: (ip: string) => Promise<DeviceInfo | null>;
  getActions: (ip: string) => Promise<DeviceAction[]>;
  getDetails: (ip: string) => Promise<DeviceDetails>;
}

function getDeviceService(type: string): DeviceService | null {
  if (type === "avalon-nano-3") {
    return avalonNano3Adapter;
  }

  return axeOsAdapter;
}

export default getDeviceService;
export type { ActionResponse, DeviceAction, DeviceAttribute, DeviceAttributeGroup, DeviceDetails };
