import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import PWARegister from "@/components/layout/PWARegister"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kairos — Momento certo para agir",
  description: "Sistema de produtividade para o cérebro TDAH 2e. Kairos, o momento oportuno.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kairos",
  },
  openGraph: {
    title: "Kairos — Momento certo para agir",
    description: "Sistema de produtividade construído para o cérebro TDAH 2e.",
    type: "website",
    locale: "pt_BR",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5eedd",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster richColors position="top-center" theme="light" />
        <PWARegister />
      </body>
    </html>
  )
}
