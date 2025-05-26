export function extractBrowserName(userAgent: string): string {
  if (!userAgent) return "Unknown";

  const ua = userAgent.toLowerCase();

  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg/") || ua.includes("edge")) return "Edge";
  if (ua.includes("opr") || ua.includes("opera")) return "Opera";
  if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr"))
    return "Chrome";
  if (
    ua.includes("safari") &&
    !ua.includes("chrome") &&
    !ua.includes("chromium")
  )
    return "Safari";
  if (ua.includes("msie") || ua.includes("trident")) return "Internet Explorer";

  return "Other";
}
