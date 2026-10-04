# Memeitor

Herramientas para fabricar memes. La primera: **Nunca dijo esto**, un generador de citas apócrifas (Sun Tzu, Confucio, Maquiavelo, Marco Aurelio…) para batallas cotidianas.

No usa base de datos ni autenticación. La única pieza de servidor es `src/app/api/llm/route.ts`, un proxy de paso hacia NVIDIA, Gemini y OpenAI para pedir frases con IA.

## Frases con IA

En el panel **Frases con IA** elegís proveedor, pegás tu API key, elegís modelo (con "Cargar modelos" se listan los disponibles para tu key) y pedís frases. El prompt combina la voz del personaje (`voice` en `src/lib/characters.ts`), el frente de batalla, la solemnidad, el público, la cantidad y un contexto libre. El armado está en `src/lib/llm.ts`.

Por defecto la key vive solo en memoria (se pierde al recargar). Con "Recordar keys" se puede guardar, una por proveedor, en sessionStorage (*Esta sesión*) o localStorage (*Navegador*); volver a *No guardar* las borra. El proxy la reenvía al proveedor sin guardarla ni loguearla. El proxy solo habla con esos tres destinos, rechaza otros orígenes y limita el tamaño del pedido.

## Atajos

- `Ctrl+C` (fuera de un campo de texto): copia el meme como imagen PNG.
- `Ctrl+V`: pega la imagen del portapapeles como fondo del meme.

## Agregar un personaje

1. Soltá el retrato en `public/characters/<id>.png` (idealmente busto con fondo transparente). Los `.svg` actuales son placeholders.
2. Agregá o editá la entrada en `src/lib/characters.ts` (`name`, `kicker`, `attribution`, `image`, `quotes`).

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000` para usar el generador.

## Comprobación y publicación

```bash
npm run build
vercel --prod
```

La aplicación queda lista para desplegarse en Vercel desde este mismo directorio.
