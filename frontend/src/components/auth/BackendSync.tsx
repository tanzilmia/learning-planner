'use client'

import { useQueryClient } from '@tanstack/react-query'

import { useSession } from 'next-auth/react'

import { useEffect, useRef } from 'react'

import { authKeys } from '@/hooks/useAuthMe'

export function BackendSync() {

  const { status } = useSession()

  const qc = useQueryClient()

  const ran = useRef(false)

  useEffect(() => {

    if (status !== 'authenticated' || ran.current) return

    ran.current = true

    void (async () => {

      try {

        const res = await fetch('/api/auth/sync-backend', { method: 'POST' })

        if (!res.ok) {

          console.warn('[BackendSync]', await res.text())

          return

        }

        await qc.invalidateQueries({ queryKey: authKeys.me })

      } catch (err) {

        console.warn('[BackendSync]', err)

      }

    })()

  }, [qc, status])

  return null

}
