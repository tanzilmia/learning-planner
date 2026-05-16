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

const FILTERS = ['all', 'text', 'pdf', 'url', 'youtube'] as const

const FILTER_LABELS: Record<(typeof FILTERS)[number], string> = {
  all: 'সব',
  text: 'টেক্সট',
  pdf: 'পিডিএফ',
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
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            ড্যাশবোর্ড
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{subject?.name ?? 'বিষয়'}</h1>
          <p className="text-sm text-muted-foreground">ধারা ও নোট পরিচালনা করুন।</p>
        </div>
        <Button type="button" className="gap-2" onClick={() => setNoteOpen(true)}>
          <Plus className="h-4 w-4" />
          নতুন নোট
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ChapterSidebar subjectId={subjectId} chapters={chapters} onCreate={() => setChOpen(true)} />

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((key) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={noteTab === key ? 'default' : 'outline'}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন ধারা</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="ch-title">ধারার শিরোনাম</Label>
            <Input id="ch-title" value={chTitle} onChange={(e) => setChTitle(e.target.value)} />
          </div>
          <Button type="button" onClick={() => void submitChapter()} disabled={createChapter.isPending}>
            সংরক্ষণ
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>নতুন নোট</DialogTitle>
          </DialogHeader>
          <NoteForm subjectId={subjectId} chapterId={chapterId ?? null} chapters={chapters} onDone={() => setNoteOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
