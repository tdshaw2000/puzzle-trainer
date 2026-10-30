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
  await page.click('text=Hide case');
  if (!(await page.$eval('.case', (e) => e.hidden))) failures.push('Hide case left the case shown');
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
    failures.push('horizontal scroll at 375px after hiding the case');
  }

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
    if (button === 'button.show-solution') await page.click(button);
    await page.focus(button);
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    const changes = await page.evaluate(() => window.changes);
    const hidden = await page.$eval('.case', (e) => e.hidden) && (await page.$eval('.solution', (e) => e.hidden));
    if (changes !== 1) failures.push(`space on ${button} changed the scramble ${changes} times`);
    if (!hidden) failures.push(`space on ${button} left the case or solution shown`);
  }

  // Every skin, with the solution and case shown: nothing scrolls sideways, button labels fit,
  // and the gear menu doesn't sit on the heading.
  const skins = await page.evaluate(() => window.PuzzleSkins.SKINS.map(([id]) => id));
  for (const skin of skins) {
    await page.evaluate((id) => localStorage.setItem('puzzle-trainer-skin', id), skin);
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('button.show-solution');
    await page.click('text=Show case');
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
      failures.push(`${skin}: horizontal scroll at 375px`);
    }
    const tight = await page.$$eval('.actions button', (bs) =>
      bs.filter((b) => b.scrollWidth > b.clientWidth).map((b) => b.textContent),
    );
    if (tight.length) failures.push(`${skin}: button text overflows at 375px: ${tight.join(', ')}`);
    const overlap = await page.evaluate(() => {
      const gear = document.querySelector('.skin-picker-toggle').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('h1'));
      return [...range.getClientRects()].some(
        (r) => r.left < gear.right && r.right > gear.left && r.top < gear.bottom && r.bottom > gear.top,
      );
    });
    if (overlap) failures.push(`${skin}: the skin menu's gear overlaps the heading`);
  }

  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log('Mobile check passed');
})();
