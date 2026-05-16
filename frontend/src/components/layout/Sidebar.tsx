'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { BookOpen, CalendarDays, Gauge, LayoutDashboard, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'

const links = [

  { href: '/dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },

  { href: '/calendar', label: 'ক্যালেন্ডার', icon: CalendarDays },

  { href: '/progress', label: 'অগ্রগতি', icon: Gauge },

  { href: '/settings', label: 'সেটিংস', icon: Settings },

]

export function Sidebar({ className }: { className?: string }) {

  const pathname = usePathname()

  return (

    <aside className={cn('flex w-full flex-col gap-2 border-r bg-card p-4', className)}>

      <div className="mb-6 flex items-center gap-2 px-2">

        <BookOpen className="h-8 w-8 text-primary" />

        <div>

          <p className="text-lg font-semibold leading-tight">নোটশালা</p>

          <p className="text-xs text-muted-foreground">পড়াশোনার সাথী</p>

        </div>

      </div>

      <nav className="flex flex-col gap-1">

        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard' || pathname.startsWith('/subject')
              : pathname === href || pathname.startsWith(`${href}/`)

          return (

            <Link

              key={href}

              href={href}

              className={cn(

                'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',

                isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',

              )}

            >

              <Icon className="h-4 w-4" />

              {label}

            </Link>

          )

        })}

      </nav>

    </aside>

  )

}
