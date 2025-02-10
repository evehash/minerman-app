//import type { Device } from "@/types";
import type { DeviceInfo } from "@/services/deviceService";
import getMinerService from "@/services/minerService";
import type { Miner } from "@/stores/minersSlice";
import { useEffect, useState } from "react";

interface UseGetSystemInfoReturn {
  data: DeviceInfo | null;
  isLoading: boolean;
  error: string | null;
  //refresh: () => void;
}

interface GetSystemInfoState {
  data: DeviceInfo | null;
  isLoading: boolean;
  error: string | null;
}

// interface UseGetSystemInfoProps {
//   device: Device;
// }

// Hook para obtener SystemInfo
export function useGetSystemInfo({ ip, adapter }: Miner): UseGetSystemInfoReturn {
  // const [data, setData] = useState<SystemInfo | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  //const [tick, setTick] = useState<boolean>(false);

  const [data, setData] = useState<GetSystemInfoState>({
    data: null,
    isLoading: false,
    error: null,
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     //if (!expanded) refresh();
  //   }, 60000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      //if (data.isLoading) return;

      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        // console.log(`fetching data form ${device.ip}`);
        // const response = await fetch(`http://${device.ip}/api/system/info`);

        // if (!response.ok) {
        //   throw new Error(`Error fetching data: ${response.statusText}`);
        // }

        // const result: SystemInfo = await response.json();
        const minerService = getMinerService(adapter);

        let response = await minerService.getInfo(ip);
        if (response.success) {
          setData({ data: response.data, isLoading: false, error: null });
        }
      } catch (err: any) {
        setData((prev) => ({ ...prev, ...{ error: "error", isLoading: false } }));
        console.log(err);
      } finally {
        //setTimeout(fetchSystemInfo, 10000);
      }
    };

    fetchSystemInfo();
  }, [ip, adapter]);

  //const refresh = () => setTick((prev) => !prev);

  return { ...data };
}

export default useGetSystemInfo;
