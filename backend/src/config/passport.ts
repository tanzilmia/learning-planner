import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

/**
 * Passport Google OAuth2 (classic redirect flow). Wired for completeness with spec;
 * primary auth uses POST /api/auth/google + Google ID token verification.
 */
export function configurePassport(
  googleClientId: string,
  googleClientSecret: string,
  callbackURL: string
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL,
      },
      (_accessToken, _refreshToken, profile, done) => {
        done(null, profile)
      }
    )
  )
}

export default passport
