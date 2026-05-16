'use client'

import { ExternalLink, Trash2 } from 'lucide-react'

import type { Note } from '@/types/models'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'

import { useDeleteNote } from '@/hooks/useNotes'

const typeLabels: Record<Note['type'], string> = {

  text: 'টেক্সট',

  pdf: 'পিডিএফ',

  url: 'লিংক',

  youtube: 'ইউটিউব',

}

export function NoteCard({ note }: { note: Note }) {

  const del = useDeleteNote()

  const remove = async () => {

    const ok = window.confirm(`"${note.title}" নোটটি মুছবেন?`)

    if (!ok) return

    await del.mutateAsync(note._id)

  }

  return (

    <Card>

      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">

        <div className="space-y-1">

          <Badge variant="secondary">{typeLabels[note.type]}</Badge>

          <CardTitle className="text-base">{note.title}</CardTitle>

        </div>

        <Button variant="ghost" size="icon" aria-label="মুছুন" type="button" onClick={() => void remove()}>

          <Trash2 className="h-4 w-4 text-destructive" />

        </Button>

      </CardHeader>

      <CardContent className="space-y-3 text-sm">

        {note.type === 'text' && note.content ? (

          <div className="rounded-md border bg-muted/40 p-3 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5" dangerouslySetInnerHTML={{ __html: note.content }} />

        ) : null}

        {note.type === 'pdf' && note.fileUrl ? (

          <iframe title={note.title} src={note.fileUrl} className="h-[520px] w-full rounded-md border" />

        ) : null}

        {note.type === 'youtube' && note.sourceUrl ? (

          <div className="aspect-video w-full overflow-hidden rounded-md border">

            <iframe title={note.title} src={note.sourceUrl} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />

          </div>

        ) : null}

        {note.type === 'url' && note.sourceUrl ? (

          <div className="space-y-2">

            {note.urlMetadata?.thumbnail ? (

              // eslint-disable-next-line @next/next/no-img-element

              <img src={note.urlMetadata.thumbnail} alt="" className="max-h-40 w-full rounded-md object-cover" />

            ) : null}

            <div>

              <p className="font-medium">{note.urlMetadata?.title ?? note.title}</p>

              {note.urlMetadata?.description ? <p className="text-xs text-muted-foreground">{note.urlMetadata.description}</p> : null}

              <Separator className="my-2" />

              <a href={note.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">

                লিংক খুলুন <ExternalLink className="h-3 w-3" />

              </a>

            </div>

          </div>

        ) : null}

      </CardContent>

    </Card>

  )

}
