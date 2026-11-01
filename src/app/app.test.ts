import { renderRoute } from './router';
import { PUZZLES } from './registry';

function show(hash: string) {
  const root = document.createElement('div');
  renderRoute(root, hash);
  return root;
}

describe('trainer navigation', () => {
  it('home page lists puzzles with their trainers', () => {
    const root = show('');
    expect(PUZZLES.map((p) => p.name)).toEqual(['5x5', '4x4']);
    expect([...root.querySelectorAll('section.puzzle h2')].map((h) => h.textContent)).toEqual(['5x5', '4x4']);
    const four = [...root.querySelectorAll('[data-puzzle="4x4"] a')];
    expect(four.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([['Last Two Edges', '#/4x4/l2e']]);
    const group = root.querySelector('[data-puzzle="5x5"]')!;
    expect(group.querySelector('h2')!.textContent).toBe('5x5');
    const links = [...group.querySelectorAll('a')];
    expect(links.map((a) => a.textContent)).toEqual(['Last Two Centres', 'Last Two Edges']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#/5x5/l2c', '#/5x5/l2e']);
  });

  it('opens Last Two Edges from its address, with its breadcrumb and title', () => {
    const root = show('#/5x5/l2e');
    expect(root.querySelector('[data-trainer="l2e"] .scramble')).not.toBeNull();
    expect(root.querySelector('nav.breadcrumb')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('5x5 › Last Two Edges');
    expect(document.title).toBe('5x5 Last Two Edges · Puzzle Trainer');
  });

  it('opens 4x4 Last Two Edges from its address, with its breadcrumb and title', () => {
    const root = show('#/4x4/l2e');
    expect(root.querySelector('[data-trainer="l2e"] .l2e-4x4 .scramble')).not.toBeNull();
    expect(root.querySelector('nav.breadcrumb')!.textContent!.replace(/\s+/g, ' ').trim()).toBe('4x4 › Last Two Edges');
    expect(document.title).toBe('4x4 Last Two Edges · Puzzle Trainer');
  });

  it('sets the page title and heading per screen', () => {
    const root = show('#/5x5/l2c');
    expect(document.title).toBe('5x5 Last Two Centres · Puzzle Trainer');
    expect(root.querySelector('h1')!.textContent).toBe('Last Two Centres');
    show('#/');
    expect(document.title).toBe('Puzzle Trainer');
  });

  it('following the home page link opens the trainer', () => {
    const root = show('');
    const href = root.querySelector<HTMLAnchorElement>('[data-puzzle="5x5"] a')!.getAttribute('href')!;
    renderRoute(root, href);
    expect(root.querySelector('[data-trainer="l2c"] .scramble')).not.toBeNull();
  });

  it('#/ is also the home page', () => {
    expect(show('#/').querySelector('[data-puzzle="5x5"]')).not.toBeNull();
  });

  it('opens the trainer directly from its address, with a breadcrumb back home', () => {
    const root = show('#/5x5/l2c');
    expect(root.querySelector('[data-trainer="l2c"]')).not.toBeNull();
    const crumb = root.querySelector('nav.breadcrumb')!;
    expect(crumb.textContent!.replace(/\s+/g, ' ').trim()).toBe('5x5 › Last Two Centres');
    expect(crumb.querySelector('a')!.textContent).toBe('5x5');
    expect(crumb.querySelector('a')!.getAttribute('href')).toBe('#/');
  });

  it.each(['#/3x3/l2c', '#/5x5/nope', '#/whatever'])('shows not found for %s', (hash) => {
    const root = show(hash);
    expect(root.textContent).toContain('Not found');
    expect(root.querySelector('a[href="#/"]')).not.toBeNull();
  });

  it('cleans up the previous screen when the route changes', () => {
    const root = document.createElement('div');
    renderRoute(root, '#/5x5/l2c');
    renderRoute(root, '#/');
    const before = root.innerHTML;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(root.innerHTML).toBe(before);
  });
});
