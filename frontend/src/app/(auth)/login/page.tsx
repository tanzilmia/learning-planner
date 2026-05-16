'use client'

import { signIn } from 'next-auth/react'

import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {

  const searchParams = useSearchParams()

  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  return (

    <Card className="w-full max-w-md border-border/80 shadow-lg">

      <CardHeader>

        <CardTitle className="text-2xl">নোটশালায় স্বাগতম</CardTitle>

        <CardDescription>চালিয়ে যেতে গুগল দিয়ে লগইন করুন। অন্য কোনো লগইন পদ্ধতি নেই।</CardDescription>

      </CardHeader>

      <CardContent>

        <Button className="w-full" type="button" onClick={() => void signIn('google', { callbackUrl })}>

          গুগল দিয়ে প্রবেশ করুন

        </Button>

      </CardContent>

    </Card>

  )

}
