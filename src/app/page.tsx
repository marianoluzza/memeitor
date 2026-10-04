"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { characters, customCharacter, CUSTOM_ID } from "@/lib/characters";
import { audiences, listModels, llmProviders, requestQuotes, type Audience, type LlmProvider } from "@/lib/llm";
import { loadRemembered, rememberKeys, rememberOptions, type ApiKeys, type RememberMode } from "@/lib/keyStore";
import { loadImage, MEME_SIZE, renderMeme, styles } from "@/lib/renderMeme";

function Shortcuts() {
  return <div className="shortcuts"><span><kbd>Ctrl</kbd>+<kbd>C</kbd> copiar imagen</span><span><kbd>Ctrl</kbd>+<kbd>V</kbd> pegar fondo</span></div>;
}

function EmptyAvatar() {
  return <span className="avatar-empty" aria-hidden="true">?</span>;
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar el PNG"))), "image/png"));
}

export default function Home() {
  const [characterId, setCharacterId] = useState(characters[0].id);
  const [customName, setCustomName] = useState("");
  const [topic, setTopic] = useState("reuniones que podrían ser un mail");
  const [intensity, setIntensity] = useState(62);
  const [style, setStyle] = useState("lacra");
  const [quote, setQuote] = useState(characters[0].quotes[0]);
  const [portrait, setPortrait] = useState<{ src: string; img: HTMLImageElement } | null>(null);
  const [background, setBackground] = useState<HTMLImageElement | null>(null);
  const [toast, setToast] = useState("");
  // Una key por proveedor. Por defecto solo en memoria; se guarda en storage únicamente si el usuario lo elige.
  const [provider, setProvider] = useState<LlmProvider>(llmProviders[0].key);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [remember, setRemember] = useState<RememberMode>("none");
  const [model, setModel] = useState<string>(llmProviders[0].defaultModel);
  const [models, setModels] = useState<string[]>([]);
  const [aiContext, setAiContext] = useState("");
  const [audience, setAudience] = useState<Audience>("trabajo");
  const [count, setCount] = useState(5);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [aiBusy, setAiBusy] = useState<"" | "models" | "quotes">("");
  const [aiError, setAiError] = useState("");
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const keysLoaded = useRef(false);
  const character = useMemo(() => characterId === CUSTOM_ID ? customCharacter(customName) : characters.find((item) => item.id === characterId) ?? characters[0], [characterId, customName]);
  const currentStyle = styles.find((item) => item.key === style) ?? styles[0];
  const apiKey = apiKeys[provider] ?? "";

  const flash = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 1800);
  }, []);

  const copyImage = useCallback(async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    try { await navigator.clipboard.write([new ClipboardItem({ "image/png": canvasToBlob(canvas) })]); flash("Imagen copiada al portapapeles"); }
    catch { flash("El navegador no dejó copiar la imagen"); }
  }, [flash]);

  useEffect(() => {
    if (!character.image) return;
    let alive = true;
    loadImage(character.image).then((img) => { if (alive) setPortrait({ src: character.image, img }); }).catch(() => { if (alive) setPortrait(null); });
    return () => { alive = false; };
  }, [character.image]);

  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext("2d"); if (!canvas || !ctx) return;
    renderMeme(ctx, { character, quote, style: currentStyle, portrait: portrait?.src === character.image ? portrait.img : null, background });
    const preview = previewRef.current?.getContext("2d");
    if (preview) { preview.clearRect(0, 0, MEME_SIZE / 2, MEME_SIZE / 2); preview.drawImage(canvas, 0, 0, MEME_SIZE / 2, MEME_SIZE / 2); }
  }, [character, quote, currentStyle, portrait, background]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey || e.key.toLowerCase() !== "c") return;
      const el = document.activeElement;
      if (el instanceof HTMLTextAreaElement || (el instanceof HTMLInputElement && el.type !== "range") || (el instanceof HTMLElement && el.isContentEditable)) return;
      if (window.getSelection()?.toString()) return;
      e.preventDefault(); copyImage();
    }
    function onPaste(e: ClipboardEvent) {
      const file = Array.from(e.clipboardData?.items ?? []).find((item) => item.type.startsWith("image/"))?.getAsFile();
      if (!file) return;
      e.preventDefault();
      const url = URL.createObjectURL(file);
      loadImage(url).then((img) => { setBackground(img); flash("Fondo pegado"); }).catch(() => { URL.revokeObjectURL(url); flash("No se pudo leer la imagen pegada"); });
    }
    window.addEventListener("keydown", onKeyDown); window.addEventListener("paste", onPaste);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("paste", onPaste); };
  }, [copyImage, flash]);

  useEffect(() => () => { if (background) URL.revokeObjectURL(background.src); }, [background]);

  function selectCharacter(id: string) {
    const next = id === CUSTOM_ID ? customCharacter(customName) : characters.find((item) => item.id === id); if (!next) return;
    setCharacterId(id); setQuote(next.quotes[0]); setSuggestions([]);
  }

  function generate() {
    const base = character.quotes[Math.floor(Math.random() * character.quotes.length)];
    setQuote(topic.trim() ? `${base} Esto también aplica a ${topic.trim().toLowerCase()}.${intensity > 66 ? " Y jamás subestimes a quien trae facturas." : " Especialmente los martes."}` : base);
  }

  function selectProvider(key: LlmProvider) {
    setProvider(key); setModel(llmProviders.find((item) => item.key === key)?.defaultModel ?? ""); setModels([]); setAiError("");
  }

  // Las keys guardadas se leen recién al abrir el generador.
  function openGenerator() {
    if (!keysLoaded.current) {
      keysLoaded.current = true;
      const saved = loadRemembered();
      setRemember(saved.mode); setApiKeys(saved.keys);
    }
    dialogRef.current?.showModal(); setGeneratorOpen(true);
  }

  function changeKey(value: string) {
    const next = { ...apiKeys, [provider]: value };
    setApiKeys(next); rememberKeys(remember, next);
  }

  function changeRemember(mode: RememberMode) {
    setRemember(mode); rememberKeys(mode, apiKeys);
    flash(mode === "none" ? "Keys guardadas borradas" : mode === "session" ? "Keys guardadas hasta cerrar la pestaña" : "Keys guardadas en este navegador");
  }

  async function loadModels() {
    setAiBusy("models"); setAiError("");
    try { setModels(await listModels(provider, apiKey)); flash("Modelos cargados"); }
    catch (error) { setAiError(error instanceof Error ? error.message : "No se pudieron cargar los modelos"); }
    finally { setAiBusy(""); }
  }

  async function askAi() {
    setAiBusy("quotes"); setAiError("");
    try {
      const quotes = await requestQuotes(provider, apiKey, model.trim(), { character, topic, intensity, context: aiContext, audience, count });
      setSuggestions(quotes); setQuote(quotes[0]);
    } catch (error) { setAiError(error instanceof Error ? error.message : "El oráculo no respondió"); }
    finally { setAiBusy(""); }
  }

  async function copyQuote() {
    await navigator.clipboard.writeText(`“${quote}” ${character.attribution}`);
    flash("Cita copiada");
  }

  async function downloadMeme() {
    const canvas = canvasRef.current; if (!canvas) return;
    const url = URL.createObjectURL(await canvasToBlob(canvas));
    const link = document.createElement("a"); link.download = `${character.id}-nunca-dijo.png`; link.href = url; link.click();
    URL.revokeObjectURL(url);
  }

  const toastNode = <div className={`toast ${toast ? "visible" : ""}`} role="status" aria-live="polite">{toast}</div>;
  const customField = <div className="custom-name"><label htmlFor="custom-name">¿Quién nunca lo dijo?</label><input id="custom-name" autoFocus maxLength={40} value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Ej.: el de la foto, mi jefe, Messi" /><p className="hint">Sin retrato: ideal si el personaje ya está en la imagen de fondo (<kbd>Ctrl</kbd>+<kbd>V</kbd>).</p></div>;
  const providerName = llmProviders.find((item) => item.key === provider)?.name;

  return <main className="app-shell">
    <nav className="topbar" aria-label="Navegación principal"><a className="brand" href="#inicio"><span className="brand-mark">M</span><span>memeitor</span></a><span className="beta">LABORATORIO DE MEMES</span><button className="ghost-button" type="button" onClick={copyQuote}>Copiar cita</button></nav>
    <section id="inicio" className="intro"><div><p className="eyebrow">HERRAMIENTA 01 / CITAS APÓCRIFAS</p><h1>{character.name} nunca dijo<br /><em>esto.</em></h1></div><p className="intro-copy">Frases tácticas para batallas que no merecían estrategia. Elegí al sabio, escribí o generá la cita, pegá un fondo con <kbd>Ctrl</kbd>+<kbd>V</kbd> y copiala con <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p></section>
    <section className="gallery" aria-label="Galería de personajes"><div className="section-label"><span>00</span> ELEGIR AL SABIO</div><div className="gallery-grid">{characters.map((item) => <button key={item.id} className={`character-card ${item.id === characterId ? "selected" : ""}`} type="button" onClick={() => selectCharacter(item.id)} aria-pressed={item.id === characterId}><img src={item.image} alt="" /><span>{item.name}</span></button>)}<button className={`character-card custom ${characterId === CUSTOM_ID ? "selected" : ""}`} type="button" onClick={() => selectCharacter(CUSTOM_ID)} aria-pressed={characterId === CUSTOM_ID}><EmptyAvatar /><span>{customName.trim() || "Sin avatar"}</span></button></div>{characterId === CUSTOM_ID && !generatorOpen && customField}</section>
    <section className="workspace" aria-label="Meme">
      <aside className="side-panel">
        <div className="section-label"><span>01</span> PREPARAR EL DESASTRE</div>
        <p className="side-copy">Escribí la frase, pedile ideas a la IA y elegí estética y fondo.</p>
        <button className="generate-button" type="button" onClick={openGenerator}>Abrir generador</button>
        <button className="ghost-button wide" type="button" onClick={generate}>Máxima al azar</button>
        <div className="section-label share"><span>02</span> LA VICTORIA ES COMPARTIBLE</div>
        <button className="ghost-button wide" type="button" onClick={copyImage}>Copiar imagen</button>
        <button className="download-button wide" type="button" onClick={downloadMeme}>Descargar PNG <span>↓</span></button>
        {background && <button className="link-button" type="button" onClick={() => setBackground(null)}>Quitar fondo</button>}
      </aside>
      <div className={`meme-stage ${style}`}><canvas ref={canvasRef} className="meme-canvas" width={MEME_SIZE} height={MEME_SIZE} role="img" aria-label={`“${quote}” ${character.attribution}`} /><div className="stage-caption"><span>{currentStyle.description}</span><Shortcuts /></div></div>
    </section>
    <footer><span>MEMEITOR © 2026</span><span>NINGUNA CITA HISTÓRICA FUE HERIDA EN ESTE PROCESO</span></footer>
    {!generatorOpen && toastNode}

    <dialog ref={dialogRef} className="generator" aria-labelledby="generator-title" onClose={() => setGeneratorOpen(false)}>
      <div className="generator-inner">
        <header className="generator-head"><div><p className="eyebrow">GENERADOR</p><h2 id="generator-title">{character.name} nunca dijo…</h2></div><button className="ghost-button" type="button" onClick={() => dialogRef.current?.close()}>Cerrar <span aria-hidden="true">✕</span></button></header>
        <div className="generator-body">
          <div className="controls generator-form">
            <span className="input-label">Personaje</span><div className="character-chips">{characters.map((item) => <button key={item.id} className={`character-chip ${item.id === characterId ? "selected" : ""}`} type="button" onClick={() => selectCharacter(item.id)} aria-pressed={item.id === characterId}><img src={item.image} alt="" /><span>{item.name}</span></button>)}<button className={`character-chip ${characterId === CUSTOM_ID ? "selected" : ""}`} type="button" onClick={() => selectCharacter(CUSTOM_ID)} aria-pressed={characterId === CUSTOM_ID}><EmptyAvatar /><span>{customName.trim() || "Sin avatar"}</span></button></div>
            {characterId === CUSTOM_ID && generatorOpen && customField}
            <label htmlFor="quote">La frase</label><textarea id="quote" rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Escribí lo que nunca dijo" />

            <details className="ai-panel"><summary>Conexión IA <span>{providerName} · {apiKey.trim() ? "KEY CARGADA" : "SIN KEY"}</span></summary>
              <label htmlFor="provider">Proveedor</label><select id="provider" value={provider} onChange={(e) => selectProvider(e.target.value as LlmProvider)}>{llmProviders.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select>
              <label htmlFor="api-key">API key de {providerName}</label><input id="api-key" type="password" autoComplete="off" data-1p-ignore data-lpignore="true" spellCheck={false} value={apiKey} onChange={(e) => changeKey(e.target.value)} placeholder="Pegá tu key" />
              <label htmlFor="remember">Recordar keys</label><select id="remember" value={remember} onChange={(e) => changeRemember(e.target.value as RememberMode)}>{rememberOptions.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select>
              <ul className="remember-tips" aria-label="Alcance de cada opción de guardado">{rememberOptions.map((item) => <li key={item.key} className={`${remember === item.key ? "active" : ""} ${item.warn ? "warn" : ""}`}><strong>{item.name}</strong><span>{item.scope}</span><em>Tip: {item.tip}</em></li>)}<li className="general"><em>Tip: poné un límite de gasto a tus keys en cada proveedor; si una se filtra, el daño queda acotado.</em></li></ul>
              <div className="label-row"><label htmlFor="model">Modelo</label><button className="link-button" type="button" onClick={loadModels} disabled={!apiKey.trim() || aiBusy !== ""}>{aiBusy === "models" ? "Cargando…" : "Cargar modelos"}</button></div><input id="model" list="model-options" spellCheck={false} value={model} onChange={(e) => setModel(e.target.value)} /><datalist id="model-options">{models.map((item) => <option key={item} value={item} />)}</datalist>
            </details>

            <div className="form-section"><div className="section-label"><span>01</span> CONTEXTO</div>
              <label htmlFor="topic">¿Cuál es el frente de batalla?</label><input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej.: la reunión del lunes" />
              <div className="range-label"><label htmlFor="intensity">Nivel de solemnidad</label><strong>{intensity}%</strong></div><input className="range" id="intensity" type="range" min="15" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} /><div className="range-legend"><span>GUIÑO</span><span>ORÁCULO</span></div>
              <div className="ai-row"><div><label htmlFor="audience">Público</label><select id="audience" value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>{audiences.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select></div><div><label htmlFor="count">Cantidad</label><input id="count" type="number" min={1} max={10} value={count} onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))} /></div></div>
              <label htmlFor="ai-context">Contexto extra</label><textarea id="ai-context" rows={2} value={aiContext} onChange={(e) => setAiContext(e.target.value)} placeholder="Ej.: equipo de soporte, el cliente siempre lo pide para ayer" />
              <p className="hint">Público, cantidad y contexto extra solo los usa la IA.</p>
              <div className="generate-actions"><button className="generate-button" type="button" onClick={askAi} disabled={!apiKey.trim() || !model.trim() || aiBusy !== ""}>{aiBusy === "quotes" ? "Consultando al oráculo…" : "Pedir frases con IA"}</button><button className="ghost-button" type="button" onClick={generate}>Máxima al azar</button></div>
              {!apiKey.trim() && <p className="hint">Para usar la IA, cargá tu key en Conexión IA.</p>}
              {aiError && <p className="ai-error" role="alert">{aiError}</p>}
            </div>

            <div className="form-section"><div className="section-label"><span>02</span> ESTÉTICA Y FONDO</div>
              <div className="style-options compact">{styles.map((item) => <button key={item.key} className={`style-option ${style === item.key ? "selected" : ""}`} type="button" onClick={() => setStyle(item.key)}><span className={`style-swatch ${item.key}`} aria-hidden="true" /><span>{item.name}</span></button>)}</div>
              <div className="background-area">{background ? <button className="ghost-button" type="button" onClick={() => setBackground(null)}>Quitar fondo</button> : <p className="hint">Fondo: copiá una imagen y pegala con <kbd>Ctrl</kbd>+<kbd>V</kbd>.</p>}</div>
            </div>
          </div>
          <aside className={`generator-preview ${style}`} aria-label="Vista previa">
            <canvas ref={previewRef} className="meme-canvas" width={MEME_SIZE / 2} height={MEME_SIZE / 2} aria-hidden="true" />
            <Shortcuts />
            {suggestions.length > 0 && <div><span className="input-label">Sugerencias</span><ul className="suggestions">{suggestions.map((item) => <li key={item}><button type="button" className={quote === item ? "selected" : ""} onClick={() => setQuote(item)}>{item}</button></li>)}</ul></div>}
          </aside>
        </div>
      </div>
      {generatorOpen && toastNode}
    </dialog>
  </main>;
}
