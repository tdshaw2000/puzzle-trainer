// Browser check for the trainer screens at phone width. Needs Playwright with Chromium
// (not a project dependency) and a running server: `npm run build && npx vite preview`.
// Usage: node scripts/check-mobile.cjs [http://localhost:4173]
const { chromium } = require('playwright');

const base = process.argv[2] || 'http://localhost:4173';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  const failures = [];
  page.on('pageerror', (e) => failures.push(`page error: ${e.message}`));

  for (const trainer of ['5x5/l2c', '5x5/l3e', '5x5/l2e', '4x4/l2e']) {
    const hasSolution = trainer !== '5x5/l3e';
    await page.goto(`${base}/#/${trainer}`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    if (hasSolution) await page.click('button.show-solution');
    await page.click('text=Show case');
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
      failures.push(`${trainer}: horizontal scroll at 375px`);
    }
    const clipped = await page.$$eval('.actions button', (bs) =>
      bs.filter((b) => b.scrollWidth > b.clientWidth).map((b) => b.textContent),
    );
    if (clipped.length) failures.push(`${trainer}: button text overflows at 375px: ${clipped.join(', ')}`);
    await page.click('text=Hide case');
    if (!(await page.$eval('.case', (e) => e.hidden))) failures.push(`${trainer}: Hide case left the case shown`);
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
      failures.push(`${trainer}: horizontal scroll at 375px after hiding the case`);
    }

    for (const button of ['button.next', 'button.show', ...(hasSolution ? ['button.show-solution'] : [])]) {
      await page.goto(`${base}/#/${trainer}`);
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
      const hidden = (await page.$eval('.case', (e) => e.hidden)) && (!hasSolution || (await page.$eval('[id$="-solution"]', (e) => e.hidden)));
      if (changes !== 1) failures.push(`${trainer}: space on ${button} changed the scramble ${changes} times`);
      if (!hidden) failures.push(`${trainer}: space on ${button} left the case or solution shown`);
    }

    // Every skin, with the solution and case shown: nothing scrolls sideways, button labels fit,
    // and the gear menu doesn't sit on the heading.
    const skins = await page.evaluate(() => window.PuzzleSkins.SKINS.map(([id]) => id));
    for (const skin of skins) {
      await page.evaluate((id) => localStorage.setItem('puzzle-trainer-skin', id), skin);
      await page.goto(`${base}/#/${trainer}`);
      await page.reload({ waitUntil: 'networkidle' });
      if (hasSolution) await page.click('button.show-solution');
      await page.click('text=Show case');
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) {
        failures.push(`${trainer}: ${skin}: horizontal scroll at 375px`);
      }
      const tight = await page.$$eval('.actions button', (bs) =>
        bs.filter((b) => b.scrollWidth > b.clientWidth).map((b) => b.textContent),
      );
      if (tight.length) failures.push(`${trainer}: ${skin}: button text overflows at 375px: ${tight.join(', ')}`);
      const overlap = await page.evaluate(() => {
        const gear = document.querySelector('.skin-picker-toggle').getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(document.querySelector('h1'));
        return [...range.getClientRects()].some(
          (r) => r.left < gear.right && r.right > gear.left && r.top < gear.bottom && r.bottom > gear.top,
        );
      });
      if (overlap) failures.push(`${trainer}: ${skin}: the skin menu's gear overlaps the heading`);
    }

  }

  // The site title, on every kind of page in every skin: shown, a link home, clear of the gear,
  // and no sideways scroll.
  const skins = await page.evaluate(() => window.PuzzleSkins.SKINS.map(([id]) => id));
  for (const skin of skins) {
    for (const hash of ['#/', '#/5x5/l2c', '#/5x5/l2e', '#/4x4/l2e', '#/nowhere']) {
      await page.evaluate((id) => localStorage.setItem('puzzle-trainer-skin', id), skin);
      await page.goto(`${base}/${hash}`);
      await page.reload({ waitUntil: 'networkidle' });
      const where = `${hash}: ${skin}`;
      const result = await page.evaluate(() => {
        const title = document.querySelector('a.site-title');
        if (!title) return { missing: true };
        const box = title.getBoundingClientRect();
        const gear = document.querySelector('.skin-picker-toggle').getBoundingClientRect();
        return {
          text: title.textContent,
          href: title.getAttribute('href'),
          visible: box.width > 0 && box.height > 0 && box.left >= 0 && box.right <= window.innerWidth && box.top >= 0,
          overlap: box.left < gear.right && box.right > gear.left && box.top < gear.bottom && box.bottom > gear.top,
          scroll: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      if (result.missing) { failures.push(`${where}: no site title`); continue; }
      if (result.text !== 'Puzzle Trainer' || result.href !== '#/') failures.push(`${where}: site title is not a "Puzzle Trainer" link home`);
      if (!result.visible) failures.push(`${where}: site title not fully on screen at 375px`);
      if (result.overlap) failures.push(`${where}: the skin menu's gear overlaps the site title`);
      if (result.scroll) failures.push(`${where}: horizontal scroll at 375px`);
    }
  }

  await browser.close();
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log('Mobile check passed');
})();
