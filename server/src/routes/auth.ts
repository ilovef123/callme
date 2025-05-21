import express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  const { iphone, username, password } = req.body;
  const exist = await User.findOne({ iphone });
  if (exist) {
    return res.json({ success: false, message: '手机号已注册' });
  }
  try {
    // 密码加密
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ iphone, username, password: hash, createdAt: new Date() });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: '注册失败', error: err.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { iphone, password } = req.body;
  try {
    const user = await User.findOne({ iphone });
    if (!user) {
      return res.json({ success: false, message: '手机号或密码错误' });
    }
    // 校验密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: '手机号或密码错误' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: '登录失败', error: err.message });
  }
});

export default router;