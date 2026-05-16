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

  onCreate: (payload: { subjectId: string; title: string; date: string; duration: number; note?: string }) => Promise<void>

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

  useEffect(() => {

    setSubjectId(editing?.subjectId ?? subjects?.[0]?._id ?? '')

    setTitle(editing?.title ?? '')

    setWhen(

      editing ? toLocalInputValue(new Date(editing.date)) : initialDate ? toLocalInputValue(initialDate) : toLocalInputValue(new Date()),

    )

    setDuration(editing?.duration ?? 60)

    setNote(editing?.note ?? '')

    setDone(editing?.isCompleted ?? false)

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

      await onCreate({ subjectId, title: title.trim(), date: iso, duration, note: note.trim() || undefined })

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

          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"

          value={subjectId}

          onChange={(e) => setSubjectId(e.target.value)}

        >

          <option value="">বিষয় বেছে নিন</option>

          {subjects?.map((s) => (

            <option key={s._id} value={s._id}>

              {s.icon} {s.name}

            </option>

          ))}

        </select>

      </div>

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
