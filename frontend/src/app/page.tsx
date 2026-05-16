import { LandingPage } from '@/components/marketing/LandingPage'

import { auth } from '@/auth'

export default async function HomePage() {
  const session = await auth()

  return <LandingPage isAuthenticated={Boolean(session?.user)} />
}
