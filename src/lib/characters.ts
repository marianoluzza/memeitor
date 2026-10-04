export type Character = { id: string; name: string; kicker: string; attribution: string; image: string; voice: string; quotes: string[] };

// Para usar una imagen real: soltar public/characters/<id>.png (ideal con fondo transparente) y cambiar `image`.
export const characters: Character[] = [
  {
    id: "sun-tzu", name: "Sun Tzu", kicker: "SUN TZU NUNCA DIJO", attribution: "— SUN TZU, PROBABLEMENTE NO", image: "/characters/sun-tzu.svg",
    voice: "general y estratega chino de El arte de la guerra; habla de batallas, enemigos, terreno, engaño y vencer sin combatir.",
    quotes: [
      "El que conoce a su enemigo y a su contraseña de Wi-Fi, nunca cena solo.",
      "En medio del caos, hay también una notificación que podría haber sido un correo.",
      "La suprema excelencia consiste en vencer sin abrir el grupo de WhatsApp de la familia.",
      "Si tu plan depende de que nadie responda ‘dale’, no era un plan: era una siesta.",
      "El estratega victorioso gana antes de la batalla; el derrotado abre Excel sin café.",
      "Quien llega temprano a una reunión descubre que también empezó temprano el sufrimiento.",
      "Ataca donde el enemigo no está preparado: el formulario de gastos del lunes.",
      "No interrumpas a tu rival cuando está compartiendo pantalla y no encuentra el botón.",
    ],
  },
  {
    id: "confucio", name: "Confucio", kicker: "CONFUCIO NUNCA DIJO", attribution: "— CONFUCIO, NI EN BROMA", image: "/characters/confucio.svg",
    voice: "maestro chino de proverbios; habla del hombre sabio, la virtud, el camino, la paciencia y el respeto, con estructura de proverbio.",
    quotes: [
      "El hombre sabio silencia el grupo antes de que el grupo lo silencie a él.",
      "Quien pregunta es tonto un minuto; quien responde ‘visto’ es tonto para siempre.",
      "No importa lo lento que vayas, mientras la barra de carga siga moviéndose.",
      "El que mueve montañas empieza por mover la reunión de las 9 a las 10.",
      "Elige un trabajo que ames y no tendrás que abrir el mail un solo domingo. Mentira.",
      "El camino de mil millas comienza con un ‘ya salgo’ que nadie cree.",
    ],
  },
  {
    id: "maquiavelo", name: "Maquiavelo", kicker: "MAQUIAVELO NUNCA DIJO", attribution: "— N. MAQUIAVELO, SEGÚN NADIE", image: "/characters/maquiavelo.svg",
    voice: "consejero político florentino de El príncipe; cínico y pragmático, habla del poder, el príncipe, el miedo, la astucia y el fin que justifica los medios.",
    quotes: [
      "Es mejor ser temido que amado, pero lo ideal es ser el que tiene el cargador.",
      "El fin justifica los memes.",
      "El príncipe prudente nunca contesta ‘¿quién se suma?’ antes de saber quién paga.",
      "Divide y vencerás: sobre todo la cuenta del asado.",
      "Quien controla el calendario compartido controla el reino.",
      "Nunca dejes que tu enemigo vea tu historial de búsqueda.",
    ],
  },
  {
    id: "marco-aurelio", name: "Marco Aurelio", kicker: "MARCO AURELIO NUNCA DIJO", attribution: "— MARCO AURELIO, EN OFF", image: "/characters/marco-aurelio.svg",
    voice: "emperador romano estoico de las Meditaciones; habla de aceptar lo que no se controla, el deber, la brevedad de la vida y la serenidad.",
    quotes: [
      "No podés controlar el tráfico, solo la playlist con la que lo sufrís.",
      "Al despertar, recordá: hoy te cruzarás con gente que responde todos los mails con ‘+1’.",
      "La felicidad de tu vida depende de la calidad de tus siestas.",
      "Lo que no es bueno para la colmena, tampoco lo es para el chat del consorcio.",
      "Perdemos el tiempo como si tuviéramos otro; y abrimos otra pestaña.",
      "Aceptá lo que no podés cambiar, como la impresora de la oficina.",
    ],
  },
];
