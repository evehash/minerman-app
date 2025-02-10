export function formatHashRate(hashRateInGH: number): string {
  const units = ["GH/s", "TH/s", "PH/s", "EH/s", "ZH/s"];
  let unitIndex = 0;

  while (hashRateInGH >= 1000 && unitIndex < units.length - 1) {
    hashRateInGH /= 1000;
    unitIndex++;
  }

  return `${hashRateInGH.toFixed(1)} ${units[unitIndex]}`;
}

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toFixed(1)} ${units[unitIndex]}`;
}

export function formatPower(voltageInWatts: number): string {
  const roundedPower = Math.round(voltageInWatts);
  return `${roundedPower} W`;
}

export function formatAmps(amps: number): string {
  const roundedAmps = Math.round(amps);
  return `${roundedAmps} A`;
}

export function formatVolts(volts: number): string {
  return `${volts.toFixed(2)} V`;
}

export function formatFrequency(frequencyInHz: number): string {
  const units = ["MHz", "GHz"];
  let unitIndex = 0;

  while (frequencyInHz >= 1000 && unitIndex < units.length - 1) {
    frequencyInHz /= 1000;
    unitIndex++;
  }

  return `${frequencyInHz.toFixed(1)} ${units[unitIndex]}`;
}

export function formatEfficiency(efficiency: number): string {
  return `${efficiency.toFixed(1)} J/TH`;
}

export function formatPercentage(percentage: number): string {
  return percentage.toFixed(1) + "%";
}

export function formatTemperature(temperatureInCelsius: number, unit: "celsius" | "fahrenheit"): string {
  let convertedTemperature = temperatureInCelsius;

  if (unit === "fahrenheit") {
    convertedTemperature = (temperatureInCelsius * 9) / 5 + 32;
  }

  const roundedTemperature = Math.round(convertedTemperature);

  if (unit === "celsius") {
    return `${roundedTemperature} ºC`;
  } else {
    return `${roundedTemperature} ºF`;
  }
}

export const formatUptime = (seconds?: number): string => {
  if (seconds === undefined) return "--";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

export const formatBinary = (value?: number): string => (value === 1 ? "On" : "Off");
