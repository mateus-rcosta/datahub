import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "./provider";


export const metadata: Metadata = {
  title: "Datahub",
  icons: {
    icon: "/logo/logo.svg",
  },
  description: "Sistema de gestão de dados da Londrinet.",
  appleWebApp: { capable: true, title: "Datahub", statusBarStyle: "black-translucent" }
};

export const viewport = {
  themeColor: '#353a70',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="pt-br" suppressHydrationWarning>
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
