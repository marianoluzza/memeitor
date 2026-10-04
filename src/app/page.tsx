"use client";

import { useState } from "react";

const quotes = [
  "El que conoce a su enemigo y a su contraseña de Wi-Fi, nunca cena solo.",
  "En medio del caos, hay también una notificación que podría haber sido un correo.",
  "La suprema excelencia consiste en vencer sin abrir el grupo de WhatsApp de la familia.",
  "Si tu plan depende de que nadie responda ‘dale’, no era un plan: era una siesta.",
  "El estratega victorioso gana antes de la batalla; el derrotado abre Excel sin café.",
  "Quien llega temprano a una reunión descubre que también empezó temprano el sufrimiento.",
  "Ataca donde el enemigo no está preparado: el formulario de gastos del lunes.",
  "No interrumpas a tu rival cuando está compartiendo pantalla y no encuentra el botón.",
];

const styles = [
  { key: "lacra", name: "Tinta imperial", description: "Sobrio, antiguo y demasiado seguro de sí mismo." },
  { key: "alerta", name: "Alerta roja", description: "Para una revelación estratégica de dudosa utilidad." },
  { key: "papel", name: "Pergamino", description: "La mentira se ve más sabia sobre papel viejo." },
];

export default function Home() {
  const [topic, setTopic] = useState("reuniones que podrían ser un mail");
  const [intensity, setIntensity] = useState(62);
  const [style, setStyle] = useState("lacra");
  const [quote, setQuote] = useState(quotes[0]);
  const [copied, setCopied] = useState(false);
  const currentStyle = styles.find((item) => item.key === style) ?? styles[0];

  function generate() {
    const base = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(topic.trim() ? `${base} Esto también aplica a ${topic.trim().toLowerCase()}.${intensity > 66 ? " Y jamás subestimes a quien trae facturas." : " Especialmente los martes."}` : base);
    setCopied(false);
  }

  async function copyQuote() {
    await navigator.clipboard.writeText(`“${quote}” — Sun Tzu (probablemente no)`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadMeme() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 1200;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const palette = style === "alerta" ? ["#bb2730", "#f7e9d1", "#241218", "#f7c953"] : style === "papel" ? ["#d6c28c", "#f4e8c8", "#3e2f1f", "#765631"] : ["#121922", "#e8e3d6", "#19212b", "#e5b55d"];
    ctx.fillStyle = palette[0]; ctx.fillRect(0, 0, 1200, 1200);
    ctx.fillStyle = palette[1]; ctx.fillRect(80, 80, 1040, 1040);
    ctx.strokeStyle = palette[3]; ctx.lineWidth = 8; ctx.strokeRect(104, 104, 992, 992);
    ctx.fillStyle = palette[2]; ctx.textAlign = "center"; ctx.font = "600 45px Georgia"; ctx.fillText("SUN TZU NUNCA DIJO", 600, 235);
    ctx.font = "bold 77px Georgia";
    const words = quote.split(" "); let line = ""; let y = 430;
    words.forEach((word) => { const next = `${line}${word} `; if (ctx.measureText(next).width > 810 && line) { ctx.fillText(line.trim(), 600, y); line = `${word} `; y += 105; } else line = next; });
    ctx.fillText(line.trim(), 600, y); ctx.font = "600 32px Arial"; ctx.fillText("memeitor · estrategia de bajo presupuesto", 600, 1015);
    const link = document.createElement("a"); link.download = "sun-tzu-nunca-dijo.png"; link.href = canvas.toDataURL("image/png"); link.click();
  }

  return <main className="app-shell">
    <nav className="topbar" aria-label="Navegación principal"><a className="brand" href="#inicio"><span className="brand-mark">M</span><span>memeitor</span></a><span className="beta">LABORATORIO DE MEMES</span><button className="ghost-button" type="button" onClick={copyQuote}>{copied ? "Copiado" : "Copiar cita"}</button></nav>
    <section id="inicio" className="intro"><div><p className="eyebrow">HERRAMIENTA 01 / CITAS APÓCRIFAS</p><h1>Sun Tzu nunca dijo<br /><em>esto.</em></h1></div><p className="intro-copy">Frases tácticas para batallas que no merecían estrategia. Generá, copiá o descargá una cita que el maestro jamás escribió.</p></section>
    <section className="workspace" aria-label="Generador de citas apócrifas">
      <aside className="controls"><div className="section-label"><span>01</span> PREPARAR EL DESASTRE</div><label htmlFor="topic">¿Cuál es el frente de batalla?</label><input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ej.: la reunión del lunes" />
        <div className="range-label"><label htmlFor="intensity">Nivel de solemnidad</label><strong>{intensity}%</strong></div><input className="range" id="intensity" type="range" min="15" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} /><div className="range-legend"><span>GUIÑO</span><span>ORÁCULO</span></div>
        <div className="style-area"><span className="input-label">Estética</span><div className="style-options">{styles.map((item) => <button key={item.key} className={`style-option ${style === item.key ? "selected" : ""}`} type="button" onClick={() => setStyle(item.key)}><span className={`style-swatch ${item.key}`} aria-hidden="true" /><span>{item.name}</span></button>)}</div></div><button className="generate-button" type="button" onClick={generate}>Generar máxima</button>
      </aside>
      <div className={`meme-stage ${style}`}><div className="paper-card"><div className="corner-stamp">兵法<br /><span>100%</span><br />inventado</div><p className="card-kicker">SUN TZU NUNCA DIJO</p><blockquote>“{quote}”</blockquote><div className="card-footer"><span>— SUN TZU, PROBABLEMENTE NO</span><span>memeitor / 01</span></div></div><div className="stage-caption"><span>{currentStyle.description}</span><span>LISTA PARA LA BATALLA</span></div></div>
    </section>
    <section className="action-row"><div><span className="section-number">02</span><p>LA VICTORIA ES COMPARTIBLE</p></div><button className="download-button" type="button" onClick={downloadMeme}>Descargar PNG <span>↓</span></button></section>
    <footer><span>MEMEITOR © 2026</span><span>NINGUNA CITA HISTÓRICA FUE HERIDA EN ESTE PROCESO</span></footer>
  </main>;
}
