import { cubeModel } from '../../cube/cube';
import { FACE_COLOUR, RING_COLOUR } from '../../cube/colours';
import { unpairedEdges } from '../../cube/edges';
import type { Vec } from '../../cube/geometry';
import { parseAlg } from '../../cube/notation';
import { seeded } from '../../lib/random';
import { MIDDLE_SLOTS } from './generate';
import { mountL3E } from './screen';

const c5 = cubeModel(5);
const vec = (s: string) => s.split(',').map(Number) as unknown as Vec;

function mount(seed = 7) {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = mountL3E(root, seeded(seed));
  const scramble = () => root.querySelector('.scramble')!.textContent!;
  const caseSection = () => root.querySelector<HTMLElement>('.case')!;
  const button = (name: string) =>
    [...root.querySelectorAll('button')].find((b) => b.textContent === name) as HTMLButtonElement;
  return { root, cleanup, scramble, caseSection, button };
}

afterEach(() => (document.body.innerHTML = ''));

describe('L3E trainer screen', () => {
  it('shows a scramble and the holding reminder, with the case hidden and no solution control', () => {
    const { root, scramble, caseSection, button } = mount();
    expect(scramble()).toMatch(/^[UDFBRLw2' ]+$/);
    expect(root.querySelector('h1')!.textContent).toBe('Last Three Edges');
    expect(root.textContent).toContain('yellow on top, green in front');
    expect(caseSection().hidden).toBe(true);
    expect(button('Show case').getAttribute('aria-expanded')).toBe('false');
    expect(button('Show case').getAttribute('aria-controls')).toBe(caseSection().id);
    expect([...root.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Show case', 'Next']);
  });

  it('toggles the case, showing the same case again until Next', () => {
    const { button, caseSection } = mount();
    button('Show case').click();
    expect(caseSection().hidden).toBe(false);
    expect(caseSection().textContent).toMatch(/Unpaired: (FR|FL|BR|BL), (FR|FL|BR|BL), (FR|FL|BR|BL)/);
    expect(caseSection().querySelector('svg.scrambled')).not.toBeNull();
    const shown = caseSection().innerHTML;
    expect(button('Hide case').getAttribute('aria-expanded')).toBe('true');
    button('Hide case').click();
    expect(caseSection().hidden).toBe(true);
    expect(document.activeElement).toBe(button('Show case'));
    button('Show case').click();
    expect(caseSection().innerHTML).toBe(shown);
    button('Next').click();
    expect(caseSection().hidden).toBe(true);
    expect(button('Show case')).toBeDefined();
  });

  it('names the unpaired slots and colours only their pieces, as the scramble leaves them', () => {
    for (let seed = 0; seed < 10; seed++) {
      const { root, scramble, button, caseSection, cleanup } = mount(seed);
      button('Show case').click();
      const cube = c5.applyAlg(c5.solved(), parseAlg(scramble(), 5));
      const slots = MIDDLE_SLOTS.filter((e) => unpairedEdges(cube, 5).includes(e));
      expect(caseSection().textContent).toContain(`Unpaired: ${slots.join(', ')}`);
      const lit = [...root.querySelectorAll<SVGRectElement>('.case svg.scrambled rect')].filter(
        (r) => r.getAttribute('fill') !== RING_COLOUR,
      );
      const label = root.querySelector('.case svg.scrambled')!.getAttribute('aria-label')!;
      for (const slot of slots) expect(label).toMatch(new RegExp(`${slot}: lower wing \\w+/\\w+, midge \\w+/\\w+, upper wing \\w+/\\w+`));
      // 3 edges x 3 pieces x 2 stickers
      expect(lit).toHaveLength(18);
      for (const r of lit) {
        expect(r.getAttribute('fill')).toBe(FACE_COLOUR[c5.stickerAt(cube, vec(r.dataset.pos!), vec(r.dataset.normal!))].hex);
      }
      cleanup();
      document.body.innerHTML = '';
    }
  });

  it('Next and a single space press each give one new scramble and hide the case', () => {
    const { scramble, button, caseSection } = mount();
    const first = scramble();
    button('Show case').click();
    button('Next').click();
    const second = scramble();
    expect(second).not.toBe(first);
    expect(caseSection().hidden).toBe(true);

    button('Show case').click();
    const ev = new KeyboardEvent('keydown', { key: ' ', cancelable: true, bubbles: true });
    button('Next').focus();
    button('Next').dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    const up = new KeyboardEvent('keyup', { key: ' ', cancelable: true, bubbles: true });
    button('Next').dispatchEvent(up);
    expect(up.defaultPrevented).toBe(true);
    expect(scramble()).not.toBe(second);
    expect(caseSection().hidden).toBe(true);
    expect(button('Show case').getAttribute('aria-expanded')).toBe('false');
  });

  it('ignores space held down, and space inside the skin menu', () => {
    const { root, scramble } = mount();
    const before = scramble();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: true }));
    expect(scramble()).toBe(before);
    const picker = document.createElement('details');
    picker.className = 'skin-picker';
    root.append(picker);
    picker.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(scramble()).toBe(before);
  });

  it('stops listening for space after cleanup', () => {
    const { scramble, cleanup } = mount();
    const before = scramble();
    cleanup();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(scramble()).toBe(before);
  });
});
