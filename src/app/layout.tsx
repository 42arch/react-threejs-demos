import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Three.js Demos',
  description: 'Three.js Demos',
  keywords: ['three.js', 'react-three-fiber', 'demos']
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(inter.className, 'h-[100vh] w-[100vw] overflow-x-hidden')}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
