'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useProgressSummary } from '@/hooks/useProgress'

export function ProgressOverview() {

  const { data, isLoading } = useProgressSummary()

  return (

    <div className="grid gap-4 sm:grid-cols-2">

      <Card>

        <CardHeader>

          <CardTitle className="text-base">সাপ্তাহিক পড়ার সময়</CardTitle>

        </CardHeader>

        <CardContent>

          <p className="text-3xl font-semibold">{isLoading ? '…' : `${data?.weeklyMinutes ?? 0} মিনিট`}</p>

          <p className="text-xs text-muted-foreground">চলমান সপ্তাহের যোগফল</p>

        </CardContent>

      </Card>

      <Card>

        <CardHeader>

          <CardTitle className="text-base">মাসিক পড়ার সময়</CardTitle>

        </CardHeader>

        <CardContent>

          <p className="text-3xl font-semibold">{isLoading ? '…' : `${data?.monthlyMinutes ?? 0} মিনিট`}</p>

          <p className="text-xs text-muted-foreground">চলমান মাসের যোগফল</p>

        </CardContent>

      </Card>

    </div>

  )

}
