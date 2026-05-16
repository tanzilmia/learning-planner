import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { Chapter } from '@/types/models'

export const chapterKeys = {

  all: ['chapters'] as const,

  list: (subjectId: string) => [...chapterKeys.all, 'list', subjectId] as const,

}

export function useChapters(subjectId: string | undefined) {

  return useQuery({

    enabled: !!subjectId,

    queryKey: chapterKeys.list(subjectId ?? ''),

    queryFn: async () => {

      const { data } = await api.get<{ chapters: Chapter[] }>(`/subjects/${subjectId}/chapters`)

      return data.chapters

    },

  })

}

export function useCreateChapter() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async ({ subjectId, title }: { subjectId: string; title: string }) => {

      const { data } = await api.post<{ chapter: Chapter }>(`/subjects/${subjectId}/chapters`, { title })

      return data.chapter

    },

    onSuccess: async (_chapter, vars) => {

      await qc.invalidateQueries({ queryKey: chapterKeys.list(vars.subjectId) })

    },

  })

}

export function useUpdateChapter() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: { id: string; subjectId: string; title?: string; order?: number }) => {

      const { id, subjectId: _sid, ...patch } = payload

      const { data } = await api.put<{ chapter: Chapter }>(`/chapters/${id}`, patch)

      return { chapter: data.chapter, subjectId: payload.subjectId }

    },

    onSuccess: async ({ subjectId }) => {

      await qc.invalidateQueries({ queryKey: chapterKeys.list(subjectId) })

    },

  })

}

export function useDeleteChapter() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: { id: string; subjectId: string }) => {

      await api.delete(`/chapters/${payload.id}`)

      return payload.subjectId

    },

    onSuccess: async (subjectId) => {

      await qc.invalidateQueries({ queryKey: chapterKeys.list(subjectId) })

    },

  })

}
