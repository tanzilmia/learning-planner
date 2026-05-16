'use client'

import Link from 'next/link'

import { useState } from 'react'

import { CalendarClock, ExternalLink, Trash2 } from 'lucide-react'

import type { Note } from '@/types/models'

import { NoteCalendarEditor } from '@/components/note/NoteCalendarEditor'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'

import { useDeleteNote } from '@/hooks/useNotes'

import { deadlineCountdownBn, formatDeadlineDateBn, formatStudyAtBn } from '@/lib/note-schedule-display'

const typeLabels: Record<Note['type'], string> = {
  text: 'টেক্সট',
  pdf: 'পিডিএফ',
  image: 'ছবি',
  document: 'ডকумент',
  url: 'লিংক',
  youtube: 'ইউটিউব',
}

const fileFrameClass = 'h-[min(70vh,520px)] min-h-[180px] w-full max-w-full rounded-md border border-border bg-muted/20'

export function NoteCard({ note }: { note: Note }) {
  const del = useDeleteNote()
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const remove = async () => {
    const ok = window.confirm(`"${note.title}" নোটটি মুছবেন?`)
    if (!ok) return

    await del.mutateAsync(note._id)
  }

  const deadlineLine = deadlineCountdownBn(note.practiceDeadline)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-4 sm:p-6">
        <div className="min-w-0 flex-1 space-y-1">
          <Badge variant="secondary">{typeLabels[note.type]}</Badge>
          <CardTitle className="break-words text-base">{note.title}</CardTitle>
        </div>

        <div className="flex shrink-0 gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary"
            type="button"
            aria-label="ক্যালেন্ডার ও ডেডলাইন সম্পাদনা"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarClock className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0" aria-label="মুছুন" type="button" onClick={() => void remove()}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 overflow-hidden p-4 pt-0 text-sm sm:p-6 sm:pt-0">
        {(note.studyAt || note.practiceDeadline) ? (
          <div className="space-y-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs sm:text-sm">
            {note.studyAt ? (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">পড়াশোনা সময় নির্ধারিত — </span>
                {formatStudyAtBn(note.studyAt)}
                <Link href="/calendar" className="ml-1 underline">
                  ক্যালেন্ডার দেখুন
                </Link>
              </p>
            ) : null}
            {note.practiceDeadline ? (
              <>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">প্র্যাক্টিস ডেডলাইন — </span>
                  {formatDeadlineDateBn(note.practiceDeadline)}
                </p>
                {deadlineLine ? <p className="font-medium text-orange-700 dark:text-orange-300">{deadlineLine}</p> : null}
              </>
            ) : null}
          </div>
        ) : null}

        {note.type === 'text' && note.content ? (
          <div
            className="rounded-md border bg-muted/40 p-3 text-sm leading-relaxed [&_img]:max-w-full [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        ) : null}

        {note.type === 'pdf' && note.fileUrl ? <iframe title={note.title} src={note.fileUrl} className={fileFrameClass} /> : null}

        {note.type === 'image' && note.fileUrl ? (
          <div className="flex justify-center overflow-hidden rounded-md border bg-muted/30 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={note.fileUrl}
              alt={note.title}
              className="max-h-[min(70vh,560px)] w-full max-w-full object-contain"
            />
          </div>
        ) : null}

        {note.type === 'document' && note.fileUrl ? (
          <div className="space-y-2">
            <iframe
              title={note.title}
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(note.fileUrl)}`}
              className={fileFrameClass}
              allowFullScreen
            />

            <a
              href={note.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              ডাউনলোড / নতুন ট্যাবে খুলুন <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        ) : null}

        {note.type === 'youtube' && note.sourceUrl ? (
          <div className="aspect-video w-full overflow-hidden rounded-md border">
            <iframe
              title={note.title}
              src={note.sourceUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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

              <a
                href={note.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                লিংক খুলুন <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : null}
      </CardContent>

      <NoteCalendarEditor note={note} open={scheduleOpen} onOpenChange={setScheduleOpen} />
    </Card>
  )
}
