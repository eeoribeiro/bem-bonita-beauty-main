import { useEffect, useRef } from "react";

type CarouselOptions = {
  /** Quando definido, avança exatamente um card por vez (ex.: 4 cards visíveis no mobile). */
  perView?: number;
};

export function useMobileAutoCarousel<T extends HTMLElement>(intervalMs = 2000, options: CarouselOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 639px)");
    const { perView } = options;
    let timer: number | undefined;

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    const tick = () => {
      if (!media.matches || element.scrollWidth <= element.clientWidth) return;
      // Não avança enquanto houver modal/lightbox aberto (scroll do body travado).
      if (document.body.style.overflow === "hidden") return;

      const maxScroll = element.scrollWidth - element.clientWidth;
      const firstChild = element.firstElementChild as HTMLElement | null;
      const gap = parseFloat(window.getComputedStyle(element).columnGap || "0") || 0;
      const step = firstChild && perView ? Math.round(firstChild.getBoundingClientRect().width + gap) : Math.max(1, Math.round(element.clientWidth * 0.86));
      // No fim do trilho, recomeça do início; senão avança um passo (limitado ao fim,
      // para o último conjunto de cards ficar totalmente visível antes de reiniciar).
      const nextScroll = element.scrollLeft >= maxScroll - 4 ? 0 : Math.min(element.scrollLeft + step, maxScroll);

      element.scrollTo({ left: nextScroll, behavior: "smooth" });
    };

    const start = () => {
      stop();
      if (media.matches) timer = window.setInterval(tick, intervalMs);
    };

    start();
    media.addEventListener("change", start);
    element.addEventListener("pointerdown", stop);
    element.addEventListener("pointerup", start);
    element.addEventListener("focusin", stop);
    element.addEventListener("focusout", start);

    return () => {
      stop();
      media.removeEventListener("change", start);
      element.removeEventListener("pointerdown", stop);
      element.removeEventListener("pointerup", start);
      element.removeEventListener("focusin", stop);
      element.removeEventListener("focusout", start);
    };
  }, [intervalMs, options.perView]);

  return ref;
}
