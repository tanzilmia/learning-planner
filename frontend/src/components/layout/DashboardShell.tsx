'use client'

import { BackendSync } from '@/components/auth/BackendSync'

import { Header } from '@/components/layout/Header'

import { MobileNav } from '@/components/layout/MobileNav'

import { Sidebar } from '@/components/layout/Sidebar'

export function DashboardShell({ children }: { children: React.ReactNode }) {

  return (

    <div className="flex min-h-screen">

      <BackendSync />

      <MobileNav />

      <Sidebar className="hidden md:flex md:w-64 md:flex-shrink-0" />

      <div className="flex min-h-screen flex-1 flex-col">

        <Header />

        <main className="flex-1 bg-muted/30 p-4 md:p-6">{children}</main>

      </div>

    </div>

  )

}
