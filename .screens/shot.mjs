import { chromium } from 'playwright';

const shots = '.screens/';
const base = 'http://127.0.0.1:5188';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const waitFonts = async () => await page.evaluate(() => document.fonts.ready);
const full = () => page.evaluate(() => {
  // scroll main to capture full content height
  const main = document.querySelector('main');
  main.scrollTop = main.scrollHeight;
});

// 1. Home — expanded sidebar
await page.goto(base, { waitUntil: 'networkidle' });
await waitFonts();
await page.waitForTimeout(600);
await page.screenshot({ path: shots + '01-home-expanded.png', fullPage: true });

// 2. Home — collapsed sidebar (hover logo area to reveal toggle, then click)
await page.locator('aside').hover();
await page.waitForTimeout(300);
const toggle = page.locator('aside button[aria-label="Collapse sidebar"]');
await toggle.click();
await page.waitForTimeout(500);
await page.screenshot({ path: shots + '02-home-collapsed.png', fullPage: true });

// expand back
await page.locator('aside').hover();
await page.waitForTimeout(300);
await page.locator('aside button[aria-label="Expand sidebar"]').click();
await page.waitForTimeout(400);

// 3. Account switcher dropdown (expanded mode)
await page.locator('aside button[title="Main Checking"], aside button:has-text("Alex Morgan")').last().click();
await page.waitForTimeout(400);
await page.screenshot({ path: shots + '03-switcher-open.png', fullPage: true });

// close switcher
await page.mouse.click(720, 200);
await page.waitForTimeout(300);

// 4. Payments page
await page.locator('aside button:has-text("Payments")').click();
await page.waitForTimeout(500);
await page.screenshot({ path: shots + '04-payments.png', fullPage: true });

// 5. New Transaction modal (from Payments)
await page.locator('button:has-text("New Transaction")').first().click();
await page.waitForTimeout(500);
await page.screenshot({ path: shots + '05-new-tx-modal.png' });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// 6. Modal filled in
await page.locator('button:has-text("New Transaction")').first().click();
await page.waitForTimeout(400);
await page.locator('input[placeholder="0.00"]').fill('42.50');
await page.locator('input[placeholder="e.g. Coffee at Blue Bottle"]').fill('Coffee at Blue Bottle');
await page.waitForTimeout(200);
await page.screenshot({ path: shots + '06-new-tx-filled.png' });
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

// 7. Narrow viewport (mobile-ish)
await ctx.close();
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p2 = await ctx2.newPage();
await p2.goto(base, { waitUntil: 'networkidle' });
await p2.evaluate(() => document.fonts.ready);
await p2.waitForTimeout(600);
await p2.screenshot({ path: shots + '07-narrow-home.png', fullPage: true });

await browser.close();
console.log('done');
