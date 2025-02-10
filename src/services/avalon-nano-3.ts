import TcpSocket from "react-native-tcp-socket";
import type { ActionResponse, DeviceAction, DeviceService, DeviceInfo } from "./deviceService";

function createCommandConcurrencyController() {
  const hostMap = new Map(); // Mapa de colas y contadores por host

  function getOrCreateHostQueue(host) {
    if (!hostMap.has(host)) {
      hostMap.set(host, { activeCount: 0, queue: [] });
    }
    return hostMap.get(host);
  }

  async function acquireHost(host) {
    const hostQueue = getOrCreateHostQueue(host);

    if (hostQueue.activeCount === 0) {
      hostQueue.activeCount++;
    } else {
      await new Promise((resolve) => hostQueue.queue.push(resolve));
    }
  }

  function releaseHost(host) {
    const hostQueue = hostMap.get(host);

    if (!hostQueue) return;

    if (hostQueue.queue.length > 0) {
      const next = hostQueue.queue.shift();
      next();
    } else {
      hostQueue.activeCount--;

      // Si no hay tareas pendientes ni activas, limpiamos la entrada del host
      if (hostQueue.activeCount === 0 && hostQueue.queue.length === 0) {
        hostMap.delete(host);
      }
    }
  }

  async function execute(host, cmd): Promise<string> {
    await acquireHost(host);
    try {
      return command(host, cmd);
    } finally {
      releaseHost(host);
    }
  }

  return { execute };
}

const commandConcurrencyController = createCommandConcurrencyController();

// https://github.com/Canaan-Creative/avalon10-docs/blob/master/Universal%20API/Avalon%20A10%20API%20manual-EN.md

const CMD_PORT = 4028;
//const LEDRGB_STEP = 5;

function parseNumericArray(payload, key): number[] {
  const pattern = new RegExp(`${key}[=\\[]([\\d]+(?: [\\d]+)*)\\]?`);
  const match = payload.match(pattern);
  return match ? match[1].split(" ").map(Number) : [];
}

function parseKey(payload, key): string {
  const pattern = new RegExp(`${key}[=\\[]([\\w.-]+)\\]?`);
  const match = payload.match(pattern);
  return match ? match[1] : "";
}

function parseNumber(payload, key): number {
  const pattern = new RegExp(`${key}[=\\[]([\\d]+(?:\\.\\d+)?)\\]?`);
  const match = payload.match(pattern);
  return match ? (isNaN(match[1]) ? 0 : parseFloat(match[1])) : 0;
}

interface Stats {
  Ver: string;
  HVer: string;
  HDNA: string;
  Elapsed: number;
  LW: number;
  MH: number;
  DH: number;
  Temp: number;
  TMax: number;
  TAvg: number;
  Fan1: number;
  FanR: string;
  GHSspd: number;
  DHspd: string;
  GHSmm: number;
  GHSavg: number;
  WU: number;
  MGHS: number;
  MTmax: number;
  MTavg: number;
  TA: number;
  Core: string;
  PS: number[];
}

function parseStats(payload): Stats {
  return {
    Elapsed: parseNumber(payload, "Elapsed"),
    LW: parseNumber(payload, "LW"),
    MH: parseNumber(payload, "MH"),
    DH: parseNumber(payload, "DH"),
    HDNA: parseKey(payload, "HDNA"),
    Temp: parseNumber(payload, "Temp"),
    TMax: parseNumber(payload, "TMax"),
    TAvg: parseNumber(payload, "TAvg"),
    Fan1: parseNumber(payload, "Fan1"),
    FanR: parseKey(payload, "FanR"),
    GHSspd: parseNumber(payload, "GHSspd"),
    DHspd: parseKey(payload, "DHspd"),
    GHSmm: parseNumber(payload, "GHSmm"),
    GHSavg: parseNumber(payload, "GHSavg"),
    WU: parseNumber(payload, "WU"),
    MGHS: parseNumber(payload, "MGHS"),
    MTmax: parseNumber(payload, "MTmax"),
    MTavg: parseNumber(payload, "MTavg"),
    TA: parseNumber(payload, "TA"),
    Ver: parseKey(payload, "Ver"),
    HVer: parseKey(payload, "HVer"),
    Core: parseKey(payload, "Core"),
    PS: parseNumericArray(payload, "PS"),
  };
}

interface Pools {
  user: string;
  sharesAccepted: number;
  sharesRejected: number;
}

function parsePool(input: string): Pools | null {
  // Expresión regular para buscar la primera ocurrencia de un pool
  const poolRegex = /Accepted=(\d+),Rejected=(\d+).*?User=([^,]+)/;

  // Ejecutar la expresión regular sobre el input
  const match = input.match(poolRegex);

  if (match) {
    return {
      user: match[3], // El valor de User
      sharesAccepted: parseInt(match[1], 10), // El valor de Accepted
      sharesRejected: parseInt(match[2], 10), // El valor de Rejected
    };
  }

  return null; // Retorna null si no se encuentra el patrón
}

// https://www.zeusbtc.com/articles/asic-miner-troubleshooting/2731-avalon-miner-backstage-log-description
// function parseStatsPayload(payload) {
//   const result = {};

//   // Extrae el contenido del payload dividiéndolo por comas y luego por el signo igual
//   payload.split(",").forEach((item) => {
//     const [key, value] = item.split("=");
//     if (value !== undefined) {
//       result[key] = value;
//     }
//   });
//github.com/Canaan-Creative/avalon10-docs/blob/master/Universal%20API/Avalon%20A10%20API%20manual-EN.md
//   // Construye el objeto con los parámetros especificados, estableciendo valores predeterminados en caso de que falten
//   return {
//     //Ver: result["MM ID0"]?.match(/Ver\[(.*?)\]/)?.[1] || null,
//     //HVer: result["MM ID0"]?.match(/HVer\[(.*?)\]/)?.[1] || null,
//     elapsed: result["Elapsed"] ? parseInt(result["Elapsed"], 10) : null,
//     //LW: result["LW"] ? parseInt(result["LW"], 10) : null,
//     //MH: result["MH"] ? parseInt(result["MH"], 10) : null,
//     //DH: result["DH"] ? parseFloat(result["DH"]) : null,
//     temp: result["Temp"] ? parseInt(result["Temp"], 10) : null,
//     //TMax: result["TMax"] ? parseInt(result["TMax"], 10) : null,
//     //TAvg: result["TAvg"] ? parseInt(result["TAvg"], 10) : null,
//     //Fan1: result["Fan1"] ? parseInt(result["Fan1"], 10) : null, // FAN RPM
//     //FanR: result["FanR"] || null,
//     //PS: result["PS"] ? result["PS"].split(" ").map(Number) : null,
//     hashrate: result["GHSspd"] ? parseFloat(result["GHSspd"]) : null,
//     //DHspd: result["DHspd"] ? parseFloat(result["DHspd"]) : null,
//     //GHSmm: result["GHSmm"] ? parseFloat(result["GHSmm"]) : null,
//     hravg: result["GHSavg"] ? parseFloat(result["GHSavg"]) : null,
//     //WU: result["WU"] ? parseFloat(result["WU"]) : null,
//     //MGHS: result["MGHS"] ? parseFloat(result["MGHS"]) : null,
//     //MTmax: result["MTmax"] ? parseInt(result["MTmax"], 10) : null,
//     //MTavg: result["MTavg"] ? parseInt(result["MTavg"], 10) : null,
//     ta: result["TA"] ? parseInt(result["TA"], 10) : null,
//     //Core: result["Core"] || null,
//   };
// }

function cleanupResult(res: string): string {
  //console.log("RAW:" + res);
  // eslint-disable-next-line no-control-regex
  res = res.replace(/\x00$/, "").replace(/\|$/, "");
  const parts = res.split("|");
  let result = parts[0];
  let details = parts.slice(1).join("|");

  result = result.split(",")[3] || result;
  result = result.replace(/Msg=ASC 0 set info: /, "");

  //console.log("CONVERT:" + result, details);
  return details ? `${result}|${details}` : result;
}
//const result = STATUS=I,When=1731710855,Code=118,Msg=ASC 0 set info: led setmode ok,Description=cgminer 4.11.1|

function command(host: string, cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = TcpSocket.createConnection({ host, port: CMD_PORT }, () => {
      client.write(cmd);
    });

    client.on("data", (data) => {
      resolve(cleanupResult(data.toString()));
      client.destroy();
    });

    client.on("error", (error) => {
      reject(error);
      client.destroy();
    });
  });
}

// async function getStats(host: string): Promise<string> {
//   return command(host, "estats|").then((result) => {
//     const stats = result.split("|");
//     return stats[1] ?? "";
//   });
// }

async function turnOnLed(host: string): Promise<ActionResponse> {
  return command(host, "ascset|0,led,setmode,1").then((result) => {
    //return result == "led setmode ok";
    console.log("RESULT: " + result);
    const success = result == "led setmode ok";
    if (success) {
      return {
        success,
        message: "Led has been turn on",
      };
    } else
      return {
        success,
        message: "La operación falló",
      };
  });
}

async function turnOffLed(host: string): Promise<ActionResponse> {
  return command(host, "ascset|0,led,setmode,0").then((result) => {
    console.log("RESULT: " + result);
    const success = result == "led setmode ok";
    if (success) {
      return {
        success,
        message: "Led has been turn off",
      };
    } else
      return {
        success,
        message: "La operación falló",
      };
  });
}

type WorkLevel = "low" | "medium" | "high";

async function getWorkLevel(host: string): Promise<WorkLevel> {
  return command(host, "ascset|0,worklevel,get").then((response) => {
    const values = response.split(" ");
    const level = values[1];

    const s: WorkLevel[] = ["low", "medium", "high"];
    if (level === "0" || level == "1" || level == "2") return s[parseInt(level)];
    else throw new Error("Cannot get work level");
  });
}

async function setWorkLevel(host: string, level: WorkLevel): Promise<Boolean> {
  const s: WorkLevel[] = ["low", "medium", "high"];
  const index = s.indexOf(level);

  return command(host, "ascset|0,worklevel,set," + index).then((response) => {
    return response == "OK";
  });
}

async function getLed(host: string): Promise<string> {
  const result = await command(host, "ascset|0,led,get");
  console.log("READ LED: " + result);
  // Procesa el resultado para extraer la información LED
  const info = result
    .replace(/^led\[/, "")
    .replace(/\]$/, "")
    .split("-");

  const modes: { [key: string]: string } = {
    "0": "off",
    "1": "fixed",
    "2": "flash",
    "3": "pulse",
    "4": "loop",
  };

  // Construye el arreglo de resultados
  return modes[info[0]];
}

type WorkLevelIcons = "speedometer" | "speedometer-medium" | "speedometer-slow";

let mode = 0;
async function getActions2(host: string): Promise<DeviceAction[]> {
  //   const response = await sendCommand(client, "ascset|0,worklevel,get");

  //   const values = response.split(" ");
  //   const level = values[1];

  //   const s: WorkLevel[] = ["low", "medium", "high"];
  //   const worklevel = level === "0" || level == "1" || level == "2" ? s[parseInt(level)] : "low";
  //   const inx = s.indexOf(worklevel);
  //   const nextIndex = inx + (1 % 3);
  const speedoicons: WorkLevelIcons[] = ["speedometer", "speedometer-medium", "speedometer-slow"];
  //   const icon = icons[inx];
  //   const nextLevel = () => setWorkLevel(host, s[nextIndex]);

  const response2 = await commandConcurrencyController.execute(host, "ascset|0,led,get");
  console.log("VALUE OF RESPONSE 2", response2);
  console.log("VA---------------------------_");
  const match = response2.match(/led\[(\d+)-/);
  const flag = match ? match[1].toString() : null;

  const modes: { [key: string]: string } = {
    "0": "off",
    "1": "fixed",
    "2": "flash",
    "3": "pulse",
    "4": "loop",
  };

  const fn = () => {
    mode = (mode + 1) % 3;
    console.log(mode);
  };

  const led = modes[flag ?? "0"];
  var ledFn;
  var ledIcon;
  console.log("VLAUE oF LED", led);
  var executingMessage;
  if (led === "off") {
    ledFn = () => turnOnLed(host);
    ledIcon = "led-variant-off";
    executingMessage = "Turning off the LED...";
  } else {
    ledFn = () => turnOffLed(host);
    ledIcon = "led-on";
    executingMessage = "Turning on the LED...";
  }

  return [
    { label: "turnoff", icon: ledIcon, performAction: ledFn, executingMessage },
    { label: "heater", icon: speedoicons[mode], performAction: fn, executingMessage: "Adjusting level..." },
  ];
}

// async function getActions(host: string): Promise<DeviceAction[]> {
//   const worklevel = await getWorkLevel(host);
//   const s: WorkLevel[] = ["low", "medium", "high"];
//   const inx = s.indexOf(worklevel);
//   const nextIndex = inx + (1 % 3);
//   const icons: WorkLevelIcons[] = ["speedometer", "speedometer-medium", "speedometer-slow"];
//   const icon = icons[inx];
//   const nextLevel = () => setWorkLevel(host, s[nextIndex]);

//   const led = await getLed(host);

//   var ledFn;
//   var ledIcon;
//   var executingMessage;
//   if (led !== "off") {
//     ledFn = () => turnOffLed(host);
//     ledIcon = "led-variant-off";
//     executingMessage = "Turning off the LED...";
//   } else {
//     ledFn = () => turnOnLed(host);
//     ledIcon = "led-variant-on";
//     executingMessage = "Turning on the LED...";
//   }

//   return [
//     { name: "turnoff", icon: ledIcon, action: ledFn, executingMessage },
//     { name: "heater", icon: icon, action: nextLevel, executingMessage: "Adjusting level..." },
//   ];
// }

async function getInfo(ip: string): Promise<DeviceInfo | null> {
  //const data = await getStats(ip);
  //console.log("--------------------------------------- GET INFO -------------------------------------------");

  const rawEstats = await commandConcurrencyController.execute(ip, "estats");
  const rawPools = await commandConcurrencyController.execute(ip, "pools");
  //const norm = parsePayload(summary);
  // const summary = await command(ip, "summary");
  // const pools = await command(ip, "pools");
  const stats = parseStats(rawEstats);
  const pools = parsePool(rawPools);

  console.log(stats);
  const power = stats.PS[5];
  // console.log("result", result);r
  // const stats = result.split("|");
  // const data = stats[1] ?? "";
  // console.log("--------------------------------------- POOLS -------------------------------------------");
  // const result2 = await sendCommand(socket, "pools");
  // // const pools = result2.split("|");
  // console.log(result2);
  // console.log("--------------------------------------- /POOLS -------------------------------------------");
  // socket.destroy();
  if (pools === null) return null;

  //console.log(pools);

  //console.log(data);
  //const norm = parsePayload(data);
  console.log("POOL", pools);
  return {
    name: stats.HDNA,
    stratumUser: pools.user,
    power: power,
    hashRate: stats.GHSspd,
    temperature: stats.TAvg,
    sharesAccepted: pools.sharesAccepted,
    sharesRejected: pools.sharesRejected,
  };
}

async function checkConnection(ip: string): Promise<ActionResponse> {
  const info = await getInfo(ip);
  return { success: info != null, message: "Just a dummy test" };
}

const adapter: DeviceService = {
  checkConnection,
  getInfo,
  getActions: getActions2,
};

export default adapter;
