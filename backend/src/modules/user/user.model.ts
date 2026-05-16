import mongoose, { HydratedDocument, InferSchemaType, Schema } from 'mongoose'

const userSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>

export const UserModel = mongoose.model('User', userSchema)
