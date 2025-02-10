export type ValidationResult = { valid: true } | { valid: false; reason: string };

export function validateIpv4(ip: string): ValidationResult {
  const regex =
    /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)$/;
  return regex.test(ip.trim()) ? { valid: true } : { valid: false, reason: "Not a valid IP" };
}

export function validateUrl(url: string): ValidationResult {
  const regex = /^(https?:\/\/([a-zA-Z0-9.-]+|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?)?$/;
  return regex.test(url.trim()) ? { valid: true } : { valid: false, reason: "Not a valid URL" };
}
