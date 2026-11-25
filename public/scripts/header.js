(() => {
  const header = document.querySelector('.header');
  const toggle = header?.querySelector('.nav-toggle');
  if (!header || !toggle) return;

  header.dataset.js = '';
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
})();
