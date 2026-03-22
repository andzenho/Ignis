import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ignis — Launch Management",
  description: "Система управления запусками онлайн-курсов",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className="bg-zinc-950 text-zinc-50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
