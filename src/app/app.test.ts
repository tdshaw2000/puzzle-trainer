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
    expect(PUZZLES.map((p) => p.name)).toEqual(['5x5']);
    const group = root.querySelector('[data-puzzle="5x5"]')!;
    expect(group.querySelector('h2')!.textContent).toBe('5x5');
    const link = group.querySelector('a')!;
    expect(link.textContent).toBe('Last Two Centres');
    expect(link.getAttribute('href')).toBe('#/5x5/l2c');
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
