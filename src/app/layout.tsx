import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memeitor — Sun Tzu nunca dijo esto",
  description: "Generador de citas apócrifas para batallas que no merecían estrategia.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
