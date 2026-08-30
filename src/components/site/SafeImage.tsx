import { useState, type ImgHTMLAttributes, type SyntheticEvent } from "react";

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc: string;
};

export function SafeImage({ fallbackSrc, onError, src, ...props }: SafeImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const requestedSrc = typeof src === "string" ? src : "";
  const visibleSrc = !requestedSrc || failedSrc === requestedSrc ? fallbackSrc : requestedSrc;

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    if (event.currentTarget.src !== new URL(fallbackSrc, window.location.href).href) {
      setFailedSrc(requestedSrc);
    }
    onError?.(event);
  }

  return <img {...props} src={visibleSrc} onError={handleError} />;
}
