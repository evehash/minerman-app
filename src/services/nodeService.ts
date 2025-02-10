//import { encode } from "base-64";

interface NodeError {
  message: string;
}

async function getBlockHeight(config: RpcConfig): Promise<Response<number, NodeError>> {
  const { url, user, password } = config;

  console.log("before fetch");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line no-undef
      Authorization: `Basic ${btoa(`${user}:${password}`)}`,
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "getblockcount",
      method: "getblockcount",
      params: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log("data: " + data);
  return { success: true, data: data.result };
}

interface NetworkInfo {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
}

async function getNetworkInfo(config: RpcConfig): Promise<Response<NetworkInfo, NodeError>> {
  const { url, user, password } = config;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line no-undef
      Authorization: `Basic ${btoa(`${user}:${password}`)}`,
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "getnetworkinfo",
      method: "getnetworkinfo",
      params: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return { success: true, data: data.result };
}

async function getNetworkHashrate(config: RpcConfig): Promise<Response<number, NodeError>> {
  const { url, user, password } = config;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line no-undef
      Authorization: `Basic ${btoa(`${user}:${password}`)}`,
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "getnetworkhashps",
      method: "getnetworkhashps",
      params: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return { success: true, data: data.result };
}

async function getBlockStatsTotalFee(config: RpcConfig, blockHeight: number): Promise<Response<number, NodeError>> {
  const { url, user, password } = config;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line no-undef
      Authorization: `Basic ${btoa(`${user}:${password}`)}`,
    },
    body: JSON.stringify({
      jsonrpc: "1.0",
      id: "getblockstats",
      method: "getblockstats",
      params: [blockHeight, ["totalfee"]],
    }),
  });

  if (!response.ok) {
    console.log(JSON.stringify(response));
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  return { success: true, data: data.result.totalfee ?? 0 };
}

type Response<T, E> = { success: true; data: T } | { success: false; error: E };

interface NodeService {
  getBlockHeight(): Promise<Response<number, NodeError>>;
  getNetworkHashrate(): Promise<Response<number, NodeError>>;
  getBlockStatsTotalFee(blockHeight: number): Promise<Response<number, NodeError>>;
  getNetworkInfo(): Promise<Response<NetworkInfo, NodeError>>;
}

interface RpcConfig {
  url: string;
  user: string;
  password: string;
}

export function createService(config: RpcConfig): NodeService {
  return {
    getBlockHeight: () => getBlockHeight(config),
    getNetworkHashrate: () => getNetworkHashrate(config),
    getBlockStatsTotalFee: (blockHeight: number) => getBlockStatsTotalFee(config, blockHeight),
    getNetworkInfo: () => getNetworkInfo(config),
  };
}
