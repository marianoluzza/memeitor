# Memeitor

Herramientas para fabricar memes. La primera: **Sun Tzu nunca dijo esto**, un generador de citas apócrifas para batallas cotidianas.

Todo ocurre en el navegador: no usa base de datos, autenticación ni APIs. El sitio se exporta como estático para poder alojarlo sin backend.

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
