'use client'

import { useState } from 'react'

import type { Chapter } from '@/types/models'

import type { NoteType } from '@/types/models'

import { TextNoteEditor } from '@/components/note/editors/TextNoteEditor'

import { Button } from '@/components/ui/button'

import { DialogFooter } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useCreateNote, useUploadPdfNote } from '@/hooks/useNotes'

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

  const uploadPdf = useUploadPdfNote()

  const [tab, setTab] = useState<NoteType>('text')

  const [title, setTitle] = useState('')

  const [chapterPick, setChapterPick] = useState<string>(chapterId ?? '')

  const [html, setHtml] = useState('<p></p>')

  const [url, setUrl] = useState('')

  const [file, setFile] = useState<File | null>(null)

  const [pct, setPct] = useState(0)

  const resolvedChapter = chapterPick ? chapterPick : null

  const submit = async () => {

    if (!title.trim()) return

    if (tab === 'text') {

      await create.mutateAsync({ subjectId, chapterId: resolvedChapter, type: 'text', title: title.trim(), content: html })

    } else if (tab === 'url') {

      await create.mutateAsync({ subjectId, chapterId: resolvedChapter, type: 'url', title: title.trim(), sourceUrl: url.trim() })

    } else if (tab === 'youtube') {

      await create.mutateAsync({ subjectId, chapterId: resolvedChapter, type: 'youtube', title: title.trim(), sourceUrl: url.trim() })

    } else if (tab === 'pdf') {

      if (!file) return

      await uploadPdf.mutateAsync({

        subjectId,

        chapterId: resolvedChapter,

        title: title.trim(),

        file,

        onProgress: setPct,

      })

    }

    setTitle('')

    setHtml('<p></p>')

    setUrl('')

    setFile(null)

    setPct(0)

    onDone()

  }

  const busy = create.isPending || uploadPdf.isPending

  return (

    <div className="space-y-4">

      <div className="grid gap-3 sm:grid-cols-2">

        <div className="space-y-2 sm:col-span-2">

          <Label htmlFor="note-title">শিরোনাম</Label>

          <Input id="note-title" value={title} onChange={(e) => setTitle(e.target.value)} />

        </div>

        <div className="space-y-2 sm:col-span-2">

          <Label htmlFor="note-ch">ধারা (ঐচ্ছিক)</Label>

          <select

            id="note-ch"

            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

            value={chapterPick}

            onChange={(e) => setChapterPick(e.target.value)}

          >

            <option value="">ধারা ছাড়া</option>

            {chapters?.map((c) => (

              <option key={c._id} value={c._id}>

                {c.title}

              </option>

            ))}

          </select>

        </div>

      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as NoteType)}>

        <TabsList className="grid w-full grid-cols-4">

          <TabsTrigger value="text">টেক্সট</TabsTrigger>

          <TabsTrigger value="pdf">পিডিএফ</TabsTrigger>

          <TabsTrigger value="url">লিংক</TabsTrigger>

          <TabsTrigger value="youtube">ইউটিউব</TabsTrigger>

        </TabsList>

        <TabsContent value="text" className="space-y-2 pt-3">

          <Label>বিবরণ</Label>

          <TextNoteEditor value={html} onChange={setHtml} />

        </TabsContent>

        <TabsContent value="pdf" className="space-y-2 pt-3">

          <Label htmlFor="pdf-file">পিডিএফ ফাইল</Label>

          <Input id="pdf-file" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

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
