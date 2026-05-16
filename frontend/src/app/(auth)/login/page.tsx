import { LoginForm } from './login-form'

function isGoogleOAuthConfigured(): boolean {
  const id =
    process.env.AUTH_GOOGLE_ID?.trim() ??
    process.env.GOOGLE_CLIENT_ID?.trim() ??
    ''
  const secret =
    process.env.AUTH_GOOGLE_SECRET?.trim() ??
    process.env.GOOGLE_CLIENT_SECRET?.trim() ??
    ''
  return !!(id && secret)
}

export default function LoginPage() {
  return <LoginForm googleOAuthConfigured={isGoogleOAuthConfigured()} />
}
