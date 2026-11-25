const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const gallery of document.querySelectorAll('.project-gallery')) {
  const track = gallery.querySelector('.screenshot-gallery');
  const controls = gallery.querySelector('.gallery-controls');
  const count = track.children.length;

  function showScreenshot(index) {
    const slide = Math.max(0, Math.min(index, count - 1));
    track.scrollTo({
      left: slide * track.clientWidth,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  }

  const dots = Array.from({ length: count }, (_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Screenshot ${index + 1} of ${count}`);
    dot.setAttribute('aria-controls', track.id);
    dot.addEventListener('click', () => showScreenshot(index));
    return dot;
  });

  function currentScreenshot() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function updateDots() {
    const current = currentScreenshot();
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-current', String(index === current));
    });
  }

  controls.append(...dots);
  controls.hidden = false;
  track.addEventListener('scroll', updateDots, { passive: true });
  track.addEventListener('keydown', event => {
    const movement = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!movement || event.target !== track) return;
    event.preventDefault();
    showScreenshot(currentScreenshot() + movement);
  });
  new ResizeObserver(updateDots).observe(track);
  updateDots();
}
