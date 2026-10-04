import { llmProviders, type LlmProvider } from "./llm";

export type RememberMode = "none" | "session" | "local";
export type ApiKeys = Partial<Record<LlmProvider, string>>;

export const rememberOptions: { key: RememberMode; name: string; scope: string; tip: string; warn?: boolean }[] = [
  { key: "none", name: "No guardar", scope: "Solo en memoria de esta pestaña. Al recargar o cerrar, se pierden.", tip: "La opción más segura; ideal en computadoras compartidas." },
  { key: "session", name: "Esta sesión", scope: "Solo esta pestaña: sobreviven a las recargas y se borran al cerrarla. Otras pestañas no las ven.", tip: "Buen punto medio si vas a usar el generador un rato." },
  { key: "local", name: "Navegador", scope: "Todas las pestañas de este navegador y perfil, sin vencimiento, hasta que elijas «No guardar» o borres los datos del sitio.", tip: "Quien use este navegador puede verlas. Evitalo en computadoras compartidas.", warn: true },
];

const MODE_KEY = "memeitor:remember";
const keyName = (provider: string) => `memeitor:key:${provider}`;
const modes = ["local", "session"] as const;
const storage = (mode: (typeof modes)[number]) => (mode === "local" ? window.localStorage : window.sessionStorage);

// El storage puede no existir o tirar error (modo privado, sitio bloqueado): en ese caso no se recuerda nada.
export function loadRemembered(): { mode: RememberMode; keys: ApiKeys } {
  try {
    const mode = modes.find((item) => storage(item).getItem(MODE_KEY) === item);
    if (!mode) return { mode: "none", keys: {} };
    const keys: ApiKeys = {};
    llmProviders.forEach(({ key }) => { const value = storage(mode).getItem(keyName(key)); if (value) keys[key] = value; });
    return { mode, keys };
  } catch { return { mode: "none", keys: {} }; }
}

export function rememberKeys(mode: RememberMode, keys: ApiKeys) {
  try {
    modes.forEach((item) => { const store = storage(item); store.removeItem(MODE_KEY); llmProviders.forEach(({ key }) => store.removeItem(keyName(key))); });
    if (mode === "none") return;
    const store = storage(mode);
    store.setItem(MODE_KEY, mode);
    Object.entries(keys).forEach(([provider, value]) => { if (value) store.setItem(keyName(provider), value); });
  } catch { /* sin storage disponible */ }
}
