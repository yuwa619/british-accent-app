const vercelAutomationBypassSecret =
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();

const placeholderBypassValues = new Set([
  "<secret>",
  "YOUR_NEW_BYPASS_SECRET",
  "your-local-bypass-value",
  "your-bypass-secret",
]);

function getVercelAutomationBypassSecret() {
  if (!vercelAutomationBypassSecret) {
    return null;
  }

  if (placeholderBypassValues.has(vercelAutomationBypassSecret)) {
    throw new Error(
      "VERCEL_AUTOMATION_BYPASS_SECRET appears to be a placeholder. Use the real Vercel Protection Bypass for Automation value, or unset it for local tests."
    );
  }

  return vercelAutomationBypassSecret;
}

export function withVercelProtectionBypass(path: string) {
  const bypassSecret = getVercelAutomationBypassSecret();

  if (!bypassSecret) {
    return path;
  }

  const url = new URL(path, "https://playwright.local");
  url.searchParams.set("x-vercel-protection-bypass", bypassSecret);
  url.searchParams.set("x-vercel-set-bypass-cookie", "true");

  return `${url.pathname}${url.search}${url.hash}`;
}
