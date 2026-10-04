// Proxy de paso hacia NVIDIA, Gemini y OpenAI. La key llega en cada request y no se guarda ni se loguea.
export const maxDuration = 60;

const MAX_BODY = 20_000;
const providers = ["nvidia", "gemini", "openai"] as const;
type Provider = (typeof providers)[number];
type Payload = { action?: "generate" | "models"; provider?: Provider; key?: string; model?: string; system?: string; prompt?: string };

const openAiBase: Record<Exclude<Provider, "gemini">, string> = { nvidia: "https://integrate.api.nvidia.com/v1", openai: "https://api.openai.com/v1" };
const geminiBase = "https://generativelanguage.googleapis.com/v1beta";

function fail(message: string, status = 400) { return Response.json({ error: message }, { status }); }

async function upstream(url: string, init: RequestInit) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(55_000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data?.error?.message ?? data?.detail ?? data?.title ?? `El proveedor respondió ${res.status}`), { status: res.status });
  return data;
}

async function listModels(provider: Provider, key: string): Promise<string[]> {
  if (provider === "gemini") {
    const data = await upstream(`${geminiBase}/models?pageSize=200`, { headers: { "x-goog-api-key": key } });
    return (data.models ?? []).filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes("generateContent")).map((m: { name: string }) => m.name.replace(/^models\//, ""));
  }
  const data = await upstream(`${openAiBase[provider]}/models`, { headers: { Authorization: `Bearer ${key}` } });
  return (data.data ?? []).map((m: { id: string }) => m.id);
}

async function generate(provider: Provider, key: string, model: string, system: string, prompt: string): Promise<string> {
  if (provider === "gemini") {
    const data = await upstream(`${geminiBase}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST", headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 1 } }),
    });
    return (data.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  }
  const data = await upstream(`${openAiBase[provider]}/chat/completions`, {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: [{ role: "system", content: system }, { role: "user", content: prompt }] }),
  });
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))) return fail("Origen no permitido", 403);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail("Pedido demasiado grande", 413);
  let body: Payload;
  try { body = JSON.parse(raw); } catch { return fail("JSON inválido"); }

  const { action = "generate", provider, key, model = "", system = "", prompt = "" } = body;
  if (!provider || !providers.includes(provider)) return fail("Proveedor desconocido");
  if (!key?.trim()) return fail("Falta la API key");

  try {
    if (action === "models") return Response.json({ models: (await listModels(provider, key.trim())).sort() });
    if (!/^[\w.\-/:]+$/.test(model)) return fail("Nombre de modelo inválido");
    if (!prompt.trim()) return fail("Falta el pedido");
    return Response.json({ text: await generate(provider, key.trim(), model, system, prompt) });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 502;
    const message = error instanceof Error ? error.message : "Error del proveedor";
    // NVIDIA lista modelos en su catálogo que no siempre están desplegados para cada cuenta.
    if (provider === "nvidia" && /function .*not found for account/i.test(message)) return fail(`El modelo "${model}" figura en el catálogo de NVIDIA pero no está habilitado para tu cuenta. Probá con otro con "Cargar modelos".`, 404);
    return fail(message, status >= 400 && status < 600 ? status : 502);
  }
}
