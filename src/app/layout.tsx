import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import "./globals.css"
import { Providers } from "@/components/providers"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: "Free Epic Games .gg | Track Every Free Epic Games Giveaway",
    template: "%s | Free Epic Games .gg",
  },
  description: "Track every free game ever offered on the Epic Games Store, monitor current giveaways with live countdown timers, manage your claimed library, and calculate total collection value.",
  keywords: [
    "Epic Games Store",
    "Free Games",
    "Epic Giveaways",
    "Game Tracker",
    "PC Gaming",
    "Freebie Archive",
    "Epic Vault",
  ],
  authors: [{ name: "Free Epic Games .gg Team" }],
  creator: "Free Epic Games .gg",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freeepicgames.gg",
    title: "Free Epic Games .gg | Complete Epic Store Giveaway Tracker",
    description: "Track current and historical free games offered on the Epic Games Store.",
    siteName: "Free Epic Games .gg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Epic Games .gg",
    description: "Track every free game ever offered on the Epic Games Store.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className={cn("min-h-screen bg-[#0a0a0a] font-sans text-[#ededed] antialiased flex flex-col")}>
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
