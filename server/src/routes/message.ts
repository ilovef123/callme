import express from 'express';
import Message from '../models/Message';

const router = express.Router();

// 发送消息
router.post('/send', async (req, res) => {
  const { from, to, content } = req.body;
  // 打印参数和类型
  console.log('[POST /send] 参数:', { from, to, content });
  console.log('[POST /send] 类型:', {
    from: typeof from,
    to: typeof to,
    content: typeof content
  });

  if (!from || typeof from !== 'string' || from.trim() === '') {
    return res.status(400).json({ success: false, message: 'from 字段不能为空', from, to, content });
  }
  if (!to || typeof to !== 'string' || to.trim() === '') {
    return res.status(400).json({ success: false, message: 'to 字段不能为空', from, to, content });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ success: false, message: 'content 字段不能为空', from, to, content });
  }
  try {
    await Message.create({ from, to, content, createdAt: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error('[POST /send] 数据库写入失败:', err);
    res.status(500).json({ success: false, message: '数据库写入失败', error: err.message });
  }
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