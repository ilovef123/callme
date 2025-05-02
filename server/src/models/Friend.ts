import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 当前用户ID（字符串类型，存储用户的 _id）
  friends: [
    {
      userId: { type: String, required: true }, // 好友用户ID
      remark: { type: String, default: '' }     // 备注（可选）
    }
  ]
});

export default mongoose.model('Friend', FriendSchema, 'friends');