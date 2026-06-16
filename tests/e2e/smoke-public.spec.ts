import { expect, test } from "@playwright/test";

import { expectHealthyPage } from "./helpers";
import { withVercelProtectionBypass } from "./vercel-bypass";

test.describe("public smoke coverage", () => {
  test("system health endpoint is protected and returns JSON", async ({
    request,
  }) => {
    const response = await request.get(
      withVercelProtectionBypass("/api/system/health")
    );
    expect(response.status()).toBe(401);
    expect(response.headers()["content-type"]).toContain("application/json");

    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain("sk-");
    expect(JSON.stringify(body)).not.toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("landing, auth, privacy, and terms routes render signed out", async ({
    page,
  }) => {
    await expectHealthyPage(
      page,
      "/",
      "Speak more clearly and confidently in UK workplace conversations."
    );
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Start practising" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View lessons" })
    ).toBeVisible();

    await expectHealthyPage(page, "/auth/sign-in", "Sign in");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await expectHealthyPage(page, "/auth/sign-up", "Create account");
    await expect(page.getByLabel("Full name")).toBeVisible();

    await expectHealthyPage(
      page,
      "/privacy",
      "Voice practice should feel transparent and controlled."
    );
    await expectHealthyPage(page, "/terms", "Plain-English beta terms.");
  });
});
