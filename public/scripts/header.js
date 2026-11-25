// Loaded as a classic script in <head>, so it runs before the first paint.
// It marks the page as scripted right away; the CSS of the header keys the
// collapsed burger menu off html[data-js]. A browser without JavaScript never
// sets the mark and keeps the working, wrapping list. The handlers need the
// header, which does not exist yet at this point, so they wait for the parser.
document.documentElement.dataset.js = '';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('.nav-toggle');
  if (!header || !toggle) return;

  toggle.hidden = false;

  const setOpen = (open) => {
    header.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.hasAttribute('data-open'));
  });

  // Escape closes it and hands the focus back to the button, otherwise the
  // focus would sit on a link nobody can see any more.
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.hasAttribute('data-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
});
