const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const gallery of document.querySelectorAll('.project-gallery')) {
  const track = gallery.querySelector('.screenshot-gallery');
  const controls = gallery.querySelector('.gallery-controls');
  const previous = controls.querySelector('[data-step="-1"]');
  const next = controls.querySelector('[data-step="1"]');

  function updateControls() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    controls.hidden = maxScroll <= 1;
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft >= maxScroll - 1;
  }

  for (const button of [previous, next]) {
    button.addEventListener('click', () => {
      const slideWidth = track.firstElementChild.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap);
      track.scrollBy({
        left: Number(button.dataset.step) * (slideWidth + gap),
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    });
  }

  track.addEventListener('scroll', updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(track);
  updateControls();
}
