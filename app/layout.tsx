import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreHydrator from "@/components/StoreHydrator";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="p-0 m-0">
        <ThemeProvider>
          <StoreHydrator />
          <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-background text-foreground min-h-screen flex flex-col justify-between w-full">
              <div className="flex flex-col">
                <Header />
                {children}
              </div>
              <Footer />
            </div>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
