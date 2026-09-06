import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import { Sidebar } from "@/components/Sidebar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cofrinanças · Painel admin",
  description: "Painel administrativo do app de finanças pessoais — protótipo com dados em mock.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full`}>
      <body className="min-h-full bg-canvas text-ink antialiased">
        <div className="flex min-h-dvh">
          <Sidebar />
          <main className="min-w-0 flex-1 bg-screen px-6 py-8 lg:px-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
