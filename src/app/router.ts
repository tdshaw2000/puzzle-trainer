import { PUZZLES, type Puzzle, type Trainer } from './registry';

type Route = { kind: 'home' } | { kind: 'trainer'; puzzle: Puzzle; trainer: Trainer } | { kind: 'notFound' };

export function resolve(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts.length === 0) return { kind: 'home' };
  if (parts.length === 2) {
    const puzzle = PUZZLES.find((p) => p.id === parts[0]);
    const trainer = puzzle?.trainers.find((t) => t.id === parts[1]);
    if (puzzle && trainer) return { kind: 'trainer', puzzle, trainer };
  }
  return { kind: 'notFound' };
}

const cleanups = new WeakMap<HTMLElement, () => void>();

function link(href: string, text: string) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text;
  return a;
}

function home(root: HTMLElement) {
  const h1 = document.createElement('h1');
  h1.textContent = 'Puzzle Trainer';
  root.append(h1);
  for (const puzzle of PUZZLES) {
    const section = document.createElement('section');
    section.className = 'puzzle';
    section.dataset.puzzle = puzzle.id;
    const h2 = document.createElement('h2');
    h2.textContent = puzzle.name;
    const list = document.createElement('ul');
    for (const t of puzzle.trainers) {
      const li = document.createElement('li');
      li.append(link(`#/${puzzle.id}/${t.id}`, t.name));
      list.append(li);
    }
    section.append(h2, list);
    root.append(section);
  }
}

/** Replaces `root`'s content with the screen for `hash`, cleaning up the previous one. */
export function renderRoute(root: HTMLElement, hash: string) {
  cleanups.get(root)?.();
  cleanups.delete(root);
  root.replaceChildren();

  const route = resolve(hash);
  document.title = route.kind === 'trainer' ? `${route.puzzle.name} ${route.trainer.name} · Puzzle Trainer` : 'Puzzle Trainer';
  if (route.kind === 'home') return home(root);
  if (route.kind === 'notFound') {
    const p = document.createElement('p');
    p.append('Not found. ', link('#/', 'Back to all trainers'));
    root.append(p);
    return;
  }

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb';
  const current = document.createElement('span');
  current.textContent = route.trainer.name;
  nav.append(link('#/', route.puzzle.name), ' › ', current);
  const body = document.createElement('div');
  body.dataset.trainer = route.trainer.id;
  root.append(nav, body);
  cleanups.set(root, route.trainer.mount(body));
}
