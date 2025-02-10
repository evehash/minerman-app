export function calculateShareSuccessPercentage({
  accepted,
  rejected,
}: {
  accepted: number;
  rejected: number;
}): number {
  const totalShares = accepted + rejected;

  if (totalShares === 0) {
    return 0;
  }

  return (accepted / totalShares) * 100;
}

export function calculateEfficiency(voltageInWatts: number, hashRateInGH: number): number {
  if (hashRateInGH === 0) {
    return 0;
  }

  const hashRateInTH = hashRateInGH / 1000;
  return voltageInWatts / hashRateInTH;
}
