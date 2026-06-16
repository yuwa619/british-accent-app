import { expect, test } from "@playwright/test";

import {
  collectClientErrors,
  expectHealthyPage,
  isExternalPreview,
} from "./helpers";
import { withVercelProtectionBypass } from "./vercel-bypass";

test.describe("local mock app flow coverage", () => {
  test.skip(
    isExternalPreview,
    "Preview/staging uses real environment state; run authenticated preview flows with E2E_TEST_EMAIL and E2E_TEST_PASSWORD."
  );

  test("dashboard, onboarding, and progress render in mock mode", async ({
    page,
  }) => {
    await expectHealthyPage(
      page,
      "/onboarding",
      "Shape your practice around real UK conversations."
    );
    await expect(page.getByLabel("Native language")).toBeVisible();
    await expect(page.getByText("Target situations")).toBeVisible();

    await expectHealthyPage(page, "/dashboard", "Welcome, there.");
    await expect(page.getByText("Today's practice")).toBeVisible();
    await expect(page.getByText("Progress snapshot")).toBeVisible();

    await expectHealthyPage(
      page,
      "/progress",
      "Track clarity and confidence over time."
    );
    await expect(page.getByText("Practice history")).toBeVisible();
  });

  test("lesson, diagnostic, feedback, and shadowing expose practice controls", async ({
    page,
  }) => {
    await expectHealthyPage(
      page,
      "/lessons",
      "Practise the sounds and rhythm that carry UK workplace speech."
    );
    await expect(
      page.getByText("Clear British vowels for professional speech")
    ).toBeVisible();

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
    await expect(
      page.getByRole("button", { name: "Use mock analysed clips" })
    ).toBeVisible();
    await expect(page.getByText("Step 1: Reading passage")).toBeVisible();

    await page.getByRole("button", { name: "Use mock analysed clips" }).click();
    await page
      .getByRole("button", { name: "Generate my baseline report" })
      .click();
    await expect(page.getByText("Your baseline")).toBeVisible();

    await expectHealthyPage(
      page,
      "/practice/shadowing",
      "Listen, repeat, compare, and refine."
    );
    await expect(
      page.getByText("Reference phrase", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Record" })).toBeVisible();

    await expectHealthyPage(
      page,
      "/feedback/mock-recording-id",
      "Speech feedback"
    );
    await expect(page.getByText("Overall clarity")).toBeVisible();
    await expect(page.getByText("Guidance, not judgement")).toBeVisible();
  });

  test("roleplay mock session supports typed turn and end summary", async ({
    page,
  }) => {
    const errors = collectClientErrors(page);

    await page.goto(withVercelProtectionBypass("/practice/roleplay"));
    await expect(
      page.getByRole("heading", {
        name: "Practise UK workplace conversations turn by turn.",
      })
    ).toBeVisible();
    await page.getByRole("button", { name: "Start roleplay" }).click();
    await expect(page.getByText("Conversation transcript")).toBeVisible();

    await page
      .getByLabel("Text fallback")
      .fill(
        "Thank you for inviting me. I am interested in this role because it matches my communication and teamwork experience."
      );
    await page.getByRole("button", { name: "Send typed reply" }).click();
    await expect(
      page.getByText("AI coach is preparing the next prompt")
    ).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText("Thank you for inviting me")).toBeVisible();

    await page
      .getByRole("button", { name: "End session and get feedback" })
      .click();
    await expect(page.getByText("Your practice summary")).toBeVisible({
      timeout: 10_000,
    });
    expect(errors).toEqual([]);
  });

  test("settings privacy controls and disabled checkout work in mock mode", async ({
    page,
  }) => {
    const errors = collectClientErrors(page);

    await page.goto(withVercelProtectionBypass("/settings"));
    await expect(
      page.getByRole("heading", { name: "Privacy and account control centre." })
    ).toBeVisible();
    await page.getByLabel("Retain recordings for").fill("45");
    await page.getByRole("checkbox", { name: "Email reminders" }).click();
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(
      page.getByText("Mock settings saved for this session.")
    ).toBeVisible();

    await page
      .getByRole("checkbox", { name: "Confirm bulk recording deletion" })
      .click();
    await page.getByRole("button", { name: "Delete all recordings" }).click();
    await expect(
      page.getByText("Mock recordings cleared for this session.")
    ).toBeVisible();

    await page
      .getByLabel("Optional notes")
      .fill("Please remove my beta test data before launch.");
    await page.getByRole("button", { name: "Request data deletion" }).click();
    await expect(
      page.getByText("Mock deletion request created for this session.")
    ).toBeVisible();

    await page.getByRole("button", { name: "Upgrade to Pro" }).click();
    await expect(
      page.getByText("Checkout is disabled for this MVP build.")
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
});
