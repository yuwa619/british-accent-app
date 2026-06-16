import { expect, test } from "@playwright/test";

import {
  expectNoAppError,
  expectProtectedRouteSignedOutState,
  isExternalPreview,
} from "./helpers";
import { withVercelProtectionBypass } from "./vercel-bypass";

const protectedRoutes = [
  "/dashboard",
  "/diagnostic",
  "/lessons",
  "/lessons/clear-british-vowels",
  "/practice/shadowing",
  "/practice/roleplay",
  "/feedback/mock-recording-id",
  "/progress",
  "/settings",
];

test.describe("signed-out protected route coverage", () => {
  test.skip(
    !isExternalPreview,
    "Local mock mode intentionally renders protected MVP screens without Supabase auth."
  );

  for (const route of protectedRoutes) {
    test(`${route} is safe when signed out`, async ({ page }) => {
      await page.context().clearCookies();
      await expectProtectedRouteSignedOutState(page, route);
    });
  }

  test("signed-out roleplay and settings actions ask for sign-in", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto(withVercelProtectionBypass("/practice/roleplay"));
    await expectNoAppError(page);

    if (!/\/auth\/sign-in(?:\?|$)/.test(page.url())) {
      await page.getByRole("button", { name: "Start roleplay" }).click();
      await expect(
        page.getByText("Sign in to start a roleplay session.")
      ).toBeVisible();
    }

    await page.context().clearCookies();
    await page.goto(withVercelProtectionBypass("/settings"));
    await expectNoAppError(page);

    if (!/\/auth\/sign-in(?:\?|$)/.test(page.url())) {
      await page.getByRole("button", { name: "Save settings" }).click();
      await expect(
        page.getByText("Sign in to update privacy settings.")
      ).toBeVisible();
    }
  });
});
