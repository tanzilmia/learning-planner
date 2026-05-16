import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { BackendUser } from '@/types/models'

export const authKeys = {

  me: ['auth', 'me'] as const,

}

export function useAuthMe(enabled = true) {

  return useQuery({

    enabled,

    queryKey: authKeys.me,

    retry: 2,

    retryDelay: 400,

    queryFn: async () => {

      const { data } = await api.get<{ user: BackendUser }>('/auth/me')

      return data.user

    },

  })

}

export function usePatchTheme() {

  const qc = useQueryClient()

  return useMutation({

    mutationFn: async (theme: 'light' | 'dark') => {

      const { data } = await api.patch<{ user: BackendUser }>('/auth/me', { theme })

      return data.user

    },

    onSuccess: async () => {

      await qc.invalidateQueries({ queryKey: authKeys.me })

    },

  })

}
