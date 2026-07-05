import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/firebase.ts/auth-context'

// NOTE: Preview-only swap. This sandbox can't reach fonts.googleapis.com,
// so Geist/Geist Mono are swapped for local stacks purely so `next build`
// can run here. Revert to next/font/google (see original zip) when
// building anywhere with normal internet access.
const geistSans = { variable: '' }
const geistMono = { variable: '' }

export const metadata: Metadata = {
  title: 'Smart Health 360 — Predict. Prevent. Optimize.',
  description:
    'AI-powered PHC/CHC operating system for patients, doctors, pharmacists, and government officers. Real-time triage, bed finding, inventory optimization, and resource redistribution.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
