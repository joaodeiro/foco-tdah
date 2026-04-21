import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import PWARegister from "@/components/layout/PWARegister"
import "./globals.css"

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "Foco — Produtividade para TDAH",
  description: "Sistema de produtividade construído para o cérebro TDAH 2e. Sem força de vontade. Com estrutura.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`dark ${nunito.variable} h-full antialiased`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-center" theme="dark" />
        <PWARegister />
      </body>
    </html>
  )
}
