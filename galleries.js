const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const gallery of document.querySelectorAll('.project-gallery')) {
  const track = gallery.querySelector('.screenshot-gallery');
  const controls = gallery.querySelector('.gallery-controls');
  const count = track.children.length;

  function showPage(index) {
    const page = Math.max(0, Math.min(index, count - 1));
    track.scrollTo({
      left: page * track.clientWidth,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  }

  const dots = Array.from({ length: count }, (_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Screenshot group ${index + 1} of ${count}`);
    dot.setAttribute('aria-controls', track.id);
    dot.addEventListener('click', () => showPage(index));
    return dot;
  });

  function currentPage() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  const arrows = [
    { direction: 'previous', label: 'Previous screenshot group', step: -1 },
    { direction: 'next', label: 'Next screenshot group', step: 1 },
  ].map(({ direction, label, step }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-arrow gallery-arrow--${direction}`;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-controls', track.id);
    button.addEventListener('click', () => showPage(currentPage() + step));
    return { button, step };
  });

  function updateNavigation() {
    const current = currentPage();
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === current));
    });
    for (const { button, step } of arrows) {
      const target = current + step;
      button.setAttribute('aria-disabled', String(target < 0 || target >= count));
    }
  }

  gallery.classList.add('has-gallery-arrows');
  gallery.append(...arrows.map(({ button }) => button));
  controls.append(...dots);
  controls.hidden = false;
  track.addEventListener('scroll', updateNavigation, { passive: true });
  track.addEventListener('keydown', event => {
    const movement = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!movement || event.target !== track) return;
    event.preventDefault();
    showPage(currentPage() + movement);
  });
  new ResizeObserver(updateNavigation).observe(track);
  updateNavigation();
}
