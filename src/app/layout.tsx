import type { Metadata, Viewport } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
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

export const metadata: Metadata = {
  title: "Foco — Produtividade para TDAH",
  description: "Um sistema de produtividade construído para o cérebro TDAH 2e. Sem força de vontade. Com estrutura.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Foco",
  },
  openGraph: {
    title: "Foco — Produtividade para TDAH",
    description: "Sistema de produtividade construído para o cérebro TDAH 2e.",
    type: "website",
    locale: "pt_BR",
  },
}

export const viewport: Viewport = {
  themeColor: "#f5ecde",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster richColors position="top-center" theme="light" />
        <PWARegister />
      </body>
    </html>
  )
}
