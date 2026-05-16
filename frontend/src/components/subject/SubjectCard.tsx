'use client'

import Link from 'next/link'

import { MoreVertical, Trash2 } from 'lucide-react'

import type { Subject } from '@/types/models'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from '@/components/ui/dropdown-menu'

import { useDeleteSubject } from '@/hooks/useSubjects'

import { cn } from '@/lib/utils'

export function SubjectCard({ subject, onPrefetch }: { subject: Subject; onPrefetch?: () => void }) {

  const remove = useDeleteSubject()

  const canDelete = !subject.isDefault

  const handleDelete = async () => {

    if (!canDelete) return

    const ok = window.confirm(`"${subject.name}" বিষয়টি মুছে ফেলতে চান?`)

    if (!ok) return

    await remove.mutateAsync(subject._id)

  }

  return (

    <Card

      className={cn('overflow-hidden border-l-[6px] transition-shadow hover:shadow-md')}

      style={{ borderLeftColor: subject.color }}

      onMouseEnter={() => onPrefetch?.()}

    >

      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">

        <div className="flex items-start gap-3">

          <span className="text-3xl leading-none">{subject.icon}</span>

          <div>

            <CardTitle className="text-lg">

              <Link href={`/subject/${subject._id}`} className="hover:underline">

                {subject.name}

              </Link>

            </CardTitle>

            {subject.isDefault ? <p className="text-xs text-muted-foreground">ডিফল্ট বিষয় — মুছে ফেলা যাবে না</p> : null}

          </div>

        </div>

        {canDelete ? (

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button variant="ghost" size="icon" aria-label="আরও বিকল্প">

                <MoreVertical className="h-4 w-4" />

              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => void handleDelete()}>

                <Trash2 className="mr-2 h-4 w-4" />

                বিষয় মুছুন

              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        ) : null}

      </CardHeader>

      <CardContent>

        <Link href={`/subject/${subject._id}`} className="text-sm font-medium text-primary hover:underline">

          বিস্তারিত ও নোট →

        </Link>

      </CardContent>

    </Card>

  )

}
