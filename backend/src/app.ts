import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import passport from 'passport'

export function createExpressApp(clientUrl: string) {
  const app = express()

  app.use(cors({ origin: clientUrl, credentials: true }))
  app.use(express.json({ limit: '15mb' }))
  app.use(cookieParser())
  app.use(passport.initialize())

  app.get('/health', (_req, res) => res.json({ ok: true }))

  return app
}
