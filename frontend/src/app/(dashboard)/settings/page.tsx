'use client'

import { useTheme } from 'next-themes'

import { useEffect } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'

import { useAuthMe, usePatchTheme } from '@/hooks/useAuthMe'

import { Button } from '@/components/ui/button'

export default function SettingsPage() {

  const { data: user, isLoading } = useAuthMe()

  const patchTheme = usePatchTheme()

  const { theme, setTheme } = useTheme()

  useEffect(() => {

    if (!user?.theme) return

    setTheme(user.theme)

  }, [user?.theme, setTheme])

  const sync = async (next: 'light' | 'dark') => {

    setTheme(next)

    await patchTheme.mutateAsync(next)

  }

  return (

    <div className="mx-auto max-w-2xl space-y-6">

      <div>

        <h1 className="text-2xl font-semibold">সেটিংস</h1>

        <p className="text-sm text-muted-foreground">থিম ও প্রোফাইল তথ্য।</p>

      </div>

      <Card>

        <CardHeader>

          <CardTitle>থিম</CardTitle>

          <CardDescription>হালকা বা গাঢ় মোড বেছে নিন। পছন্দ সার্ভারেও সংরক্ষিত হয়।</CardDescription>

        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">

          <Button type="button" variant={theme === 'light' ? 'default' : 'outline'} onClick={() => void sync('light')}>

            হালকা

          </Button>

          <Button type="button" variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => void sync('dark')}>

            গাঢ়

          </Button>

        </CardContent>

      </Card>

      <Separator />

      <Card>

        <CardHeader>

          <CardTitle>প্রোফাইল</CardTitle>

          <CardDescription>ব্যাকএন্ড থেকে আসা তথ্য।</CardDescription>

        </CardHeader>

        <CardContent className="space-y-2 text-sm">

          {isLoading ? <p>লোড হচ্ছে...</p> : null}

          {user ? (

            <>

              <p>

                <span className="text-muted-foreground">নাম:</span> {user.name}

              </p>

              <p>

                <span className="text-muted-foreground">ইমেইল:</span> {user.email}

              </p>

              <p>

                <span className="text-muted-foreground">গুগল থিম সংরক্ষণ:</span> {user.theme === 'dark' ? 'গাঢ়' : 'হালকা'}

              </p>

            </>

          ) : !isLoading ? (

            <p className="text-muted-foreground">প্রোফাইল লোড করা যায়নি। লগইন ও ব্যাকএন্ড চালু আছে কিনা দেখুন।</p>

          ) : null}

        </CardContent>

      </Card>

    </div>

  )

}
