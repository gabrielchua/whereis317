import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where is 317 🚌',
  description: 'Real-time bus arrival information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-900 text-white min-h-screen">{children}</body>
    </html>
  )
} 