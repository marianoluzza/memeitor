import type { Character } from "./characters";

export const MEME_SIZE = 1200;

export const styles = [
  { key: "lacra", name: "Tinta imperial", description: "Sobrio, antiguo y demasiado seguro de sí mismo.", bg: "#121922", dots: "rgba(229,181,93,.22)", ink: "#e8e3d6", accent: "#e5b55d" },
  { key: "alerta", name: "Alerta roja", description: "Para una revelación estratégica de dudosa utilidad.", bg: "#bb2730", dots: "rgba(247,233,209,.25)", ink: "#f7e9d1", accent: "#f7c953" },
  { key: "papel", name: "Pergamino", description: "La mentira se ve más sabia sobre papel viejo.", bg: "#d6c28c", dots: "rgba(62,47,31,.2)", ink: "#3e2f1f", accent: "#765631" },
];

export type MemeStyle = (typeof styles)[number];

type MemeInput = { character: Character; quote: string; style: MemeStyle; portrait: HTMLImageElement | null; background: HTMLImageElement | null };

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  text.split("\n").forEach((paragraph) => {
    let line = "";
    paragraph.split(" ").forEach((word) => { const next = `${line}${word} `; if (ctx.measureText(next).width > maxWidth && line) { lines.push(line.trim()); line = `${word} `; } else line = next; });
    lines.push(line.trim());
  });
  return lines;
}

function fitImage(img: HTMLImageElement, maxW: number, maxH: number, cover: boolean) {
  const scale = (cover ? Math.max : Math.min)(maxW / img.naturalWidth, maxH / img.naturalHeight);
  return { w: img.naturalWidth * scale, h: img.naturalHeight * scale };
}

export function renderMeme(ctx: CanvasRenderingContext2D, { character, quote, style, portrait, background }: MemeInput) {
  const S = MEME_SIZE;
  const ink = background ? "#f4efe3" : style.ink;
  const accent = background ? "#e5b55d" : style.accent;
  ctx.clearRect(0, 0, S, S);

  if (background) {
    const { w, h } = fitImage(background, S, S, true);
    ctx.drawImage(background, (S - w) / 2, (S - h) / 2, w, h);
    const shade = ctx.createLinearGradient(0, 0, S, 0);
    shade.addColorStop(0, "rgba(0,0,0,.35)"); shade.addColorStop(1, "rgba(0,0,0,.7)");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, S, S);
  } else {
    ctx.fillStyle = style.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = style.dots;
    for (let x = 10; x < S; x += 30) for (let y = 10; y < S; y += 30) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill(); }
  }

  ctx.strokeStyle = accent; ctx.lineWidth = 6; ctx.strokeRect(40, 40, S - 80, S - 80);

  if (portrait) {
    const { w, h } = fitImage(portrait, 640, 820, false);
    ctx.drawImage(portrait, (620 - w) / 2, S - h, w, h);
  }

  // Sin retrato ni fondo no hay nada a la izquierda: el texto ocupa todo el ancho.
  const solo = !portrait && !background;
  const textX = solo ? S / 2 : 860, textW = solo ? 860 : 520, top = 230, bottom = 960;
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.shadowColor = background ? "rgba(0,0,0,.6)" : "transparent"; ctx.shadowBlur = background ? 14 : 0;

  ctx.fillStyle = accent; ctx.font = "700 30px Arial";
  ctx.fillText(character.kicker, textX, 150);

  let size = 84, lines: string[] = [];
  for (; size >= 30; size -= 4) {
    ctx.font = `bold ${size}px Georgia`;
    lines = wrap(ctx, `“${quote.trim()}”`, textW);
    if (lines.length * size * 1.18 + 90 <= bottom - top) break;
  }
  const lineHeight = size * 1.18;
  let y = top + (bottom - top - (lines.length * lineHeight + 90)) / 2 + size;
  ctx.fillStyle = ink;
  lines.forEach((line) => { ctx.fillText(line, textX, y); y += lineHeight; });

  ctx.fillStyle = accent; ctx.font = "700 26px Arial";
  ctx.fillText(character.attribution, textX, y + 40);

  ctx.fillStyle = ink; ctx.globalAlpha = .7; ctx.textAlign = "right"; ctx.font = "600 24px Arial";
  ctx.fillText("memeitor", S - 70, S - 70);
  ctx.globalAlpha = 1; ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
}
