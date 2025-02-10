import type { SwarmContextValue } from "@/contexts/SwarmContext";
import { SwarmContext } from "@/contexts/SwarmContext";
import { useContext } from "react";

function useSwarm(): SwarmContextValue {
  return useContext(SwarmContext);
}

export default useSwarm;
