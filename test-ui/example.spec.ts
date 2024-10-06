import { expect, Page } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test("facs-from-index", async ({ page }) => {
  await page.goto("/");

  await page.click("#site-a");

  await page.waitForURL("site_a.html", { timeout: 4000 });
});

test("fibs-from-index", async ({ page }) => {
  await page.goto("/");

  await page.click("#site-b");

  await page.waitForURL("site_b.html", { timeout: 4000 });
});

test("navbar-home", async ({ page }) => {
  await page.goto("/");

  await page.click(".uk-navbar-container .menu-home");

  const path = new URL(page.url()).pathname;
  expect(path).toBe("/");
});

test("navbar-a", async ({ page }) => {
  await page.goto("/");

  await page.click(".uk-navbar-container .menu-site-a");

  const path = new URL(page.url()).pathname;
  expect(path).toBe("/site_a.html");
});

test("navbar-b", async ({ page }) => {
  await page.goto("/");

  await page.click(".uk-navbar-container .menu-site-b");

  const path = new URL(page.url()).pathname;
  expect(path).toBe("/site_b.html");
});

// ~~~ tests of a website i visit often c: ~~~

const yeet_cookies = async (page: Page) => {
  const consentButton = page.locator('button[aria-label="Souhlas"]');

  if (await consentButton.isVisible()) {
    await consentButton.click();
  }
};

test("good-games-available", async ({ page }) => {
  await page.goto("https://www.superhry.cz");
  await yeet_cookies(page);

  await page.click('div.hp_categories_box a:has-text("Flash hry archiv")');

  const path = new URL(page.url()).pathname;
  expect(path).toBe("/flash-archiv/");
});

test("awesome-game-has-awesome-title", async ({ page }) => {
  await page.goto("https://www.superhry.cz");
  await yeet_cookies(page);

  const game_anchor = page.locator('a[href="/hra/2986-ohen-a-voda"]');
  const title = await game_anchor.getAttribute("title");

  expect(title).toBe(
    "Oheň a voda - pomozte ohnivému chlapíkovi a vodní \ndívce vyzrát na všechny nástrahy herního světa. (1.8MB) ",
  );
});

test("support-possible", async ({ page }) => {
  await page.goto("https://www.superhry.cz");
  await yeet_cookies(page);

  const adsElementsCount = await page.locator(".adsbygoogle").count();

  expect(adsElementsCount).toBeGreaterThan(0);
});

test("help-available", async ({ page }) => {
  await page.goto("https://www.superhry.cz");
  await yeet_cookies(page);

  await page.locator('a:has-text("Nápověda, Podmínky použití")').click();

  const path = new URL(page.url()).pathname;
  expect(path).toBe("/napoveda-podminky-pouziti");

  const helpTitle = await page.locator("h1").innerText();

  expect(helpTitle).toBe("Nápověda - Superhry.cz");
});
