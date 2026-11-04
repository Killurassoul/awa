import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pour Awa — une petite surprise",
  description: "Une création pleine de couleurs, de douceur et de fierté pour Awa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
