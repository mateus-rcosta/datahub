import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./provider";


export const metadata: Metadata = {
  title: "Datahub",
  icons: {
    icon: "/logo/logo.svg",
  },
  description: "Sistema de gestão de dados da Londrinet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="pt-br">
      <body
        className={`antialiased bg-background`}
    >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
