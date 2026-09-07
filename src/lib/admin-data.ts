import { getSupabaseClient } from "./supabase";

const TIPOS_PERMITIDOS = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);
const TAMANHO_MAXIMO_ENTRADA = 30 * 1024 * 1024;
const TAMANHO_MAXIMO_UPLOAD = 4.5 * 1024 * 1024;
const LADO_MAXIMO = 2200;

export function validarImagem(file: File) {
  if (!TIPOS_PERMITIDOS.has(file.type)) {
    throw new Error("Envie uma imagem JPG, PNG, WebP ou SVG.");
  }
  if (file.size > TAMANHO_MAXIMO_ENTRADA) {
    throw new Error("A imagem deve ter no máximo 30 MB.");
  }
}

function carregarImagem(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui ler essa imagem. Tente salvar como JPG, PNG ou WebP e enviar novamente."));
    };
    image.src = url;
  });
}

function canvasParaBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Não foi possível preparar a imagem para envio."));
      },
      type,
      quality,
    );
  });
}

async function otimizarImagem(file: File) {
  if (file.type === "image/svg+xml" || file.size <= TAMANHO_MAXIMO_UPLOAD) return file;

  const image = await carregarImagem(file);
  const scale = Math.min(1, LADO_MAXIMO / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível preparar a imagem para envio.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const qualities = [0.9, 0.82, 0.74, 0.66];
  let bestBlob: Blob | null = null;

  for (const quality of qualities) {
    const blob = await canvasParaBlob(canvas, "image/jpeg", quality);
    bestBlob = blob;
    if (blob.size <= TAMANHO_MAXIMO_UPLOAD) break;
  }

  if (!bestBlob || bestBlob.size > TAMANHO_MAXIMO_UPLOAD) {
    throw new Error("A imagem está muito pesada. Tente recortar ou enviar uma versão menor.");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "imagem";
  return new File([bestBlob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

function mensagemUpload(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("row-level security") || lowerMessage.includes("permission") || lowerMessage.includes("not authorized")) {
    return "O Supabase bloqueou o envio da imagem por permissão. Para o Nosso Espaço, rode o SQL supabase/nosso-espaco-rebuild.sql no Supabase.";
  }

  if (lowerMessage.includes("bucket") || lowerMessage.includes("not found") || lowerMessage.includes("does not exist")) {
    return "O bucket/tabela do Nosso Espaço ainda não existe no Supabase. Rode o SQL supabase/nosso-espaco-rebuild.sql e tente enviar novamente.";
  }

  if (lowerMessage.includes("exceeded") || lowerMessage.includes("too large") || lowerMessage.includes("file size")) {
    return "A imagem está maior que o limite aceito pelo Supabase. Tente uma imagem menor ou rode o SQL para aumentar o limite do bucket.";
  }

  return message || "Não foi possível enviar a imagem.";
}

export async function uploadImagem(file: File, pasta: string, bucket = "site-images") {
  validarImagem(file);
  const imagem = await otimizarImagem(file);
  const extension = imagem.type === "image/svg+xml" ? "svg" : "jpg";
  const path = `${pasta}/${crypto.randomUUID()}.${extension}`;
  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(bucket).upload(path, imagem, {
    cacheControl: "31536000",
    contentType: imagem.type,
    upsert: false,
  });
  if (error) throw new Error(mensagemUpload(error));
  return { path, url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl };
}

export async function removerImagem(path: string | null | undefined, bucket = "site-images") {
  if (!path) return;
  const { error } = await getSupabaseClient().storage.from(bucket).remove([path]);
  if (error) throw error;
}
