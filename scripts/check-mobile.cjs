// Browser check for the L2C screen at phone width. Needs Playwright with Chromium
// (not a project dependency) and a running server: `npm run build && npx vite preview`.
// Usage: node scripts/check-mobile.cjs [http://localhost:4173]
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:4173';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  const failures = [];
  page.on('pageerror', (e) => failures.push(`page error: ${e.message}`));

  await page.goto(`${base}/#/5x5/l2c`);
  await page.click('button.show-solution');
  await page.click('text=Show case');
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
    failures.push('horizontal scroll at 375px');
  }
  const clipped = await page.$$eval('.actions button', (bs) =>
    bs.filter((b) => b.scrollWidth > b.clientWidth).map((b) => b.textContent),
  );
  if (clipped.length) failures.push(`button text overflows at 375px: ${clipped.join(', ')}`);

  for (const button of ['button.next', 'button.show', 'button.show-solution']) {
    await page.reload();
    await page.evaluate(() => {
      window.changes = 0;
      new MutationObserver(() => window.changes++).observe(document.querySelector('.scramble'), {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
    await page.focus(button);
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    const changes = await page.evaluate(() => window.changes);
    const hidden = await page.$eval('.case', (e) => e.hidden) && (await page.$eval('.solution', (e) => e.hidden));
    if (changes !== 1) failures.push(`space on ${button} changed the scramble ${changes} times`);
    if (!hidden) failures.push(`space on ${button} left the case or solution shown`);
  }

  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log('Mobile check passed');
})();
