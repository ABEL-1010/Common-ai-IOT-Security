import type { Metadata } from "next"

import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "SentinelAI",
    template: "%s · SentinelAI",
  },
  description: "Cyber-physical infrastructure defense for IoT / OT fleets.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
