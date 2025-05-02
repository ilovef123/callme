import express from 'express';
import Message from '../models/Message';

const router = express.Router();

// 发送消息
router.post('/send', async (req, res) => {
  const { from, to, content } = req.body;
  await Message.create({ from, to, content, createdAt: new Date() });
  res.json({ success: true });
});

// 获取聊天消息
router.get('/list', async (req, res) => {
  const { userId, friendId } = req.query;
  const messages = await Message.find({
    $or: [
      { from: userId, to: friendId },
      { from: friendId, to: userId }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
});

export default router;