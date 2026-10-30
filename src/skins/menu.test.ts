import page from '../../index.html?raw';
import { renderRoute } from '../app/router';
import { runSkinScript } from './load';

// The page's own markup, so the tests use the real picker and #app.
function loadPage() {
  const doc = new DOMParser().parseFromString(page, 'text/html');
  document.head.replaceChildren();
  document.body.replaceChildren(...[...doc.body.children].filter((e) => e.tagName !== 'SCRIPT'));
  runSkinScript();
  return {
    picker: document.querySelector<HTMLDetailsElement>('.skin-picker')!,
    stylesheet: document.getElementById('skin-css') as HTMLLinkElement,
    options: () => [...document.querySelectorAll<HTMLButtonElement>('.skin-option')],
    current: () => [...document.querySelectorAll('.skin-option[aria-current="true"]')].map((o) => o.textContent),
  };
}

beforeEach(() => localStorage.clear());

describe('the page head', () => {
  it('loads skin.js as a classic script before anything else is drawn', () => {
    const doc = new DOMParser().parseFromString(page, 'text/html');
    const script = doc.head.querySelector<HTMLScriptElement>('script[src="skin.js"]');
    expect(script).not.toBeNull();
    for (const attribute of ['type', 'defer', 'async']) expect(script!.hasAttribute(attribute)).toBe(false);
  });

  it('falls back to Minimal without JavaScript', () => {
    const doc = new DOMParser().parseFromString(page, 'text/html');
    expect(doc.head.querySelector('noscript')!.innerHTML).toContain('themes/plain/theme.css');
  });
});

describe('the skin picker', () => {
  it('sits outside #app, so it stays on every screen', () => {
    const { picker } = loadPage();
    expect(picker.closest('#app')).toBeNull();
    expect(picker.querySelector('summary')!.getAttribute('aria-label')).toBe('Change skin');
    expect(picker.querySelector('.skin-menu-title')!.textContent).toBe('Skin');
  });

  it('applies Minimal on a first visit', () => {
    const { stylesheet, current } = loadPage();
    expect(stylesheet.getAttribute('href')).toBe('themes/plain/theme.css');
    expect(current()).toEqual(['Minimal']);
  });

  it('applies the remembered skin', () => {
    localStorage.setItem('puzzle-trainer-skin', 'dos');
    const { stylesheet, current } = loadPage();
    expect(stylesheet.getAttribute('href')).toBe('themes/dos/theme.css');
    expect(current()).toEqual(['DOS']);
  });

  it('lists the six skins in menu order', () => {
    const { options } = loadPage();
    expect(options().map((o) => o.textContent)).toEqual(['Minimal', 'Dark', 'DOS', 'Mario', 'Monkey', 'VHS']);
  });

  it('picking a skin applies it, remembers it, marks it and closes the menu', () => {
    const { picker, stylesheet, options, current } = loadPage();
    picker.open = true;
    options().find((o) => o.textContent === 'VHS')!.click();
    expect(stylesheet.getAttribute('href')).toBe('themes/neon80s/theme.css');
    expect(localStorage.getItem('puzzle-trainer-skin')).toBe('neon80s');
    expect(current()).toEqual(['VHS']);
    expect(picker.open).toBe(false);
  });

  it('a click outside the open menu closes it without changing the skin', () => {
    const { picker, stylesheet } = loadPage();
    picker.open = true;
    document.getElementById('app')!.click();
    expect(picker.open).toBe(false);
    expect(stylesheet.getAttribute('href')).toBe('themes/plain/theme.css');
  });

  it("picking a skin leaves the trainer's scramble and case as they were", () => {
    const { options } = loadPage();
    const app = document.getElementById('app')!;
    renderRoute(app, '#/5x5/l2c');
    const toggle = [...app.querySelectorAll('button')].find((b) => b.textContent === 'Show case')!;
    toggle.click();
    const scramble = app.querySelector('.scramble')!.textContent;
    const caseHtml = app.querySelector('.case')!.innerHTML;
    options().find((o) => o.textContent === 'Mario')!.click();
    expect(app.querySelector('.scramble')!.textContent).toBe(scramble);
    expect(app.querySelector('.case')!.innerHTML).toBe(caseHtml);
    expect(app.querySelector<HTMLElement>('.case')!.hidden).toBe(false);
  });
});
