import type { Miner } from "@/stores/minersSlice";
import espMiner2 from "./espMiner2";

interface MinerInfo {
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

interface MinerError {
  message: string;
}

type Response<T, E> = { success: true; data: T } | { success: false; error: E };

interface MinerService {
  getInfo(): Promise<Response<MinerInfo, MinerError>>;
}

interface MinerServiceFactory {
  createService(ip: string);
}

const minerServices = {
  "esp-miner-2": espMiner2,
};

function getMinerService(miner: Miner): MinerService {
  const factory: MinerServiceFactory | undefined = minerServices[miner.adapter];
  const minerService = factory?.createService(miner.ip);
  if (minerService === undefined) {
    throw new Error("unexpected ");
  }
  return minerService;
}

export default getMinerService;
export type { MinerError, MinerInfo, Response as MinerResponse, MinerService };
