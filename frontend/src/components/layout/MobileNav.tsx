'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { CalendarDays, Gauge, LayoutDashboard, Settings } from 'lucide-react'

import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'

import { useUiStore } from '@/store/uiStore'

import { cn } from '@/lib/utils'

const links = [

  { href: '/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },

  { href: '/calendar', label: 'ক্যালেন্ডার', icon: CalendarDays },

  { href: '/progress', label: 'অগ্রগতি', icon: Gauge },

  { href: '/settings', label: 'সেটিংস', icon: Settings },

]

export function MobileNav() {

  const pathname = usePathname()

  const open = useUiStore((s) => s.sidebarOpen)

  const setOpen = useUiStore((s) => s.setSidebarOpen)

  return (

    <Sheet open={open} onOpenChange={setOpen}>

      <SheetContent side="left" className="w-[280px] p-0">

        <SheetHeader className="border-b px-4 py-3 text-left text-lg font-semibold">মেনু</SheetHeader>

        <nav className="flex flex-col gap-1 p-3">

          {links.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard' || pathname.startsWith('/subject')
                : pathname === href || pathname.startsWith(`${href}/`)

            return (

              <Link

                key={href}

                href={href}

                onClick={() => setOpen(false)}

                className={cn(

                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',

                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted',

                )}

              >

                <Icon className="h-4 w-4" />

                {label}

              </Link>

            )

          })}

        </nav>

      </SheetContent>

    </Sheet>

  )

}
