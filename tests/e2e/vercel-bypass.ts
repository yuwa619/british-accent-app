const vercelAutomationBypassSecret =
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();

export function withVercelProtectionBypass(path: string) {
  if (!vercelAutomationBypassSecret) {
    return path;
  }

  const url = new URL(path, "https://playwright.local");
  url.searchParams.set(
    "x-vercel-protection-bypass",
    vercelAutomationBypassSecret
  );
  url.searchParams.set("x-vercel-set-bypass-cookie", "true");

  return `${url.pathname}${url.search}${url.hash}`;
}
