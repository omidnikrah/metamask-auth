import mongoose, { Schema } from 'mongoose'

interface IUser {
  publicAddress: string;
  nonce?: number;
}

const User = mongoose.model<IUser>('User', new Schema({
  publicAddress: String,
  nonce: {
    type: Number,
    default: Math.floor(100000 + Math.random() * 999999)
  },
}, {
  versionKey: false,
  timestamps: true
}))

export default User;
