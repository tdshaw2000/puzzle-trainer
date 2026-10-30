// Skins: the same set as Scramble Challenge and Timer App PR Tracker. A skin is a folder under
// themes/ holding theme.css. This is a classic script in the head so the chosen skin is in place
// before the first paint; the logic sits on globalThis.PuzzleSkins so the tests can reach it.
(function () {
  "use strict";

  const SKINS = [
    ["plain", "Minimal"],
    ["dark", "Dark"],
    ["dos", "DOS"],
    ["mario64", "Mario"],
    ["monkeyisland2", "Monkey"],
    ["neon80s", "VHS"],
  ];
  const DEFAULT_SKIN = "plain";
  const STORAGE_KEY = "puzzle-trainer-skin";

  function chooseSkin(value) {
    return SKINS.some(([id]) => id === value) ? value : DEFAULT_SKIN;
  }

  function readSkin(storage) {
    try {
      return chooseSkin(storage.getItem(STORAGE_KEY));
    } catch {
      return DEFAULT_SKIN;
    }
  }

  function saveSkin(storage, id) {
    try {
      storage.setItem(STORAGE_KEY, id);
    } catch {
      // Private mode or blocked storage: the skin still changes, it just isn't remembered.
    }
  }

  // Relative, like the rest of the build, so the site works from any folder.
  function themeHref(id) {
    return `themes/${id}/theme.css`;
  }

  globalThis.PuzzleSkins = { SKINS, DEFAULT_SKIN, chooseSkin, readSkin, saveSkin, themeHref };
  if (typeof document === "undefined") return;

  let storage;
  try {
    storage = globalThis.localStorage;
  } catch {
    storage = undefined;
  }
  let current = readSkin(storage);

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.id = "skin-css";
  stylesheet.href = themeHref(current);
  document.head.append(stylesheet);

  function buildMenu() {
    const picker = document.querySelector(".skin-picker");
    if (!picker) return;
    const menu = picker.querySelector(".skin-menu");
    for (const [id, label] of SKINS) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "skin-option";
      option.textContent = label;
      option.dataset.skin = id;
      menu.append(option);
    }
    const mark = () => {
      for (const option of menu.querySelectorAll(".skin-option")) {
        if (option.dataset.skin === current) option.setAttribute("aria-current", "true");
        else option.removeAttribute("aria-current");
      }
    };
    mark();
    menu.addEventListener("click", (event) => {
      const option = event.target.closest(".skin-option");
      if (!option) return;
      current = chooseSkin(option.dataset.skin);
      saveSkin(storage, current);
      stylesheet.href = themeHref(current);
      mark();
      picker.open = false;
    });
    // A tap anywhere outside the open menu closes it.
    document.addEventListener("click", (event) => {
      if (picker.open && !picker.contains(event.target)) picker.open = false;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildMenu);
  else buildMenu();
})();
