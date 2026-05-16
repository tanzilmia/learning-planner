import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { ProgressRow, ProgressStatus } from '@/types/models'

export const progressKeys = {

  all: ['progress'] as const,

  list: (subjectId?: string) => [...progressKeys.all, 'list', subjectId ?? 'all'] as const,

  summary: () => [...progressKeys.all, 'summary'] as const,

}

export function useProgress(subjectId?: string) {

  return useQuery({

    queryKey: progressKeys.list(subjectId),

    queryFn: async () => {

      const qs = subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : ''

      const { data } = await api.get<{ progress: ProgressRow[] }>(`/progress${qs}`)

      return data.progress

    },

  })

}

export function useProgressSummary() {

  return useQuery({

    queryKey: progressKeys.summary(),

    queryFn: async () => {

      const { data } = await api.get<{ weeklyMinutes: number; monthlyMinutes: number }>('/progress/summary')

      return data

    },

  })

}

export function useCreateProgress() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: {

      subjectId: string

      chapterId?: string | null

      date: string

      minutesRead: number

      status: ProgressStatus

    }) => {

      const { data } = await api.post<{ progress: ProgressRow }>('/progress', payload)

      return data.progress

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: progressKeys.all })

    },

  })

}

export function useUpdateProgress() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: {

      id: string

      date?: string

      minutesRead?: number

      status?: ProgressStatus

      chapterId?: string | null

    }) => {

      const { id, ...patch } = payload

      const { data } = await api.put<{ progress: ProgressRow }>(`/progress/${id}`, patch)

      return data.progress

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: progressKeys.all })

    },

  })

}

export function useDeleteProgress() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (id: string) => {

      await api.delete(`/progress/${id}`)

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: progressKeys.all })

    },

  })

}
