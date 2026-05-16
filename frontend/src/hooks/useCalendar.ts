import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { CalendarEvent, CalendarNoteSlot } from '@/types/models'

export const calendarKeys = {

  all: ['calendar'] as const,

  month: (month: number, year: number) => [...calendarKeys.all, 'month', month, year] as const,

}

export type CalendarMonthData = { events: CalendarEvent[]; noteSlots: CalendarNoteSlot[] }

export function useCalendarEvents(month: number, year: number) {

  return useQuery({

    queryKey: calendarKeys.month(month, year),

    queryFn: async () => {

      const params = new URLSearchParams({ month: String(month), year: String(year) })

      const { data } = await api.get<{ events: CalendarEvent[]; noteSlots?: CalendarNoteSlot[] }>(

        `/calendar?${params.toString()}`,

      )

      return { events: data.events, noteSlots: data.noteSlots ?? [] }

    },

  })

}

export function useCreateCalendarEvent() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: {

      subjectId: string

      title: string

      date: string

      duration?: number

      note?: string

      linkedNoteId?: string

      linkedKind?: 'study' | 'deadline'

    }) => {

      const { data } = await api.post<{ event: CalendarEvent }>('/calendar', payload)

      return data.event

    },

    onSuccess: async () => {

      await Promise.all([
        qc.invalidateQueries({ queryKey: calendarKeys.all }),
        qc.invalidateQueries({ queryKey: ['notes'] }),
      ])

    },

  })

}

export function useUpdateCalendarEvent() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: {

      id: string

      title?: string

      date?: string

      duration?: number

      isCompleted?: boolean

      note?: string

      subjectId?: string

    }) => {

      const { id, ...patch } = payload

      const { data } = await api.put<{ event: CalendarEvent }>(`/calendar/${id}`, patch)

      return data.event

    },

    onSuccess: async () => {

      await Promise.all([
        qc.invalidateQueries({ queryKey: calendarKeys.all }),
        qc.invalidateQueries({ queryKey: ['notes'] }),
      ])

    },

  })

}

export function useDeleteCalendarEvent() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (id: string) => {

      await api.delete(`/calendar/${id}`)

    },

    onSuccess: async () => {

      await Promise.all([
        qc.invalidateQueries({ queryKey: calendarKeys.all }),
        qc.invalidateQueries({ queryKey: ['notes'] }),
      ])

    },

  })

}
