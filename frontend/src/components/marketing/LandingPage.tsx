import Link from 'next/link'

import {

  ArrowRight,

  BookOpen,

  CalendarDays,

  CheckCircle2,

  FileImage,

  Gauge,

  Moon,

  Palette,

  Shield,

  Sparkles,

  Youtube,

} from 'lucide-react'

import { Button } from '@/components/ui/button'

type LandingPageProps = {
  isAuthenticated?: boolean
}

const FACILITY_ITEMS: string[] = [
  'গুগল অ্যাকাউন্ট দিয়ে দ্রুত লগইন — আলাদা পাসওয়ার্ড বানানোর দরকার নেই।',
  'নিজস্ব ও ডিফল্ট বিষয় তৈরি করে পড়াশোনা টপিকগুলো ছোট ছোট অধ্যায় (চ্যাপ্টার) খাতায় ভাগ করা।',
  'রিচ টেক্সট নোট লেখা — ফরম্যাট ও বুলেট দিয়ে স্পষ্ট নোট।',
  'ছবি, পিডিএফ ও ওয়ার্ড (.doc / .docx) আপলোড করে অ্যাপের ভেতর থেকেই দেখা ও ম্যানেজ করা।',
  'গুরুত্বপূর্ণ ওয়েব লিংক ও ইউটিউব ভিডিও একই নোট খাতায় জমা করা।',
  'ক্যালেন্ডার: ইভেন্টের পাশাপাশি নোটে লেখা পড়াশোনার সময় ও ডেডলাইন মাস/সপ্তাহ ভিউতে দেখা যাবে; ডেডলাইন থাকলে নোট কার্ডে বাকি দিন গণনা।',
  'অগ্রগতিতে পড়াশোনার সময় ও স্ট্যাটাস লগ করে নিজের গতিটা দেখা।',
  'বাংলা ইউআই ও পড়তে আরামদায়ক লাইট / ডার্ক থিম অ্যাপ্লিকেশন জুড়ে ব্যবহার।',
  'মোবাইল ও ডেস্কটপে একই ডেটা ব্যবহার — রেসপনসিভ লেআউট।',
  'প্রোফাইল ও থিম (লাইট / ডার্ক) সেটিংস থেকে সহজে বদলানো।',

]

export function LandingPage({ isAuthenticated = false }: LandingPageProps) {

  return (

    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-primary/[0.06] to-background">

      <div

        aria-hidden

        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_80%_55%_at_50%_-8%,hsl(var(--primary)/0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_55%_at_50%_-8%,hsl(var(--primary)/0.15),transparent)]"

      />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md">

        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">

          <div className="flex items-center gap-2">

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">

              <BookOpen className="h-5 w-5 text-primary" aria-hidden />

            </span>

            <span className="text-lg font-semibold tracking-tight">নোটশালা</span>

          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">

            {isAuthenticated ? (

              <Button asChild size="sm" className="gap-2">

                <Link href="/dashboard">

                  ড্যাশবোর্ড <ArrowRight className="h-4 w-4" />

                </Link>

              </Button>

            ) : (

              <Button asChild size="sm" className="gap-2">

                <Link href="/login">

                  লগইন করুন <ArrowRight className="h-4 w-4" />

                </Link>

              </Button>

            )}

          </div>

        </div>

      </header>

      <main className="relative mx-auto max-w-6xl space-y-20 px-4 pb-24 pt-10 sm:pt-14">

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">

          <div className="space-y-6">

            <span className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">

              <Sparkles className="h-3.5 w-3.5 text-primary" />

              ব্যক্তিগত নোট, সময় ও অগ্রগতি — বাংলায়

            </span>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-[2.85rem] md:leading-[1.1]">

              পড়াশোনার উপকরণ — <span className="text-primary">এক জায়গায় গোছানো ও দেখাশোনা</span>

            </h1>

            <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">

              নোটশালায় আপনি বিষয় ও অধ্যায় অনুযায়ী নোট রাখবেন — লেখা, ছবি, পিডিএফ ও ডক, লিংক ও ইউটিউব, পাশাপাশি ক্যালেন্ডার মিলিয়ে শিড്യুল ও অগ্রগতিবার মিনিট খাতা একসাথে পাবেন। গুগল দিয়ে ফিরবেন এক ক্লিকে।

            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              {isAuthenticated ? (

                <>

                  <Button asChild size="lg" className="gap-2">

                    <Link href="/dashboard">

                      ড্যাশবোর্ডে যান <ArrowRight className="h-4 w-4" />

                    </Link>

                  </Button>

                  <Button asChild size="lg" variant="outline" className="gap-2">

                    <Link href="/settings">সেটিংস</Link>

                  </Button>

                </>

              ) : (

                <>

                  <Button asChild size="lg" className="gap-2">

                    <Link href="/login">বিনামূল্যে শুরু করুন</Link>

                  </Button>

                  <Button asChild size="lg" variant="outline" className="gap-2">

                    <Link href="/login">

                      ড্যাশবোর্ডে যেতে লগইন <ArrowRight className="h-4 w-4" />

                    </Link>

                  </Button>

                </>

              )}

            </div>

          </div>

          <div className="relative">

            <div className="absolute -inset-4 rounded-[1.75rem] bg-gradient-to-br from-primary/20 via-transparent to-accent/40 blur-2xl" aria-hidden />

            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur dark:bg-card">

              <div className="mb-5 flex gap-3 border-b pb-5">

                <div className="h-14 w-14 shrink-0 rounded-xl bg-muted" />

                <div className="space-y-2 pt-1">

                  <div className="h-3 w-32 rounded-full bg-muted" />

                  <div className="h-2 w-48 max-w-full rounded-full bg-muted/70" />

                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-3">

                {['গণিত', 'বাংলা', 'জীববিজ্ঞান'].map((lab) => (

                  <div key={lab} className="rounded-xl border bg-background/70 p-3 text-center">

                    <p className="text-xs font-medium text-muted-foreground">বিষয়</p>

                    <p className="truncate text-sm font-semibold">{lab}</p>

                  </div>

                ))}

              </div>

              <div className="mt-6 rounded-xl border bg-muted/30 p-4">

                <p className="text-xs uppercase tracking-wide text-muted-foreground">নোটের ধরন</p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm">

                  <span className="rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary">টেক্সট</span>

                  <span className="rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary">ছবি / পিডিএফ</span>

                  <span className="rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary">ডকумент</span>

                  <span className="rounded-md bg-secondary px-2 py-1.5 font-medium text-secondary-foreground">লিংক</span>

                  <span className="rounded-md bg-secondary px-2 py-1.5 font-medium text-secondary-foreground inline-flex items-center gap-1">

                    <Youtube className="h-3 w-3" aria-hidden />

                    ইউটিউব

                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section aria-labelledby="facilities-heading" className="rounded-3xl border border-border/70 bg-card/60 p-6 shadow-sm backdrop-blur sm:p-10">

          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">

            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">

              <Shield className="h-3.5 w-3.5" aria-hidden />

              সুবিধাসমূহের তালিকা

            </span>

            <h2 id="facilities-heading" className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">

              এই অ্যাপ ব্যবহার করে আপনি কী কী পাবেন

            </h2>

            <p className="mt-3 text-pretty text-sm text-muted-foreground sm:text-base">

              সংক্ষেপে — নীচের সবগুলো একই ড্যাশবোর্ডের অন্তর্গত; লগইন করলেই ডেটা সংরক্ষিত থাকবে ও যেকোনো ডিভাইস থেকে খুলতে পারবেন।

            </p>

          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-5">

            {FACILITY_ITEMS.map((line, i) => (

              <li

                key={i}

                className="flex gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-muted/30">

                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />

                <span className="text-sm leading-relaxed sm:text-[0.9375rem]">{line}</span>

              </li>

            ))}

          </ul>

        </section>

        <section aria-labelledby="features-heading" className="space-y-8">

          <div className="text-center lg:text-left">

            <h2 id="features-heading" className="text-2xl font-bold sm:text-3xl">

              আরও কয়েকটি বৈশিষ্ট্য

            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground lg:mx-0">

              ডেস্কটপ ও মোবাইল — ছোট ও বড় স্ক্রিনে একই অভিজ্ঞতা পেতে ডিজাইন করা হয়েছে।

            </p>

          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {[

              {

                Icon: Palette,

                t: 'বাংলা ইন্টারফেইস',

                d: 'বোতাম, মেনু ও বার্তাগুলো বাংলায়; পড়তে সাবলীল টাইপফেস।',

              },

              {

                Icon: FileImage,

                t: 'ফাইল ও প্রিভিউ',

                d: 'আপলোড করা ফাইল অ্যাপেই খুলতে পারেন, আলাদা অ্যাপের দরকার কম।',

              },

              {

                Icon: CalendarDays,

                t: 'শিড়িয়ুল ক্যালেন্ডার',

                d: 'মাস ও সপ্তাহ দেখুন, তারিখে পড়াশোনা বা ডেডলাইন টানুন।',

              },

              {

                Icon: Gauge,

                t: 'অগ্রগতির চার্ট',

                d: 'কখন কতক্ষণ পড়েছেন ও কোন টপিক চলছে — এক নজরে ধারণা।',

              },

              {

                Icon: Moon,

                t: 'লাইট ও ডার্ক মোড',

                d: 'রাত দিন অনুযায়ী চোখের আরাম — থিম পরিবর্তন সেটিংসে।',

              },

            ].map(({ Icon, t, d }) => (

              <li key={t} className="rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm backdrop-blur">

                <Icon className="mb-3 h-8 w-8 text-primary" aria-hidden />

                <p className="font-semibold">{t}</p>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>

              </li>

            ))}

          </ul>

        </section>

        <footer className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-transparent to-accent/30 p-8 text-center sm:p-12">

          <h3 className="text-xl font-bold sm:text-2xl">আজ থেকেই সংগঠিতভাবে পড়াশোনা চালিয়ে যান</h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">

            {isAuthenticated ? 'ফিরে ড্যাশবোর্ডে চলুন, অথবা এই পেজ থেকে অন্য ট্যাবে ব্রাউজ করুন।' : 'একটি গুগল অ্যাকাউন্ট দিয়েই সব সুবিধা খুলুন — অতিরিক্ত পাসওয়ার্ড লাগছে না।'}

          </p>

          <Button asChild size="lg" className="mt-6">

            <Link href={isAuthenticated ? '/dashboard' : '/login'}>{isAuthenticated ? 'আপনার ড্যাশবোর্ড' : 'গুগল দিয়ে প্রবেশ'}</Link>

          </Button>

        </footer>

      </main>

    </div>

  )

}
