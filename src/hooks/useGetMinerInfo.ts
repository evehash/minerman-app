import type { MinerError, MinerInfo } from "@/services/minerService";
import getMinerService from "@/services/minerService";
import type { Miner } from "@/stores/minersSlice";
import { useCallback, useEffect, useState } from "react";

interface UseGetMinerInfoProps {
  miner: Miner;
}

interface UseGetMinerInfoReturn {
  isLoading: boolean;
  data: MinerInfo | null;
  error: MinerError | null;
}

function useGetMinerInfo({ miner }: UseGetMinerInfoProps): UseGetMinerInfoReturn {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<MinerInfo | null>(null);
  const [error, setError] = useState<MinerError | null>(null);

  const minerService = getMinerService(miner);

  const fetchMinerInfo = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const response = await minerService.getInfo();
    if (response.success) {
      setData(response.data);
    } else {
      setError(response.error);
    }
    setLoading(false);
  }, [miner.ip, miner.adapter]);

  useEffect(() => {
    fetchMinerInfo();
  }, [fetchMinerInfo]);

  return { isLoading, data, error };
}

export default useGetMinerInfo;
