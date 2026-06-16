import { expect, type Page } from "@playwright/test";

import { withVercelProtectionBypass } from "./vercel-bypass";

export const isExternalPreview = Boolean(process.env.PLAYWRIGHT_BASE_URL);
export const hasE2ETestCredentials = Boolean(
  process.env.E2E_TEST_EMAIL?.trim() && process.env.E2E_TEST_PASSWORD?.trim()
);

export function collectClientErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

export async function expectHealthyPage(
  page: Page,
  path: string,
  heading: string | RegExp
) {
  const errors = collectClientErrors(page);

  await page.goto(withVercelProtectionBypass(path));
  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);
  expect(errors).toEqual([]);
}

export async function expectNoAppError(page: Page) {
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.getByText("Application error")).toHaveCount(0);
  await expect(page.getByText("Unhandled Runtime Error")).toHaveCount(0);
  await expect(page.getByText("MIDDLEWARE_INVOCATION_FAILED")).toHaveCount(0);
}

export async function signInTestUser(page: Page) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E test credentials are not configured. Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD."
    );
  }

  await page.goto(withVercelProtectionBypass("/auth/sign-in"));
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/dashboard(?:\?|$)/, { timeout: 15_000 });
}

export async function expectProtectedRouteSignedOutState(
  page: Page,
  path: string
) {
  const errors = collectClientErrors(page);

  await page.goto(withVercelProtectionBypass(path));
  await expectNoAppError(page);
  expect(errors).toEqual([]);
}
