'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type LoginFormProps = {
  googleOAuthConfigured: boolean
}

export function LoginForm({ googleOAuthConfigured }: LoginFormProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  return (
    <Card className="w-full max-w-md border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">নোটশালায় স্বাগতম</CardTitle>
        <CardDescription>
          চালিয়ে যেতে গুগল দিয়ে লগইন করুন। অন্য কোনো লগইন পদ্ধতি নেই।
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {!googleOAuthConfigured ? (
          <div
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
            <strong className="block text-amber-700 dark:text-amber-300">গুগল ক্লায়েন্ট সেট করা নেই</strong>
            <p className="mt-2 text-muted-foreground">
              <code className="rounded bg-muted px-1">frontend/.env.local</code> ফাইলে গুগল OAuth ক্লায়েন্ট থেকে নেওয়া{' '}
              <code className="rounded bg-muted px-1">AUTH_GOOGLE_ID</code> ও{' '}
              <code className="rounded bg-muted px-1">AUTH_GOOGLE_SECRET</code>{' '}
              (একই ভ্যালুর জন্য নাম হিসেবে <code className="rounded bg-muted px-1">GOOGLE_CLIENT_ID</code> ও{' '}
              <code className="rounded bg-muted px-1">GOOGLE_CLIENT_SECRET</code> ও চালবে) বসান। অনুমোদিত রিডাইরেক্ট ইউআরআই:{' '}
              <code className="rounded bg-muted px-1">http://localhost:3000/api/auth/callback/google</code>{' '}
              — এরপর ফ্রন্টএন্ড ডেভ সার্ভার রিস্টার্ট করুন। <code className="rounded bg-muted px-1">backend/.env</code> এও একই গুগল ক্লায়েন্ট আইডি/সিক্রেট মেলান।
            </p>
          </div>
        ) : null}

        <Button
          className="w-full"
          type="button"
          disabled={!googleOAuthConfigured}
          onClick={() => void signIn('google', { callbackUrl })}>
          গুগল দিয়ে প্রবেশ করুন
        </Button>
      </CardContent>
    </Card>
  )
}
