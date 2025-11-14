import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import GlobalClientEffects from "@/components/GlobalClientEffects";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ReduxProvider } from "@/store/ReduxProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace - Tudo que você precisa em um só lugar",
  description: "Marketplace completo com produtos e serviços. Conectamos você aos melhores estabelecimentos e profissionais da sua região.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ReduxProvider>
          <Toaster />
          <SonnerToaster />
          <GlobalClientEffects />
        </ThemeProvider>
      </body>
    </html>
  );
}
