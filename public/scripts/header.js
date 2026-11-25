// Loaded as a classic script in <head>, so it runs before the first paint.
// It marks the page as scripted right away; the CSS of the header keys the
// collapsed burger menu off html[data-js]. A browser without JavaScript never
// sets the mark and keeps the working, wrapping list.
document.documentElement.dataset.js = '';

// The header does not exist yet at this point, so the handlers sit on the
// document and find it through the event. The button the CSS shows from the
// first paint therefore works from the first paint as well.
const setOpen = (header, toggle, open) => {
  header.toggleAttribute('data-open', open);
  toggle.setAttribute('aria-expanded', String(open));
};

document.addEventListener('click', (event) => {
  const toggle = event.target.closest?.('.nav-toggle');
  const header = toggle?.closest('.header');
  if (!header) return;
  setOpen(header, toggle, !header.hasAttribute('data-open'));
});

// Escape closes it and hands the focus back to the button, otherwise the
// focus would sit on a link nobody can see any more.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const header = event.target.closest?.('.header');
  const toggle = header?.querySelector('.nav-toggle');
  if (!toggle || !header.hasAttribute('data-open')) return;
  setOpen(header, toggle, false);
  toggle.focus();
});

// The button ships with [hidden] for a browser without JavaScript. The CSS
// already shows it; lifting the attribute keeps the markup honest.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.header .nav-toggle')?.removeAttribute('hidden');
});
