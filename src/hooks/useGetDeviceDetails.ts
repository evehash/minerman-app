import type { DeviceAttribute, DeviceAttributeGroup, DeviceDetails } from "@/services/deviceService";
import getDeviceService from "@/services/deviceService";
import type { Device } from "@/stores/minersSlice";
import { useEffect, useState } from "react";

interface UseGetDeviceDetailsReturn {
  details: DeviceDetails | null;
  isLoading: boolean;
  error: string | null;
}

export function useGetDeviceDetails(device: Device): UseGetDeviceDetailsReturn {
  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeviceDetails = async () => {
    if (isLoading) return;

    try {
      setLoading(true);

      const deviceService = getDeviceService(device.type);
      if (deviceService === null) {
        setError("device cannot be handled");
        return;
      }

      let details = await deviceService.getDetails(device.ip);
      setDetails(details);
    } catch (err: any) {
      console.log(err);
      setError("error in catch" + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [device.ip]);

  return { details, isLoading, error };
}

export type { DeviceAttribute, DeviceAttributeGroup, DeviceDetails };
