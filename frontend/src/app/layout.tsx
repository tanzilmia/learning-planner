import './globals.css'

import type { Metadata } from 'next'

import { Hind_Siliguri } from 'next/font/google'

import { auth } from '@/auth'

import { Providers } from './providers'

const hind = Hind_Siliguri({

  subsets: ['bengali', 'latin'],

  weight: ['400', '500', '600', '700'],

  variable: '--font-hind',

  display: 'swap',

})

export const metadata: Metadata = {

  title: 'নোটশালা',

  description: 'ব্যক্তিগত পড়াশোনার নোট ও সময়সূচী',

}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const session = await auth()

  return (

    <html lang="bn" suppressHydrationWarning>

      <body className={`${hind.variable} min-h-screen font-sans antialiased`}>

        <Providers session={session}>{children}</Providers>

      </body>

    </html>

  )

}
