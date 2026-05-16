'use client'

import { signOut } from 'next-auth/react'

import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuSeparator,

  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu'

import { useAuthMe } from '@/hooks/useAuthMe'

import { useUiStore } from '@/store/uiStore'

export function Header() {

  const { data: user } = useAuthMe()

  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen)

  return (

    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur">

      <div className="flex items-center gap-2">

        <Button variant="ghost" size="icon" className="md:hidden" type="button" onClick={() => setSidebarOpen(true)} aria-label="মেনু খুলুন">

          <Menu className="h-5 w-5" />

        </Button>

        <span className="text-sm font-medium text-muted-foreground md:hidden">নোটশালা</span>

      </div>

      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button variant="outline" size="sm" className="gap-2">

            <span className="hidden max-w-[160px] truncate sm:inline">{user?.name ?? 'প্রোফাইল'}</span>

            <span className="sm:hidden">প্রোফাইল</span>

          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">

          <div className="px-2 py-1.5 text-xs text-muted-foreground">

            <div className="truncate font-medium text-foreground">{user?.email}</div>

          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>

            <a href="/settings">সেটিংস</a>

          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => void signOut({ callbackUrl: '/login' })}>

            লগআউট

          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

    </header>

  )

}
