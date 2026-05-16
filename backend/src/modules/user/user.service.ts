import { UserDoc, UserModel } from './user.model.js'

export interface IUserService {
  findOrCreateFromGoogle(opts: {
    googleId: string
    email: string
    name: string
    avatar?: string | null
  }): Promise<{ user: UserDoc; isNew: boolean }>
  getById(id: string): Promise<UserDoc | null>
  updateTheme(userId: string, theme: 'light' | 'dark'): Promise<void>
}

export class UserService implements IUserService {
  async findOrCreateFromGoogle(opts: {
    googleId: string
    email: string
    name: string
    avatar?: string | null
  }): Promise<{ user: UserDoc; isNew: boolean }> {
    let user = await UserModel.findOne({ googleId: opts.googleId }).exec()
    if (user) return { user, isNew: false }

    user = await UserModel.create({
      googleId: opts.googleId,
      email: opts.email,
      name: opts.name,
      avatar: opts.avatar ?? undefined,
    })
    return { user, isNew: true }
  }

  async getById(id: string): Promise<UserDoc | null> {
    return UserModel.findById(id).exec()
  }

  async updateTheme(userId: string, theme: 'light' | 'dark'): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { theme }).exec()
  }
}
