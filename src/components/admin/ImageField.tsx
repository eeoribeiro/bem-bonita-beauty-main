import { ImagePlus, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { validarImagem } from "@/lib/admin-data";

export function ImageField({
  currentUrl,
  uploading,
  onSelect,
  label = "Imagem",
  wide = false,
}: {
  currentUrl?: string | null;
  uploading: boolean;
  onSelect: (file: File) => void;
  label?: string;
  wide?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);
  }, [currentUrl]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`relative mt-2 flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-background text-center transition hover:border-primary ${wide ? "aspect-[16/7]" : "aspect-[4/3]"}`}
      >
        {preview || currentUrl ? (
          <img
            src={preview ?? currentUrl ?? ""}
            alt="Prévia da imagem selecionada"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <>
            <ImagePlus className="h-7 w-7 text-magenta" />
            <span className="mt-2 text-sm text-muted-foreground">Escolher JPG, PNG ou WebP</span>
          </>
        )}
        {uploading ? (
          <span className="absolute inline-flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-sm text-white">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Enviando...
          </span>
        ) : null}
      </span>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            validarImagem(file);
          } catch (error) {
            window.alert(error instanceof Error ? error.message : "Arquivo inválido.");
            event.target.value = "";
            return;
          }
          if (preview) URL.revokeObjectURL(preview);
          setPreview(URL.createObjectURL(file));
          onSelect(file);
          event.target.value = "";
        }}
      />
      <span className="mt-2 block text-xs text-muted-foreground">Máximo 5 MB.</span>
    </label>
  );
}
