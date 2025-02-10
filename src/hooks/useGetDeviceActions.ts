import type { DeviceAction } from "@/services/deviceService";
import getDeviceService from "@/services/deviceService";
import type { Device } from "@/stores/minersSlice";
import { useEffect, useState } from "react";

interface UseGetDeviceActionsReturn {
  actions: DeviceAction[];
  updateActions: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useGetDeviceActions(device: Device): UseGetDeviceActionsReturn {
  const [actions, setActions] = useState<DeviceAction[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeviceActions = async () => {
    if (isLoading) return;

    try {
      console.log("A TRUE");
      setLoading(true);

      const deviceService = getDeviceService(device.type);
      if (deviceService === null) {
        setError("device cannot be handled");
        return;
      }

      let actions = await deviceService.getActions(device.ip);
      setActions(actions);
    } catch (err: any) {
      setError("error in catch" + JSON.stringify(err));
    } finally {
      setLoading(false);
      console.log("A FALSE");
    }
  };

  useEffect(() => {
    fetchDeviceActions();
  }, [device.ip]);

  return { actions, isLoading, error, updateActions: fetchDeviceActions };
}

export default useGetDeviceActions;
