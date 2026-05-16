import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { CalendarEvent } from '@/types/models'

export const calendarKeys = {

  all: ['calendar'] as const,

  month: (month: number, year: number) => [...calendarKeys.all, 'month', month, year] as const,

}

export function useCalendarEvents(month: number, year: number) {

  return useQuery({

    queryKey: calendarKeys.month(month, year),

    queryFn: async () => {

      const params = new URLSearchParams({ month: String(month), year: String(year) })

      const { data } = await api.get<{ events: CalendarEvent[] }>(`/calendar?${params.toString()}`)

      return data.events

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

    }) => {

      const { data } = await api.post<{ event: CalendarEvent }>('/calendar', payload)

      return data.event

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: calendarKeys.all })

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

      await qc.invalidateQueries({ queryKey: calendarKeys.all })

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

      await qc.invalidateQueries({ queryKey: calendarKeys.all })

    },

  })

}
