import { useEffect, useRef } from "react";

export function useMobileAutoCarousel<T extends HTMLElement>(intervalMs = 2000) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 639px)");
    let timer: number | undefined;

    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    const tick = () => {
      if (!media.matches || element.scrollWidth <= element.clientWidth) return;

      const maxScroll = element.scrollWidth - element.clientWidth;
      const step = Math.max(1, Math.round(element.clientWidth * 0.86));
      const nextScroll = element.scrollLeft + step >= maxScroll - 4 ? 0 : element.scrollLeft + step;

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
  }, [intervalMs]);

  return ref;
}
