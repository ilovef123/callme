import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  from: { type: String, required: true },     // 发送者ID
  to: { type: String, required: true },       // 接收者ID
  content: { type: String, required: true },  // 消息内容
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', MessageSchema, 'messages');