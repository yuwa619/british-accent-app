import { expect, type Page, test } from "@playwright/test";

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

async function isVisible(page: Page, text: string) {
  return page
    .getByText(text)
    .isVisible({ timeout: 500 })
    .catch(() => false);
}

function isSignInRoute(url: string) {
  return /\/auth\/sign-in(?:\?|$)/.test(url);
}

async function expectSignedOutActionOutcome(
  page: Page,
  visibleOutcomes: string[]
) {
  await expect
    .poll(
      async () => {
        if (isSignInRoute(page.url())) {
          return true;
        }

        for (const outcome of visibleOutcomes) {
          if (await isVisible(page, outcome)) {
            return true;
          }
        }

        return false;
      },
      {
        message: "expected a sign-in gate or safe mock-mode action outcome",
        timeout: 15_000,
      }
    )
    .toBe(true);
}

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

  test("signed-out roleplay and settings actions stay gated or safe", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto(withVercelProtectionBypass("/practice/roleplay"));
    await expectNoAppError(page);

    if (!/\/auth\/sign-in(?:\?|$)/.test(page.url())) {
      await page.getByRole("button", { name: "Start roleplay" }).click();
      await expectNoAppError(page);

      await expectSignedOutActionOutcome(page, [
        "Sign in to start a roleplay session.",
        "Session active",
      ]);
    }

    await page.context().clearCookies();
    await page.goto(withVercelProtectionBypass("/settings"));
    await expectNoAppError(page);

    if (!/\/auth\/sign-in(?:\?|$)/.test(page.url())) {
      await page.getByRole("button", { name: "Save settings" }).click();
      await expectNoAppError(page);

      await expectSignedOutActionOutcome(page, [
        "Sign in to update privacy settings.",
        "Mock settings saved for this session.",
      ]);
    }
  });
});
