'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import type { Session } from 'next-auth'

import { SessionProvider } from 'next-auth/react'

import { ThemeProvider } from 'next-themes'

import { useState } from 'react'

export function Providers({

  children,

  session,

}: {

  children: React.ReactNode

  session: Session | null

}) {

  const [client] = useState(

    () =>

      new QueryClient({

        defaultOptions: {

          queries: {

            staleTime: 30_000,

            refetchOnWindowFocus: false,

          },

        },

      }),

  )

  return (

    <SessionProvider session={session}>

      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

        <QueryClientProvider client={client}>

          {children}

          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />

        </QueryClientProvider>

      </ThemeProvider>

    </SessionProvider>

  )

}
