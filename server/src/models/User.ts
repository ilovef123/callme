import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  iphone: string;      // 手机号
  username: string;    // 昵称
  password: string;    // 密码 hash
}

const UserSchema: Schema = new Schema({
  iphone: { type: String, required: true, unique: true },    // 手机号
  username: { type: String, required: true },                // 昵称
  password: { type: String, required: true }                 // 密码 hash
});

export default mongoose.model<IUser>('User', UserSchema, 'userList');