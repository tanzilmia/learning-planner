'use client'

import bnLocale from '@fullcalendar/core/locales/bn'

import dayGridPlugin from '@fullcalendar/daygrid'

import interactionPlugin from '@fullcalendar/interaction'

import FullCalendar from '@fullcalendar/react'

import timeGridPlugin from '@fullcalendar/timegrid'

import type { CalendarEvent } from '@/types/models'

function mapEvents(events: CalendarEvent[]) {

  return events.map((ev) => {

    const start = new Date(ev.date)

    const end = new Date(start.getTime() + ev.duration * 60 * 1000)

    return {

      id: ev._id,

      title: `${ev.title}${ev.isCompleted ? ' ✓' : ''}`,

      start,

      end,

      extendedProps: { raw: ev },

      backgroundColor: ev.isCompleted ? '#15803d' : '#6366f1',

      borderColor: ev.isCompleted ? '#15803d' : '#4f46e5',

    }

  })

}

export function CalendarView({

  events,

  onDateClick,

  onEventClick,

  initialDate,

  onRangeChange,

}: {

  events: CalendarEvent[]

  onDateClick: (date: Date) => void

  onEventClick: (ev: CalendarEvent) => void

  initialDate?: Date

  onRangeChange?: (visibleStart: Date) => void

}) {

  return (

    <div className="rounded-lg border bg-card p-2 md:p-4">

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

        events={mapEvents(events)}

        datesSet={(arg) => onRangeChange?.(arg.view.currentStart)}

        dateClick={(info) => onDateClick(info.date)}

        eventClick={(info) => {

          const raw = info.event.extendedProps.raw as CalendarEvent | undefined

          if (raw) onEventClick(raw)

        }}

      />

    </div>

  )

}
