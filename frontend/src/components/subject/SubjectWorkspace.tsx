'use client'

import Link from 'next/link'

import { ArrowLeft, Plus } from 'lucide-react'

import { useMemo, useState } from 'react'

import { ChapterSidebar } from '@/components/chapter/ChapterSidebar'

import { NoteForm } from '@/components/note/NoteForm'

import { NoteList } from '@/components/note/NoteList'

import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { useChapters, useCreateChapter } from '@/hooks/useChapters'

import { useNotes } from '@/hooks/useNotes'

import { useSubjects } from '@/hooks/useSubjects'

import { useUiStore } from '@/store/uiStore'

const FILTERS = ['all', 'text', 'file', 'url', 'youtube'] as const

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  all: 'সব',
  text: 'টেক্সট',
  file: 'ফাইল',
  url: 'লিংক',
  youtube: 'ইউটিউব',
}

export default function SubjectWorkspace({
  subjectId,
  chapterId,
}: {
  subjectId: string
  chapterId?: string
}) {
  const { data: subjects } = useSubjects()
  const subject = useMemo(() => subjects?.find((s) => s._id === subjectId), [subjects, subjectId])
  const { data: chapters } = useChapters(subjectId)
  const noteTab = useUiStore((s) => s.noteTab)
  const setNoteTab = useUiStore((s) => s.setNoteTab)
  const { data: notes, isLoading } = useNotes({ subjectId, chapterId, type: noteTab })

  const createChapter = useCreateChapter()

  const [chOpen, setChOpen] = useState(false)
  const [chTitle, setChTitle] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)

  const submitChapter = async () => {
    if (!chTitle.trim()) return
    await createChapter.mutateAsync({ subjectId, title: chTitle.trim() })
    setChTitle('')
    setChOpen(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              ড্যাশবোর্ড
            </Link>
          </Button>
          <div className="min-w-0 flex-1 sm:flex-none">
            <h1 className="truncate text-xl font-semibold sm:text-2xl">{subject?.name ?? 'বিষয়'}</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">অধ্যায় ও নোট পরিচালনা করুন।</p>
          </div>
        </div>
        <Button type="button" className="gap-2 self-start sm:self-auto" size="sm" onClick={() => setNoteOpen(true)}>
          <Plus className="h-4 w-4" />
          নতুন নোট
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <ChapterSidebar subjectId={subjectId} chapters={chapters} onCreate={() => setChOpen(true)} />

        <div className="min-w-0 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTERS.map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={noteTab === key ? 'default' : 'outline'}
                className="whitespace-nowrap shrink-0"
                onClick={() => setNoteTab(key)}
              >
                {FILTER_LABELS[key]}
              </Button>
            ))}
          </div>
          <NoteList notes={notes} isLoading={isLoading} />
        </div>
      </div>

      <Dialog open={chOpen} onOpenChange={setChOpen}>
        <DialogContent className="mx-4 max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto sm:mx-auto sm:max-h-[90vh] sm:w-full">
          <DialogHeader>
            <DialogTitle>নতুন অধ্যায়</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ch-title">অধ্যায়ের শিরোনাম</Label>
            <Input id="ch-title" value={chTitle} onChange={(e) => setChTitle(e.target.value)} />
          </div>
          <Button type="button" onClick={() => void submitChapter()} disabled={createChapter.isPending}>
            সংরক্ষণ
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="mx-4 flex max-h-[min(92dvh,900px)] w-[calc(100%-2rem)] flex-col overflow-hidden p-4 sm:mx-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:p-6">
          <DialogHeader className="shrink-0 text-left">
            <DialogTitle>নতুন নোট</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <NoteForm subjectId={subjectId} chapterId={chapterId ?? null} chapters={chapters} onDone={() => setNoteOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
