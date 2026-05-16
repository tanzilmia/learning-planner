import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { Subject } from '@/types/models'

export const subjectKeys = {

  all: ['subjects'] as const,

  list: () => [...subjectKeys.all, 'list'] as const,

}

export function useSubjects() {

  return useQuery({

    queryKey: subjectKeys.list(),

    queryFn: async () => {

      const { data } = await api.get<{ subjects: Subject[] }>('/subjects')

      return data.subjects

    },

  })

}

export function useCreateSubject() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (payload: { name: string; icon?: string; color?: string }) => {

      const { data } = await api.post<{ subject: Subject }>('/subjects', payload)

      return data.subject

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: subjectKeys.list() })

    },

  })

}

export function useUpdateSubject() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async ({ id, ...patch }: Partial<Subject> & { id: string }) => {

      const { data } = await api.put<{ subject: Subject }>(`/subjects/${id}`, patch)

      return data.subject

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: subjectKeys.list() })

    },

  })

}

export function useDeleteSubject() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (id: string) => {

      await api.delete(`/subjects/${id}`)

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: subjectKeys.list() })

    },

  })

}
