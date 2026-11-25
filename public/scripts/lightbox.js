(() => {
  const dialog = document.querySelector('.lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const stage = dialog.querySelector('.lightbox-stage');
  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('.lightbox-caption');
  const level = dialog.querySelector('.lightbox-level');
  const status = dialog.querySelector('[data-zoom-status]');
  const steps = [1, 1.5, 2, 3, 4];
  let step = 0;
  let opener = null;

  // The fitted width: the largest the picture can be while all of it shows.
  const fittedWidth = () => {
    const room = stage.getBoundingClientRect();
    const styles = getComputedStyle(stage);
    const width = room.width - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    const height = room.height - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    const ratio = image.naturalWidth / image.naturalHeight || 1;
    return Math.max(1, Math.min(width, height * ratio, image.naturalWidth || width));
  };

  const apply = (keepCentre) => {
    const before = keepCentre && {
      x: (stage.scrollLeft + stage.clientWidth / 2) / stage.scrollWidth,
      y: (stage.scrollTop + stage.clientHeight / 2) / stage.scrollHeight,
    };
    const zoom = steps[step];
    image.style.width = `${Math.round(fittedWidth() * zoom)}px`;
    dialog.toggleAttribute('data-zoomed', step > 0);
    level.textContent = `${Math.round(zoom * 100)} %`;
    dialog.querySelector('[data-zoom-step="-1"]').disabled = step === 0;
    dialog.querySelector('[data-zoom-step="1"]').disabled = step === steps.length - 1;
    if (before) {
      stage.scrollLeft = before.x * stage.scrollWidth - stage.clientWidth / 2;
      stage.scrollTop = before.y * stage.scrollHeight - stage.clientHeight / 2;
    }
  };

  const zoomTo = (next) => {
    step = Math.max(0, Math.min(steps.length - 1, next));
    apply(true);
    status.textContent = `Vergrößerung ${Math.round(steps[step] * 100)} Prozent`;
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-zoom]');
    // A click with a modifier key keeps its usual meaning: a new tab.
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();

    const shown = link.querySelector('img');
    const figure = link.closest('figure');
    opener = link;
    step = 0;
    image.alt = shown ? shown.alt : '';
    image.style.width = '';
    // The caption holds the badge and the text as separate spans; joined
    // without a gap they would read as one word.
    const parts = figure?.querySelectorAll('figcaption > *') ?? [];
    caption.textContent = Array.from(parts, (part) => part.textContent.trim()).join(': ');
    image.onload = () => apply(false);
    image.src = link.href;
    dialog.showModal();
    if (image.complete) apply(false);
  });

  dialog.querySelectorAll('[data-zoom-step]').forEach((button) => {
    button.addEventListener('click', () => zoomTo(step + Number(button.dataset.zoomStep)));
  });
  level.addEventListener('click', () => zoomTo(0));
  image.addEventListener('click', () => zoomTo(step === 0 ? 2 : 0));

  dialog.addEventListener('keydown', (event) => {
    if (event.key === '+' || event.key === '=') zoomTo(step + 1);
    else if (event.key === '-') zoomTo(step - 1);
    else if (event.key === '0') zoomTo(0);
    else return;
    event.preventDefault();
  });

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());

  // A click on the dark area around the picture closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === stage) dialog.close();
  });

  // A turned phone or a resized window fits the picture again at its step.
  window.addEventListener('resize', () => {
    if (dialog.open) apply(false);
  });

  // Escape closes the dialog natively. Either way the focus goes back to the
  // picture that was opened, so a keyboard user carries on where they were.
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    image.onload = null;
    opener?.focus();
    opener = null;
  });
})();
