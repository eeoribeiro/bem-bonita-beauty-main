import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-modal-title" className="font-display text-lg leading-snug">
              {title}
            </h2>
            <p id="confirm-modal-message" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {message}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-foreground transition hover:bg-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}