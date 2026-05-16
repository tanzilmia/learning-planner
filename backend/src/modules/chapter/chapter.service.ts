import { ChapterDoc, ChapterModel } from './chapter.model.js'

import { SubjectModel } from '../subject/subject.model.js'

export class ChapterService {
  async list(subjectId: string, userId: string): Promise<ChapterDoc[]> {
    await this.assertSubject(subjectId, userId)
    return ChapterModel.find({ subjectId, userId }).sort({ order: 1, createdAt: 1 }).exec()
  }

  async create(subjectId: string, userId: string, title: string): Promise<ChapterDoc | null> {
    const ok = await this.assertSubject(subjectId, userId)
    if (!ok) return null
    const last = await ChapterModel.findOne({ subjectId, userId }).sort({ order: -1 }).select('order').lean().exec()
    const order = (last?.order ?? -1) + 1
    const doc = await ChapterModel.create({ subjectId, userId, title, order })
    return ChapterModel.findById(doc._id).exec().then((c) => c!)
  }

  async update(userId: string, id: string, patch: Partial<{ title: string; order: number }>): Promise<ChapterDoc | null> {
    const ch = await ChapterModel.findOne({ _id: id, userId }).exec()
    if (!ch) return null
    if (patch.title !== undefined) ch.title = patch.title
    if (patch.order !== undefined) ch.order = patch.order
    await ch.save()
    return ch
  }

  async remove(userId: string, id: string): Promise<boolean> {
    const r = await ChapterModel.deleteOne({ _id: id, userId }).exec()
    return r.deletedCount > 0
  }

  private async assertSubject(subjectId: string, userId: string): Promise<boolean> {
    const count = await SubjectModel.countDocuments({ _id: subjectId, userId }).exec()
    return count > 0
  }
}
