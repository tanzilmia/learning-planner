'use client'

import { useState } from 'react'

import type { Chapter } from '@/types/models'

import { TextNoteEditor } from '@/components/note/editors/TextNoteEditor'

import { Button } from '@/components/ui/button'

import { DialogFooter } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useCreateNote, useUploadFileNote } from '@/hooks/useNotes'

type FormTab = 'text' | 'file' | 'url' | 'youtube'

const FILE_ACCEPT =
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp'

function schedulePayload(studyLocal: string, deadlineDay: string) {
  const studyAt = studyLocal.trim() ? new Date(studyLocal.trim()).toISOString() : undefined
  const practiceDeadline = deadlineDay.trim() ? deadlineDay.trim() : undefined

  return { studyAt, practiceDeadline }
}

export function NoteForm({
  subjectId,
  chapterId,
  chapters,
  onDone,
}: {
  subjectId: string
  chapterId?: string | null
  chapters: Chapter[] | undefined
  onDone: () => void
}) {
  const create = useCreateNote()
  const uploadFile = useUploadFileNote()

  const [tab, setTab] = useState<FormTab>('text')
  const [title, setTitle] = useState('')
  const [chapterPick, setChapterPick] = useState<string>(chapterId ?? '')
  const [html, setHtml] = useState('<p></p>')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [pct, setPct] = useState(0)

  const [studyLocal, setStudyLocal] = useState('')
  const [deadlineDay, setDeadlineDay] = useState('')

  const resolvedChapter = chapterPick ? chapterPick : null
  const sch = schedulePayload(studyLocal, deadlineDay)

  const resetForm = () => {
    setTitle('')
    setHtml('<p></p>')
    setUrl('')
    setFile(null)
    setPct(0)
    setStudyLocal('')
    setDeadlineDay('')
  }

  const submit = async () => {
    if (!title.trim()) return

    const { studyAt, practiceDeadline } = sch

    if (tab === 'text') {
      await create.mutateAsync({
        subjectId,
        chapterId: resolvedChapter,
        type: 'text',
        title: title.trim(),
        content: html,
        studyAt,
        practiceDeadline,
      })
    } else if (tab === 'url') {
      await create.mutateAsync({
        subjectId,
        chapterId: resolvedChapter,
        type: 'url',
        title: title.trim(),
        sourceUrl: url.trim(),
        studyAt,
        practiceDeadline,
      })
    } else if (tab === 'youtube') {
      await create.mutateAsync({
        subjectId,
        chapterId: resolvedChapter,
        type: 'youtube',
        title: title.trim(),
        sourceUrl: url.trim(),
        studyAt,
        practiceDeadline,
      })
    } else if (tab === 'file') {
      if (!file) return
      await uploadFile.mutateAsync({
        subjectId,
        chapterId: resolvedChapter,
        title: title.trim(),
        file,
        studyAt,
        practiceDeadline,
        onProgress: setPct,
      })
    }

    resetForm()

    onDone()
  }

  const busy = create.isPending || uploadFile.isPending

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="note-title">শিরোনাম</Label>
          <Input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="note-ch">অধ্যায় (ঐচ্ছিক)</Label>
          <select
            id="note-ch"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={chapterPick}
            onChange={(e) => setChapterPick(e.target.value)}
          >
            <option value="">অধ্যায় ছাড়া</option>
            {chapters?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg border bg-muted/20 p-3 sm:col-span-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ক্যালেন্ডার ও ডেডলাইন</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nf-study">পড়াশোনার তারিখ ও সময়</Label>
              <Input id="nf-study" type="datetime-local" value={studyLocal} onChange={(e) => setStudyLocal(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">সেট করলে মাসভিত্তিক ক্যালেন্ডারে বেগুনি ব্লক হিসেবে দেখা যাবে।</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nf-dead">প্র্যাক্টিস ডেডলাইন (তারিখ)</Label>
              <Input id="nf-dead" type="date" value={deadlineDay} onChange={(e) => setDeadlineDay(e.target.value)} />
              <p className="text-[11px] text-muted-foreground">ডেডলাইন থাকলে ক্যালেন্ডারে কমলা দিন ও এখানে বাকি দিন গণনা।</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as FormTab)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
          <TabsTrigger value="text" className="text-xs sm:text-sm">
            টেক্সট
          </TabsTrigger>
          <TabsTrigger value="file" className="text-xs sm:text-sm">
            ফাইল
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs sm:text-sm">
            লিংক
          </TabsTrigger>
          <TabsTrigger value="youtube" className="text-xs sm:text-sm">
            ইউটিউব
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-2 pt-3">
          <Label>বিবরণ</Label>
          <TextNoteEditor value={html} onChange={setHtml} />
        </TabsContent>

        <TabsContent value="file" className="space-y-2 pt-3">
          <Label htmlFor="note-file">ছবি, পিডিএফ বা ওয়ার্ড (.doc / .docx)</Label>
          <Input id="note-file" type="file" accept={FILE_ACCEPT} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <p className="text-xs text-muted-foreground">
            সর্বোচ্চ ১৫ মেগাবাইট। আপলোডের পর ধরন স্বয়ংক্রিয়ভাবে নির্ধারিত হবে।
          </p>
          {pct > 0 && pct < 100 ? <p className="text-xs text-muted-foreground">আপলোড: {pct}%</p> : null}
        </TabsContent>

        <TabsContent value="url" className="space-y-2 pt-3">
          <Label htmlFor="url-field">ওয়েব ঠিকানা</Label>
          <Input id="url-field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
        </TabsContent>

        <TabsContent value="youtube" className="space-y-2 pt-3">
          <Label htmlFor="yt-field">ইউটিউব লিংক</Label>
          <Input id="yt-field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtube.com/..." />
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="button" disabled={busy} onClick={() => void submit()}>
          {busy ? 'সংরক্ষণ হচ্ছে...' : 'নোট সংরক্ষণ করুন'}
        </Button>
      </DialogFooter>
    </div>
  )
}
