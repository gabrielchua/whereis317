import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Where is 317',
  description: 'Real-time bus arrival information for service 317',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <body className="dark:bg-gray-900 dark:text-white">{children}</body>
    </html>
  )
} 