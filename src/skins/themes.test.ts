import { runSkinScript } from './load';
import styles from '../styles.css?raw';

// Every file under public/themes, by path, and each theme.css's text.
const files = Object.keys(import.meta.glob('../../public/themes/**/*')).map((p) => p.replace('../../public/', ''));
const sheets = import.meta.glob<string>('../../public/themes/*/theme.css', { query: '?raw', import: 'default', eager: true });
const sheet = (id: string) => sheets[`../../public/themes/${id}/theme.css`];

// Properties styles.css uses with no fallback, so every skin must set them.
const required = [...new Set([...styles.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]))];

describe('the skins', () => {
  const { SKINS } = runSkinScript();

  it('styles.css takes its colours and fonts from the skin', () => {
    expect(required).toEqual(expect.arrayContaining(['--page', '--ink', '--muted', '--card', '--line', '--accent', '--on-accent', '--font', '--radius']));
    expect(styles).not.toMatch(/prefers-color-scheme/);
    expect(styles).not.toMatch(/#[0-9a-f]{3,6}\b/i);
  });

  // Vite's stylesheet lands after the skin's in the head, so styles.css sits in a cascade layer:
  // a skin's own (unlayered) rules then win over it whatever the order.
  it("styles.css is layered, so a skin's rules override it", () => {
    expect(styles.trim()).toMatch(/^(\/\*[\s\S]*?\*\/\s*)?@layer base \{[\s\S]*\}$/);
  });

  it.each(SKINS)("%s doesn't layer its rules", (id) => {
    expect(sheet(id)).not.toMatch(/@layer/);
  });

  it.each(SKINS)('%s has a theme.css setting every property styles.css needs', (id) => {
    expect(sheet(id)).toBeDefined();
    for (const property of required) expect(sheet(id), property).toMatch(new RegExp(`${property}\\s*:`));
  });

  it.each(SKINS)("%s only points at files it ships", (id) => {
    for (const [, url] of sheet(id).matchAll(/url\("([^"]+)"\)/g)) {
      expect(files).toContain(`themes/${id}/${url}`);
    }
  });

  it.each(SKINS)('%s ships a licence beside every font', (id) => {
    const fonts = files.filter((f) => f.startsWith(`themes/${id}/fonts/`) && /\.woff2?$/.test(f));
    const licences = files.filter((f) => f.startsWith(`themes/${id}/fonts/LICENSE-`));
    expect(licences.length).toBe(fonts.length);
  });

  it.each(SKINS)('%s leaves the cube sticker colours alone', (id) => {
    expect(sheet(id)).not.toMatch(/\b(rect|svg)\b|fill\s*:/);
  });

  it('styles.css leaves the cube sticker colours alone', () => {
    expect(styles).not.toMatch(/\brect\b|fill\s*:/);
  });
});
