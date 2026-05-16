import { SubjectDoc, SubjectModel } from './subject.model.js'

const DEFAULT_SUBJECTS = [
  { name: 'বাংলা', icon: '🇧🇩', color: '#0ea5e9', order: 0 },
  { name: 'ইংরেজি', icon: '🇬🇧', color: '#8b5cf6', order: 1 },
  { name: 'গণিত', icon: '📐', color: '#f97316', order: 2 },
]

export interface ISubjectInput {
  userId?: string
  name: string
  icon?: string
  color?: string
  isDefault?: boolean
  order?: number
}

export class SubjectService {
  async seedDefaultsForNewUser(userId: string): Promise<void> {
    const existing = await SubjectModel.countDocuments({ userId }).exec()
    if (existing > 0) return
    await SubjectModel.insertMany(
      DEFAULT_SUBJECTS.map((s) => ({
        userId,
        ...s,
        isDefault: true,
      }))
    )
  }

  async list(userId: string): Promise<SubjectDoc[]> {
    return SubjectModel.find({ userId }).sort({ order: 1, createdAt: 1 }).exec()
  }

  async create(userId: string, data: Omit<ISubjectInput, 'userId'>): Promise<SubjectDoc> {
    const last = await SubjectModel.findOne({ userId }).sort({ order: -1 }).select('order').lean().exec()
    const order = (last?.order ?? -1) + 1
    const doc = await SubjectModel.create({
      userId,
      name: data.name,
      icon: data.icon ?? '📚',
      color: data.color ?? '#6366f1',
      isDefault: false,
      order: data.order ?? order,
    })
    const full = await SubjectModel.findById(doc._id).exec()
    return full!
  }

  async update(
    userId: string,
    id: string,
    patch: Partial<Pick<ISubjectInput, 'name' | 'icon' | 'color' | 'order'>>
  ): Promise<SubjectDoc | null> {
    const sub = await SubjectModel.findOne({ _id: id, userId }).exec()
    if (!sub) return null
    if (patch.name !== undefined) sub.name = patch.name
    if (patch.icon !== undefined) sub.icon = patch.icon
    if (patch.color !== undefined) sub.color = patch.color
    if (patch.order !== undefined) sub.order = patch.order
    await sub.save()
    return sub
  }

  async remove(userId: string, id: string): Promise<{ ok: boolean; reason?: string }> {
    const sub = await SubjectModel.findOne({ _id: id, userId }).exec()
    if (!sub) return { ok: false }
    if (sub.isDefault) return { ok: false, reason: 'ডিফল্ট বিষয় মুছে ফেলা যাবে না' }
    await SubjectModel.deleteOne({ _id: id, userId }).exec()
    return { ok: true }
  }
}
