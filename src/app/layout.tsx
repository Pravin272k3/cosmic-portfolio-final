import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import CustomCursor from '@/components/CustomCursor'
import StarfieldBackground from '@/components/StarfieldBackground'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export const metadata = {
  title: "Pravin's Portfolio",
  description: 'A unique and creative portfolio with an advanced futuristic look',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} bg-black text-white overflow-x-hidden`}>
        <StarfieldBackground />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}

