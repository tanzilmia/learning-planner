'use client'

import { useEffect, useMemo, useState } from 'react'

import type { CalendarEvent } from '@/types/models'

import type { Subject } from '@/types/models'

import { Button } from '@/components/ui/button'

import { DialogFooter } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'

import { Textarea } from '@/components/ui/textarea'

import { useNotes } from '@/hooks/useNotes'

function toLocalInputValue(d: Date) {

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

}

export function EventForm({

  subjects,

  initialDate,

  editing,

  onCancel,

  onCreate,

  onUpdate,

  onDelete,

}: {

  subjects: Subject[] | undefined

  initialDate?: Date | null

  editing: CalendarEvent | null

  onCancel: () => void

  onCreate: (payload: {

    subjectId: string
    title: string
    date: string
    duration: number
    note?: string
    linkedNoteId?: string
    linkedKind?: 'study' | 'deadline'
  }) => Promise<void>

  onUpdate: (payload: {

    id: string

    title?: string

    date?: string

    duration?: number

    note?: string

    isCompleted?: boolean

    subjectId?: string

  }) => Promise<void>

  onDelete: (id: string) => Promise<void>

}) {

  const initialSubject = editing?.subjectId ?? subjects?.[0]?._id ?? ''

  const [subjectId, setSubjectId] = useState(initialSubject)

  const [title, setTitle] = useState(editing?.title ?? '')

  const [when, setWhen] = useState(() =>

    editing ? toLocalInputValue(new Date(editing.date)) : initialDate ? toLocalInputValue(initialDate) : toLocalInputValue(new Date()),

  )

  const [duration, setDuration] = useState(editing?.duration ?? 60)

  const [note, setNote] = useState(editing?.note ?? '')

  const [done, setDone] = useState(editing?.isCompleted ?? false)

  const [linkNoteId, setLinkNoteId] = useState('')

  const [linkKind, setLinkKind] = useState<'study' | 'deadline'>('study')

  const { data: notesList } = useNotes({ subjectId, type: 'all' })

  const notes = notesList ?? []

  const subjectLocked = Boolean(editing?.linkedNoteId)

  const editingLinkedNoteLabel = editing?.linkedNoteId
    ? notes.find((n) => n._id === editing.linkedNoteId)?.title ?? '…'

    : null

  useEffect(() => {

    setSubjectId(editing?.subjectId ?? subjects?.[0]?._id ?? '')

    setTitle(editing?.title ?? '')

    setWhen(

      editing ? toLocalInputValue(new Date(editing.date)) : initialDate ? toLocalInputValue(initialDate) : toLocalInputValue(new Date()),

    )

    setDuration(editing?.duration ?? 60)

    setNote(editing?.note ?? '')

    setDone(editing?.isCompleted ?? false)

    if (editing?.linkedNoteId) {

      setLinkNoteId(editing.linkedNoteId)

      setLinkKind(editing.linkedKind === 'deadline' ? 'deadline' : 'study')

    } else {

      setLinkNoteId('')

      setLinkKind('study')

    }

  }, [editing, initialDate, subjects])

  const busyLabel = useMemo(() => (editing ? 'হালনাগাদ' : 'তৈরি করুন'), [editing])

  const submit = async () => {

    if (!subjectId || !title.trim()) return

    const iso = new Date(when).toISOString()

    if (editing) {

      await onUpdate({

        id: editing._id,

        subjectId,

        title: title.trim(),

        date: iso,

        duration,

        note: note.trim() || undefined,

        isCompleted: done,

      })

    } else {

      await onCreate({

        subjectId,

        title: title.trim(),

        date: iso,

        duration,

        note: note.trim() || undefined,

        ...(linkNoteId ? { linkedNoteId: linkNoteId, linkedKind: linkKind } : {}),

      })

    }

    onCancel()

  }

  const remove = async () => {

    if (!editing) return

    const ok = window.confirm('এই ইভেন্টটি মুছবেন?')

    if (!ok) return

    await onDelete(editing._id)

    onCancel()

  }

  return (

    <div className="space-y-3">

      <div className="space-y-2">

        <Label>বিষয়</Label>

        <select

          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60"

          value={subjectId}

          disabled={subjectLocked}

          onChange={(e) => {

            setSubjectId(e.target.value)

            setLinkNoteId('')

          }}

        >

          <option value="">বিষয় বেছে নিন</option>

          {subjects?.map((s) => (

            <option key={s._id} value={s._id}>

              {s.icon} {s.name}

            </option>

          ))}

        </select>

        {subjectLocked ? (

          <p className="text-xs text-muted-foreground">

            এই ইভেন্টটি একটি নোটের সাথে লিঙ্ক — বিষয় পরিবর্তন করা যাবে না।

          </p>

        ) : null}

      </div>

      {editing?.linkedNoteId ? (

        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">

          <span className="text-muted-foreground">লিঙ্ক করা নোট · </span>

          <span className="font-medium">{editingLinkedNoteLabel}</span>

          <span className="text-muted-foreground"> · </span>

          {linkKind === 'deadline' ? 'ডেডলাইন' : 'পড়াশোনার সময়'}

        </div>

      ) : null}

      {!editing ? (

        <div className="space-y-2">

          <Label htmlFor="ev-link-note">নোট (ঐচ্ছিক)</Label>

          <select

            id="ev-link-note"

            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

            value={linkNoteId}

            onChange={(e) => setLinkNoteId(e.target.value)}

          >

            <option value="">নয় · শুধু ক্যালেন্ডারে রাখুন</option>

            {notes.map((n) => (

              <option key={n._id} value={n._id}>

                {n.title}

              </option>

            ))}

          </select>

          {linkNoteId ? (

            <div className="flex flex-wrap gap-4 rounded-md bg-muted/30 px-3 py-2 text-sm">

              <span className="w-full shrink-0 text-muted-foreground">নোটে কী সময় লিঙ্ক করবেন:</span>

              <label className="flex cursor-pointer items-center gap-2">

                <input

                  type="radio"

                  name="ev-link-kind"

                  checked={linkKind === 'study'}

                  onChange={() => setLinkKind('study')}

                />

                পড়াশোনার সময়

              </label>

              <label className="flex cursor-pointer items-center gap-2">

                <input type="radio" name="ev-link-kind" checked={linkKind === 'deadline'} onChange={() => setLinkKind('deadline')} />

                ডেডলাইন (দিন)

              </label>

            </div>

          ) : null}

        </div>

      ) : null}

      <div className="space-y-2">

        <Label htmlFor="ev-title">শিরোনাম</Label>

        <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} />

      </div>

      <div className="grid gap-3 sm:grid-cols-2">

        <div className="space-y-2">

          <Label htmlFor="ev-when">শুরুর সময়</Label>

          <Input id="ev-when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />

        </div>

        <div className="space-y-2">

          <Label htmlFor="ev-dur">সময়কাল (মিনিট)</Label>

          <Input id="ev-dur" type="number" min={15} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

        </div>

      </div>

      <div className="space-y-2">

        <Label htmlFor="ev-note">বিবরণ</Label>

        <Textarea id="ev-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />

      </div>

      {editing ? (

        <label className="flex items-center gap-2 text-sm">

          <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />

          সম্পন্ন হয়েছে

        </label>

      ) : null}

      <Separator />

      <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">

        <div className="flex gap-2">

          <Button type="button" variant="outline" onClick={onCancel}>

            বাতিল

          </Button>

          {editing ? (

            <Button type="button" variant="destructive" onClick={() => void remove()}>

              মুছুন

            </Button>

          ) : null}

        </div>

        <Button type="button" onClick={() => void submit()}>

          {busyLabel}

        </Button>

      </DialogFooter>

    </div>

  )

}
