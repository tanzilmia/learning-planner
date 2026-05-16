import { ProgressOverview } from '@/components/progress/ProgressOverview'

import { SubjectProgress } from '@/components/progress/SubjectProgress'

export default function ProgressPage() {

  return (

    <div className="mx-auto max-w-6xl space-y-6">

      <div>

        <h1 className="text-2xl font-semibold">পড়াশোনার অগ্রগতি</h1>

        <p className="text-sm text-muted-foreground">সাপ্তাহিক ও মাসিক মিনিট দেখুন এবং লগ সংরক্ষণ করুন।</p>

      </div>

      <ProgressOverview />

      <SubjectProgress />

    </div>

  )

}
