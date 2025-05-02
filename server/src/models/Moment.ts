import mongoose from 'mongoose';

const MomentSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // 发布动态的用户ID
  content: { type: String, required: true },  // 动态内容
  images: [{ type: String }],                 // 图片URL数组
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Moment', MomentSchema, 'moments');