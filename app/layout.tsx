import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { MockAuthProvider } from '@/lib/mock-auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'MUKIIQ — Split Any Song Into Stems',
  description:
    'Separate vocals, drums, bass, and instruments from one track in a clean, simple workspace.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <MockAuthProvider>{children}</MockAuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
