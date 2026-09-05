import { getSupabaseClient } from "./supabase";

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp"]);
const TAMANHO_MAXIMO = 10 * 1024 * 1024;

export function validarImagem(file: File) {
  if (!TIPOS_PERMITIDOS.has(file.type)) {
    throw new Error("Envie uma imagem JPG, PNG ou WebP.");
  }
  if (file.size > TAMANHO_MAXIMO) {
    throw new Error("A imagem deve ter no máximo 10 MB.");
  }
}

export async function uploadImagem(file: File, pasta: string) {
  validarImagem(file);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${pasta}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from("site-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return { path, url: supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl };
}

export async function removerImagem(path: string | null | undefined) {
  if (!path) return;
  const { error } = await getSupabaseClient().storage.from("site-images").remove([path]);
  if (error) throw error;
}
