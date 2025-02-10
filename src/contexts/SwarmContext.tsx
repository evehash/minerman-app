import type { ReactElement, ReactNode } from "react";
import { createContext, useState } from "react";

interface SwarmMiner {
  ip: string;
  hashRate: number;
  expectedHashRate: number;
  power: number;
  shares: {
    accepted: number;
    rejected: number;
  };
}

export interface SwarmContextValue {
  swarm: {
    hashRate: number;
    expectedHashRate: number;
    power: number;
    shares: {
      accepted: number;
      rejected: number;
    };
  };
  updateMiner: (miner: SwarmMiner) => void;
  removeMiner: (miner: SwarmMiner) => void;
}

export const SwarmContext = createContext<SwarmContextValue>({
  swarm: {
    hashRate: 0,
    expectedHashRate: 0,
    power: 0,
    shares: {
      accepted: 0,
      rejected: 0,
    },
  },
  updateMiner: () => {},
  removeMiner: () => {},
});

interface SwarmState {
  miners: SwarmMiner[];
  hashRate: number;
  expectedHashRate: number;
  power: number;
  shares: {
    accepted: number;
    rejected: number;
  };
}

interface SwarmContextProviderProps {
  children: ReactNode;
}

export function SwarmContextProvider({ children }: SwarmContextProviderProps): ReactElement {
  const [swarm, setSwarm] = useState<SwarmState>({
    miners: [],
    hashRate: 0,
    expectedHashRate: 0,
    power: 0,
    shares: {
      accepted: 0,
      rejected: 0,
    },
  });

  const updateMiner = (miner: SwarmMiner): void => {
    setSwarm((prev) => {
      const updatedMiners = prev.miners.filter(({ ip }) => miner.ip !== ip).concat(miner);
      const values = aggregateValues(updatedMiners);
      return { ...values, miners: updatedMiners };
    });
  };

  const removeMiner = (miner: SwarmMiner): void => {
    setSwarm((prev) => {
      const updatedMiners = prev.miners.filter(({ ip }) => miner.ip !== ip);
      const values = aggregateValues(updatedMiners);
      return { ...values, miners: updatedMiners };
    });
  };

  return <SwarmContext.Provider value={{ swarm, updateMiner, removeMiner }}>{children}</SwarmContext.Provider>;
}

function aggregateValues(miners: SwarmMiner[]): Omit<SwarmState, "miners"> {
  return miners.reduce(
    (acc, miner) => {
      acc.hashRate += miner.hashRate;
      acc.expectedHashRate += miner.expectedHashRate;
      acc.power += miner.power;
      acc.shares.accepted += miner.shares.accepted;
      acc.shares.rejected += miner.shares.rejected;
      return acc;
    },
    { hashRate: 0, expectedHashRate: 0, power: 0, shares: { accepted: 0, rejected: 0 } },
  );
}
