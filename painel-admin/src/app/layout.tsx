import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import { Providers } from "./providers";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cofrinanças · Painel admin",
  description: "Painel administrativo do app de finanças pessoais.",
};

// Aplica o tema salvo antes da primeira pintura (sem flash).
const themeScript = `(function(){try{
var t=localStorage.getItem('${THEME_STORAGE_KEY}')||'system';
var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.setAttribute('data-theme',dark?'dark':'light');
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-canvas text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
