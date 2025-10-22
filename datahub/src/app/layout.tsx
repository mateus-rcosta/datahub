import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";


export const metadata: Metadata = {
  title: "Datahub",
  description: "Sistema de gestão de dados da Londrinet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`overflow-hidden antialiased bg-background`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
