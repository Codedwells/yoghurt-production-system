import { Document, Schema, model } from 'mongoose'

interface UserDoc extends Document {
  name: string
  image: string
  email: string
  phone: string
  password: string
  lastLogin: Date
}

const UserSchema: Schema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
)

const User = model<UserDoc>('User', UserSchema)

export default User
