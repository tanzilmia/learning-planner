'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { CalendarView } from '@/components/calendar/CalendarView'

import { EventForm } from '@/components/calendar/EventForm'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import {

  useCalendarEvents,

  useCreateCalendarEvent,

  useDeleteCalendarEvent,

  useUpdateCalendarEvent,

} from '@/hooks/useCalendar'

import { useSubjects } from '@/hooks/useSubjects'

import type { CalendarEvent, CalendarNoteSlot } from '@/types/models'

export default function CalendarPage() {

  const router = useRouter()

  const today = useMemo(() => new Date(), [])

  const [cursor, setCursor] = useState(() => ({ month: today.getMonth() + 1, year: today.getFullYear() }))

  const { data: calendarData } = useCalendarEvents(cursor.month, cursor.year)

  const events = calendarData?.events ?? []

  const noteSlots = calendarData?.noteSlots ?? []

  const { data: subjects } = useSubjects()

  const createEv = useCreateCalendarEvent()

  const updateEv = useUpdateCalendarEvent()

  const deleteEv = useDeleteCalendarEvent()

  const [open, setOpen] = useState(false)

  const [editing, setEditing] = useState<CalendarEvent | null>(null)

  const [picked, setPicked] = useState<Date | null>(null)

  const close = () => {

    setOpen(false)

    setEditing(null)

    setPicked(null)

  }

  const goNote = (slot: CalendarNoteSlot) => {

    if (slot.chapterId) {

      router.push(`/subject/${slot.subjectId}/chapter/${slot.chapterId}`)

      return

    }

    router.push(`/subject/${slot.subjectId}`)

  }

  return (

    <div className="mx-auto max-w-6xl space-y-4">

      <div>

        <h1 className="text-2xl font-semibold">পড়াশোনার ক্যালেন্ডার</h1>

        <p className="text-sm text-muted-foreground">

          মাস ও সপ্তাহ ভিউতে হাতে যোগ করা ইভেন্ট (নীল·সবুজ) ও নোট থেকে দেওয়া সময় মিলিয়ে দেখুন।

          নোটের পড়াশোনার সময় বেগুনি, ডেডলাইন কমলা ব্লক — ক্লিক করলে সেই বিষয়ে নিয়ে যাবে।

        </p>

      </div>

      <CalendarView

        events={events}

        noteSlots={noteSlots}

        initialDate={today}

        onRangeChange={(start) => {

          setCursor({ month: start.getMonth() + 1, year: start.getFullYear() })

        }}

        onDateClick={(date) => {

          setEditing(null)

          setPicked(date)

          setOpen(true)

        }}

        onCalendarEventClick={(ev) => {

          setEditing(ev)

          setPicked(null)

          setOpen(true)

        }}

        onNoteSlotClick={(slot) => goNote(slot)}

      />

      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">

          <DialogHeader>

            <DialogTitle>{editing ? 'ইভেন্ট সম্পাদনা' : 'নতুন ইভেন্ট'}</DialogTitle>

          </DialogHeader>

          <EventForm

            subjects={subjects}

            editing={editing}

            initialDate={picked}

            onCancel={close}

            onCreate={async (payload) => {

              await createEv.mutateAsync(payload)

            }}

            onUpdate={async (payload) => {

              await updateEv.mutateAsync(payload)

            }}

            onDelete={async (id) => {

              await deleteEv.mutateAsync(id)

            }}

          />

        </DialogContent>

      </Dialog>

    </div>

  )

}
