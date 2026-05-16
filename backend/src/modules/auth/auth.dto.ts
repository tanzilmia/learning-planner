import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken'

export type JwtPayload = BaseJwtPayload & {
  userId: string
  email: string
}
