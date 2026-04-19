import { test, expect } from "@playwright/test";

const landingPageUrl = "http://localhost:1337/";

test("it has a title", async ({ page }) => {
  await page.goto(landingPageUrl);

  await expect(page).toHaveTitle(
    /Ohdit - Outil collaboratif pour faciliter vos audits d'accessibilité \(RGAA et RAAM\)/,
  );
});

test("it has the proper headings", async ({ page }) => {
  await page.goto(landingPageUrl);

  const mainHeading = page.locator("h1");
  await expect(mainHeading).toHaveText(
    "L'audit d'accessibilité numérique, facilement.",
  );

  const subHeadings = page.locator("h2");
  await expect(subHeadings.nth(0)).toHaveText("Les fonctionnalités d'Ohdit");
  await expect(subHeadings.nth(1)).toHaveText("Pourquoi Ohdit ?");
  await expect(subHeadings.nth(2)).toHaveText("Restez informé·e·s !");
});
