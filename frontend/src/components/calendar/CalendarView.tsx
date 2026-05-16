'use client'

import bnLocale from '@fullcalendar/core/locales/bn'

import type { EventClickArg, EventInput } from '@fullcalendar/core'

import dayGridPlugin from '@fullcalendar/daygrid'

import interactionPlugin from '@fullcalendar/interaction'

import FullCalendar from '@fullcalendar/react'

import timeGridPlugin from '@fullcalendar/timegrid'

import type { CalendarEvent, CalendarNoteSlot } from '@/types/models'

function mapScheduledEvents(events: CalendarEvent[] | null | undefined): EventInput[] {

  return (Array.isArray(events) ? events : []).map((ev) => {

    const start = new Date(ev.date)

    const end = new Date(start.getTime() + ev.duration * 60 * 1000)

    return {

      id: ev._id,

      title: `${ev.title}${ev.isCompleted ? ' ✓' : ''}`,

      start,

      end,

      extendedProps: { calendarEvent: ev as CalendarEvent },

      backgroundColor: ev.isCompleted ? '#15803d' : '#6366f1',

      borderColor: ev.isCompleted ? '#15803d' : '#4f46e5',

    }

  })

}

function clampTitle(t: string, max = 40) {

  if (t.length <= max) return t

  return `${t.slice(0, max - 1)}…`

}

function mapNoteSlots(slots: CalendarNoteSlot[] | null | undefined): EventInput[] {

  const list = Array.isArray(slots) ? slots : []

  return list.map((s) => {

    const prefix = s.slotType === 'deadline' ? '🎯 ডেডলাইন:' : '📘 পড়াশোনা:'

    const rawStart = new Date(s.date)

    if (Number.isNaN(rawStart.getTime())) {

      return null

    }

    if (s.slotType === 'deadline') {

      const isoDay = rawStart.toISOString().slice(0, 10)

      return {

        id: `nf-dead-${s.noteId}`,

        title: `${prefix} ${clampTitle(s.title)}`,

        start: isoDay,

        allDay: true,

        display: 'block',

        backgroundColor: '#ea580c',

        borderColor: '#c2410c',

        extendedProps: { noteSlot: s },

      }

    }

    const end = new Date(rawStart.getTime() + 90 * 60 * 1000)

    return {

      id: `nf-study-${s.noteId}-${rawStart.toISOString()}`,

      title: `${prefix} ${clampTitle(s.title)}`,

      start: rawStart,

      end,

      backgroundColor: '#7c3aed',

      borderColor: '#6d28d9',

      extendedProps: { noteSlot: s },

    }

  }).filter(Boolean) as EventInput[]

}

export function CalendarView({

  events,

  noteSlots,

  onDateClick,

  onCalendarEventClick,

  onNoteSlotClick,

  initialDate,

  onRangeChange,

}: {

  events?: CalendarEvent[] | null

  noteSlots?: CalendarNoteSlot[] | null

  onDateClick: (date: Date) => void

  onCalendarEventClick: (ev: CalendarEvent) => void

  onNoteSlotClick?: (slot: CalendarNoteSlot) => void

  initialDate?: Date

  onRangeChange?: (visibleStart: Date) => void

}) {

  const merged: EventInput[] = [...mapScheduledEvents(events), ...mapNoteSlots(noteSlots)]

  const handleEventClick = (info: EventClickArg) => {

    const noteSlot = info.event.extendedProps.noteSlot as CalendarNoteSlot | undefined

    if (noteSlot && onNoteSlotClick) {

      info.jsEvent.preventDefault()

      onNoteSlotClick(noteSlot)

      return

    }

    const calEv = info.event.extendedProps.calendarEvent as CalendarEvent | undefined

    if (calEv) onCalendarEventClick(calEv)

  }

  return (

    <div className="-mx-1 overflow-x-auto px-1 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">

      <div className="min-w-[304px] rounded-lg border bg-card p-2 md:min-w-0 md:p-4">

        <FullCalendar

          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}

          locale={bnLocale}

          initialDate={initialDate}

          headerToolbar={{

            left: 'prev,next today',

            center: 'title',

            right: 'dayGridMonth,timeGridWeek',

          }}

          height="auto"

          events={merged}

          datesSet={(arg) => onRangeChange?.(arg.view.currentStart)}

          dateClick={(clk) => onDateClick(clk.date)}

          eventClick={(info) => handleEventClick(info)}

        />

      </div>

    </div>

  )

}
