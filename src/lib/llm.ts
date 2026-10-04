import type { Character } from "./characters";

export const llmProviders = [
  { key: "nvidia", name: "NVIDIA", defaultModel: "nvidia/nemotron-3-super-120b-a12b" },
  { key: "gemini", name: "Gemini", defaultModel: "gemini-2.5-flash" },
  { key: "openai", name: "OpenAI", defaultModel: "gpt-4.1-mini" },
] as const;

export type LlmProvider = (typeof llmProviders)[number]["key"];

export const audiences = [
  { key: "trabajo", name: "Trabajo", hint: "compañeros y jefes; ácido pero presentable, sin insultos ni temas sensibles" },
  { key: "amigos", name: "Amigos", hint: "confianza total; se permite ser más ácido, bardero y absurdo" },
  { key: "familia", name: "Familia", hint: "apto para todas las edades; ternura con ironía, nada ofensivo" },
  { key: "redes", name: "Redes", hint: "público desconocido; que se entienda sin contexto interno y sea fácil de compartir" },
] as const;

export type Audience = (typeof audiences)[number]["key"];

type QuoteRequest = { character: Character; topic: string; intensity: number; context: string; audience: Audience; count: number };

function tone(intensity: number) {
  if (intensity < 40) return "guiño liviano, casi coloquial";
  if (intensity < 70) return "solemne con ironía evidente";
  return "oráculo grandilocuente, máxima solemnidad para algo trivial";
}

export function buildPrompt({ character, topic, intensity, context, audience, count }: QuoteRequest) {
  const target = audiences.find((item) => item.key === audience) ?? audiences[0];
  const system = [
    `Sos guionista de humor y escribís citas apócrifas para memes del estilo "${character.name} nunca dijo esto".`,
    `Voz del personaje: ${character.voice}`,
    "Reglas: español rioplatense con voseo; cada frase es un aforismo de máximo 25 palabras; sabiduría antigua aplicada a una situación cotidiana y concreta; nunca uses citas reales ni frases conocidas; sin comillas, hashtags, emojis ni atribución.",
    "Respondé SOLO con un array JSON de strings, sin texto adicional.",
  ].join("\n");
  const prompt = [
    `Escribí ${count} frases distintas entre sí.`,
    `Frente de batalla: ${topic.trim() || "libre; elegí situaciones cotidianas reconocibles"}.`,
    `Solemnidad: ${intensity}% (${tone(intensity)}).`,
    `Público: ${target.name} (${target.hint}).`,
    context.trim() && `Contexto del usuario: ${context.trim()}`,
    `Ejemplos del estilo (no los repitas):\n- ${character.quotes.slice(0, 3).join("\n- ")}`,
  ].filter(Boolean).join("\n");
  return { system, prompt };
}

export function parseQuotes(text: string) {
  const clean = (value: string) => value.trim().replace(/^[-*\d.)\s]+/, "").replace(/^["“”«»']+|["“”«»']+$/g, "").trim();
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const start = text.indexOf("["), end = text.lastIndexOf("]");
  if (start !== -1 && end > start) {
    try {
      const parsed: unknown = JSON.parse(text.slice(start, end + 1));
      if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string").map(clean).filter(Boolean);
    } catch { /* cae al parseo por líneas */ }
  }
  return text.replace(/```\w*/g, "").split("\n").map(clean).filter((line) => line.length > 8);
}

async function callProxy<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/llm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data as T;
}

export async function requestQuotes(provider: LlmProvider, key: string, model: string, request: QuoteRequest) {
  const { text } = await callProxy<{ text: string }>({ action: "generate", provider, key, model, ...buildPrompt(request) });
  const quotes = parseQuotes(text);
  if (!quotes.length) throw new Error("El modelo no devolvió frases utilizables");
  return quotes.slice(0, request.count);
}

export async function listModels(provider: LlmProvider, key: string) {
  return (await callProxy<{ models: string[] }>({ action: "models", provider, key })).models;
}
