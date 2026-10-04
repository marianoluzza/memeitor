export type Character = { id: string; name: string; kicker: string; attribution: string; image: string; voice: string; rules?: string; quotes: string[] };

// Para usar una imagen real: soltar public/characters/<id>.png (ideal con fondo transparente) y cambiar `image`.
// Para los tiranos el chiste siempre es contra ellos: megalomanía aplicada a lo trivial, nunca apología.
const tyrantRules = "el blanco del chiste es siempre el personaje: su megalomanía, paranoia o ridiculez aplicadas a algo trivial. Nunca glorifiques ni justifiques su ideología, sus crímenes o sus genocidios; nunca ataques ni te burles de víctimas, pueblos, etnias, religiones ni minorías; sin consignas, simbología ni frases que funcionen como propaganda fuera del chiste.";

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
  {
    id: "marx", name: "Karl Marx", kicker: "MARX NUNCA DIJO", attribution: "— K. MARX, FUERA DE EL CAPITAL", image: "/characters/marx.svg",
    voice: "filósofo alemán de El capital y el Manifiesto; habla de lucha de clases, proletariado, burguesía, plusvalía y medios de producción.",
    quotes: [
      "La plusvalía es la diferencia entre lo que hiciste en la reunión y lo que el jefe contó que hizo.",
      "La historia de todas las sociedades es la historia de la lucha por la última porción de pizza.",
      "Un fantasma recorre la oficina: el fantasma del que se fue a las 18 en punto.",
      "Los filósofos solo han interpretado el grupo de WhatsApp; de lo que se trata es de silenciarlo.",
      "Expropiar el cargador ajeno no es robo: es socializar los medios de carga.",
      "Proletarios del mundo, uníos: el control remoto no se va a soltar solo.",
    ],
  },
  {
    id: "hitler", name: "Hitler", kicker: "HITLER NUNCA DIJO", attribution: "— ADOLF, ANTES DEL BERRINCHE", image: "/characters/hitler.svg",
    voice: "dictador alemán megalómano y ridículo al estilo de las parodias de La caída; se ofende por todo, grita, culpa a sus generales, señala mapas con falsa seguridad y fracasa en planes desmesurados.",
    rules: tyrantRules,
    quotes: [
      "Que se queden en la sala solo los que sabían que el Wi-Fi se caía a las cinco.",
      "¡Me prometieron que la reunión duraba quince minutos! ¡Quince!",
      "Ningún general me avisó que el delivery tardaba una hora. Ninguno.",
      "Señalo el mapa con total seguridad, pero no sé dónde dejé las llaves.",
      "Toda campaña de invierno termina igual: alguien deja la ventana abierta.",
      "Mi plan era perfecto hasta que alguien respondió ‘dale’ en el grupo.",
    ],
  },
  {
    id: "stalin", name: "Stalin", kicker: "STALIN NUNCA DIJO", attribution: "— STALIN, FOTO RETOCADA", image: "/characters/stalin.svg",
    voice: "dictador soviético paranoico y burocrático; habla de planes quinquenales, desconfianza de sus camaradas, fotos retocadas, comités y bigote severo.",
    rules: tyrantRules,
    quotes: [
      "Si no estás en la foto del asado, nunca fuiste al asado.",
      "Un mensaje sin responder es una tragedia; mil son el grupo del consorcio.",
      "El plan quinquenal para ordenar el placard va por el año siete.",
      "No es paranoia si el chat se queda en silencio cuando entrás.",
      "Dónde se come no lo deciden los que votan, sino el que hace la reserva.",
      "Confío en todos mis camaradas; por eso reviso quién vio el estado.",
    ],
  },
  {
    id: "mao", name: "Mao", kicker: "MAO NUNCA DIJO", attribution: "— MAO, NI EN EL LIBRITO ROJO", image: "/characters/mao.svg",
    voice: "líder comunista chino del Libro Rojo; habla con consignas grandilocuentes sobre la Larga Marcha, las masas, tigres de papel, chispas que incendian praderas y cien flores.",
    rules: tyrantRules,
    quotes: [
      "Toda larga marcha empieza con alguien diciendo ‘es acá nomás, a dos cuadras’.",
      "El jefe que no contesta mails es un tigre de papel.",
      "Una chispa puede incendiar la pradera; un ‘responder a todos’, también.",
      "El poder nace del control del termostato.",
      "Que florezcan cien ideas en la reunión, y después anotemos quién propuso cada una.",
      "El gran salto adelante de mi rutina de gimnasio duró hasta el miércoles.",
    ],
  },
];

// Casillero sin avatar: el nombre lo escribe el usuario y el personaje suele venir en la imagen de fondo.
export const CUSTOM_ID = "otro";

export function customCharacter(name: string): Character {
  const clean = name.trim() || "Alguien", upper = clean.toLocaleUpperCase("es");
  return {
    id: CUSTOM_ID, name: clean, kicker: `${upper} NUNCA DIJO`, attribution: `— ${upper}, SUPUESTAMENTE`, image: "",
    voice: name.trim() ? `${clean}; imitá su forma de hablar, muletillas y los temas por los que es conocido, exagerados en clave de parodia.` : "un sabio anónimo y autoproclamado; habla como gurú de autoayuda que se toma demasiado en serio.",
    rules: "el personaje lo eligió el usuario. Si es una persona real, la parodia tiene que ser evidente y apuntar a su figura pública: sin acusaciones falsas de delitos, sin contenido sexual y sin burlas por su físico, salud u origen. Si es un tirano o genocida, el blanco del chiste es su megalomanía o ridiculez, nunca apología ni burla a sus víctimas.",
    quotes: [
      "Nunca dejes para mañana lo que podés reprogramar para el jueves.",
      "El éxito es 1% inspiración y 99% encontrar el cargador.",
      "Si la vida te da limones, preguntá quién los pidió y por qué están en tu escritorio.",
      "Lo importante no es ganar, sino que no te etiqueten en la foto.",
      "Detrás de todo gran plan hay alguien que dijo ‘después lo vemos’.",
    ],
  };
}
