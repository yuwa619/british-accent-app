import { expect, test } from "@playwright/test";

import {
  collectClientErrors,
  expectHealthyPage,
  expectNoAppError,
  hasE2ETestCredentials,
  signInTestUser,
} from "./helpers";
import { withVercelProtectionBypass } from "./vercel-bypass";

test.describe("authenticated staging smoke coverage", () => {
  test.skip(
    !hasE2ETestCredentials,
    "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run authenticated staging flows."
  );

  test.beforeEach(async ({ page }) => {
    await signInTestUser(page);
  });

  test("dashboard, onboarding, progress, and lessons render for a signed-in user", async ({
    page,
  }) => {
    await expectHealthyPage(page, "/dashboard", /Welcome/);
    await expect(page.getByText("Today's practice")).toBeVisible();
    await expect(page.getByText("Progress snapshot")).toBeVisible();

    await expectHealthyPage(
      page,
      "/onboarding",
      "Shape your practice around real UK conversations."
    );
    await expect(page.getByLabel("Native language")).toBeVisible();

    await expectHealthyPage(
      page,
      "/progress",
      "Track clarity and confidence over time."
    );
    await expect(page.getByText("Practice history")).toBeVisible();

    await expectHealthyPage(
      page,
      "/lessons",
      "Practise the sounds and rhythm that carry UK workplace speech."
    );
    await expect(
      page.getByText("Clear British vowels for professional speech")
    ).toBeVisible();
  });

  test("lesson, diagnostic, and shadowing practice screens render signed in", async ({
    page,
  }) => {
    await expectHealthyPage(
      page,
      "/lessons/clear-british-vowels",
      "Clear British vowels for professional speech"
    );
    await expect(page.getByText("Why this matters")).toBeVisible();
    await expect(page.getByRole("button", { name: "Record" })).toBeVisible();

    await expectHealthyPage(
      page,
      "/diagnostic",
      "Build your clarity baseline."
    );
    await expect(page.getByText("Step 1: Reading passage")).toBeVisible();

    await expectHealthyPage(
      page,
      "/practice/shadowing",
      "Listen, repeat, compare, and refine."
    );
    await expect(
      page.getByText("Reference phrase", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Record" })).toBeVisible();
  });

  test("roleplay typed turn works when signed in", async ({ page }) => {
    const errors = collectClientErrors(page);

    await page.goto(withVercelProtectionBypass("/practice/roleplay"));
    await expect(
      page.getByRole("heading", {
        name: "Practise UK workplace conversations turn by turn.",
      })
    ).toBeVisible();
    await page.getByRole("button", { name: "Start roleplay" }).click();
    await expect(page.getByText("Conversation transcript")).toBeVisible({
      timeout: 10_000,
    });

    await page
      .getByLabel("Text fallback")
      .fill(
        "Thank you for inviting me. I am interested in this role because it matches my communication and teamwork experience."
      );
    await page.getByRole("button", { name: "Send typed reply" }).click();
    await expect(
      page.getByText("AI coach is preparing the next prompt")
    ).toHaveCount(0, { timeout: 15_000 });
    await expect(page.getByText("Thank you for inviting me")).toBeVisible();

    await page
      .getByRole("button", { name: "End session and get feedback" })
      .click();
    await expect(page.getByText("Your practice summary")).toBeVisible({
      timeout: 15_000,
    });
    expect(errors).toEqual([]);
  });

  test("settings saves or reports staging schema issues safely", async ({
    page,
  }) => {
    const errors = collectClientErrors(page);

    await page.goto(withVercelProtectionBypass("/settings"));
    await expectNoAppError(page);
    await expect(
      page.getByRole("heading", { name: "Privacy and account control centre." })
    ).toBeVisible();

    await page.getByLabel("Retain recordings for").fill("45");
    await page.getByRole("checkbox", { name: "Email reminders" }).click();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(
      page.getByText(/Settings saved\.|Unable to save settings/)
    ).toBeVisible();

    await page.getByRole("button", { name: "Upgrade to Pro" }).click();
    await expect(
      page.getByText("Checkout is disabled for this MVP build.")
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
});
