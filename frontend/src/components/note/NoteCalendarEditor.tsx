'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import type { Note } from '@/types/models'

import { Button } from '@/components/ui/button'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { useUpdateNote } from '@/hooks/useNotes'

import { deadlineIsoToDateInput, studyIsoToDatetimeLocal } from '@/lib/note-schedule-display'

export function NoteCalendarEditor({
  note,
  open,
  onOpenChange,
}: {

  note: Note

  open: boolean

  onOpenChange: (open: boolean) => void

}) {

  const update = useUpdateNote()

  const [studyLocal, setStudyLocal] = useState('')

  const [deadlineDay, setDeadlineDay] = useState('')

  useEffect(() => {

    if (!open) return

    setStudyLocal(studyIsoToDatetimeLocal(note.studyAt))

    setDeadlineDay(deadlineIsoToDateInput(note.practiceDeadline))

  }, [open, note.studyAt, note.practiceDeadline])

  const save = async () => {

    await update.mutateAsync({

      id: note._id,

      studyAt: studyLocal.trim() ? new Date(studyLocal).toISOString() : null,

      practiceDeadline: deadlineDay.trim() ? deadlineDay.trim() : null,

    })

    onOpenChange(false)

  }

  const clearAll = async () => {

    setStudyLocal('')

    setDeadlineDay('')

    await update.mutateAsync({ id: note._id, studyAt: null, practiceDeadline: null })

    onOpenChange(false)

  }

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="mx-4 max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto sm:mx-auto sm:max-w-md">

        <DialogHeader>

          <DialogTitle>ক্যালেন্ডার ও ডেডলাইন সূচী</DialogTitle>

        </DialogHeader>

        <p className="text-xs text-muted-foreground">

          পড়াশোনার তারিখ-সময় ও প্র্যাক্টিস ডেডলাইন সেট করলে এই নোট <Link href="/calendar" className="text-primary underline">ক্যালেন্ডার ভিউ</Link>-তে দেখা যাবে এবং কার্ডে বাকি দিন গণনা হবে।

        </p>

        <div className="grid gap-3">

          <div className="space-y-2">

            <Label htmlFor="study-at">পড়াশোনার তারিখ ও সময়</Label>

            <Input id="study-at" type="datetime-local" value={studyLocal} onChange={(e) => setStudyLocal(e.target.value)} />

          </div>

          <div className="space-y-2">

            <Label htmlFor="deadline-day">প্র্যাক্টিস ডেডলাইন (শুধু তারিখ)</Label>

            <Input id="deadline-day" type="date" value={deadlineDay} onChange={(e) => setDeadlineDay(e.target.value)} />

          </div>

        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">

          <Button type="button" variant="ghost" disabled={update.isPending} onClick={() => void clearAll()}>

            তারিখ সরান

          </Button>

          <Button type="button" disabled={update.isPending} onClick={() => void save()}>

            সংরক্ষণ

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>

  )

}
