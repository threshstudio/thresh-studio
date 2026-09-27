import type { Metadata } from "next"
import { Outfit, JetBrains_Mono } from "next/font/google"
import { CursorProvider } from "@/components/cursor/CursorContext"
import { ConditionalPublicLayout } from "@/components/shared/ConditionalPublicLayout"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { cn } from "@/lib/utils"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://threshstudio.com"),
  title: "Thresh Studio",
  description: "Premium product branding & cinematic marketing videos",
  openGraph: {
    title: "Thresh Studio",
    description: "Premium product branding & cinematic marketing videos",
    url: "https://threshstudio.com",
    siteName: "Thresh Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thresh Studio Cover",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thresh Studio",
    description: "Premium product branding & cinematic marketing videos",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable
      )}
    >
      <body suppressHydrationWarning>
        {/* Global Cinematic Film Grain (Hardware Accelerated) */}
        <div
          className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>

        <QueryProvider>
          <ThemeProvider>
            <CursorProvider>
              <ConditionalPublicLayout>{children}</ConditionalPublicLayout>
            </CursorProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
