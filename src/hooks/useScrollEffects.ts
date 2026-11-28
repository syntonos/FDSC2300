import { useEffect } from 'react';

/** Animate physical collage layers on scroll; never move them for reduced motion. */
export function useScrollEffects(route: string) {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const images = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    const collage = document.querySelector<HTMLElement>('[data-about-collage]');
    const layers = [...(collage?.querySelectorAll<HTMLElement>('[data-parallax-layer]') ?? [])];
    const cards = [...document.querySelectorAll<HTMLElement>('[data-dish-parallax] .dish-card')];
    let frame = 0;
    const update = () => {
      frame = 0;
      if (motion.matches) {
        [...images, ...layers].forEach(element => element.style.removeProperty('transform'));
        cards.forEach(card => card.style.removeProperty('--dish-drift'));
        return;
      }
      for (const image of images) {
        const rect = image.parentElement!.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) {
          const limit = Math.min(65, rect.height * .05);
          const offset = (innerHeight / 2 - rect.top - rect.height / 2) * .1;
          image.style.transform = `translate3d(0, ${Math.max(-limit, Math.min(limit, offset))}px, 0) scale(1.12)`;
        }
      }
      if (collage) {
        const rect = collage.getBoundingClientRect();
        const progress = 1 - 2 * (rect.top + rect.height) / (innerHeight + rect.height);
        const travel = Math.max(-1, Math.min(1, progress)) * (innerWidth <= 760 ? .7 : 1);
        for (const layer of layers) {
          const offset = travel * Number(layer.dataset.parallaxLayer);
          layer.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        }
      }
      const speeds = [-.075, .055, -.1];
      cards.forEach((card, index) => {
        const grid = card.closest<HTMLElement>('[data-dish-parallax]')!;
        const rect = grid.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < innerHeight) {
          const limit = innerWidth <= 760 ? 14 : 44;
          const offset = (innerHeight / 2 - rect.top - rect.height / 2) * speeds[index % speeds.length];
          card.style.setProperty('--dish-drift', `${Math.max(-limit, Math.min(limit, offset))}px`);
        }
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    let active = true;
    document.fonts?.ready.then(() => { if (active) schedule(); });
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, [route]);
}
