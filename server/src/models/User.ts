import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  iphone: { type: String, required: true },   // 手机号
  username: { type: String, required: true }, // 用户名/昵称
  password: { type: String, required: true }, // 密码
  createdAt: { type: Date, default: Date.now },
  avatar: { type: String, default: '' } // 新增头像字段
});

export default mongoose.model('User', UserSchema, 'userList');