'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { Plus } from 'lucide-react'

import type { Chapter } from '@/types/models'

import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

export function ChapterSidebar({

  subjectId,

  chapters,

  onCreate,

}: {

  subjectId: string

  chapters: Chapter[] | undefined

  onCreate: () => void

}) {

  const pathname = usePathname()

  return (

    <div className="flex h-full flex-col rounded-lg border bg-card">

      <div className="flex items-center justify-between border-b px-3 py-2">

        <p className="text-sm font-semibold">অধ্যায়সমূহ</p>

        <Button size="sm" variant="outline" type="button" className="gap-1" onClick={onCreate}>

          <Plus className="h-4 w-4" />

          নতুন

        </Button>

      </div>

      <div className="flex-1 overflow-y-auto p-2">

        <Link

          href={`/subject/${subjectId}`}

          className={cn(

            'mb-1 block rounded-md px-3 py-2 text-sm',

            pathname === `/subject/${subjectId}` ? 'bg-primary/15 font-medium text-primary' : 'hover:bg-muted',

          )}

        >

          সব নোট

        </Link>

        <Separator className="my-2" />

        {!chapters?.length ? <p className="px-2 text-xs text-muted-foreground">কোনো অধ্যায় নেই।</p> : null}

        <ul className="space-y-1">

          {chapters?.map((ch) => {

            const href = `/subject/${subjectId}/chapter/${ch._id}`

            const active = pathname === href

            return (

              <li key={ch._id}>

                <Link href={href} className={cn('block rounded-md px-3 py-2 text-sm', active ? 'bg-muted font-medium' : 'hover:bg-muted/70')}>

                  {ch.title}

                </Link>

              </li>

            )

          })}

        </ul>

      </div>

    </div>

  )

}
