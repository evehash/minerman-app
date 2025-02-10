import * as Network from "expo-network";

export async function isConnectedToWifi(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.type === Network.NetworkStateType.WIFI;
  } catch (error) {
    console.error("Error verificando la conexión WiFi:", error);
    return false;
  }
}

export async function getNetworkPrefix(): Promise<string | null> {
  try {
    const ipAddress = await Network.getIpAddressAsync();
    if (ipAddress) {
      const ipParts = ipAddress.split(".");
      if (ipParts.length === 4) {
        const firstOctet = parseInt(ipParts[0], 10);

        if (firstOctet >= 1 && firstOctet <= 126) {
          // Class A (8 bits)
          return `${ipParts[0]}.`;
        } else if (firstOctet >= 128 && firstOctet <= 191) {
          // Class B (16 bits)
          return `${ipParts[0]}.${ipParts[1]}.`;
        } else {
          // Class C (24 bits)
          return `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo la parte de red de la IP:", error);
    return null;
  }
}
