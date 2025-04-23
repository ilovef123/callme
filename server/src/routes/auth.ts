import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';

const router = express.Router();

// 注册
router.post('/register', async (req: Request, res: Response) => {
  const { username, nickname, password } = req.body;

  // 1. 校验手机号格式
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: '手机号不能为空' });
  }
  if (!/^1[3-9]\d{9}$/.test(username)) {
    return res.status(400).json({ message: '手机号格式错误，应为11位中国大陆手机号' });
  }

  // 2. 校验昵称
  if (!nickname || typeof nickname !== 'string' || !nickname.trim()) {
    return res.status(400).json({ message: '昵称不能为空' });
  }

  // 3. 校验密码
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: '密码不能为空' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度不能少于6位' });
  }
  if (password.length > 32) {
    return res.status(400).json({ message: '密码长度不能超过32位' });
  }
  // 可选：禁止弱密码
  if (/^\d+$/.test(password)) {
    return res.status(400).json({ message: '密码不能为纯数字' });
  }
  if (/^[a-zA-Z]+$/.test(password)) {
    return res.status(400).json({ message: '密码不能为纯字母' });
  }

  try {
    // 4. 检查手机号是否已注册
    const exist = await User.findOne({ iphone: username });
    if (exist) return res.status(400).json({ message: '该手机号已注册，请直接登录' });

    // 5. 创建用户
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      iphone: username,
      username: nickname,
      password: hash
    });
    res.json({ message: '注册成功' });
  } catch (err) {
    console.error('注册异常:', err);
    res.status(500).json({ message: '服务器错误，请稍后再试' });
  }
});

// 登录接口
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // 登录时用手机号查找
    const user = await User.findOne({ iphone: username });
    if (!user) {
      return res.status(400).json({ message: '用户不存在' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '密码错误' });
    }
    res.json({ message: '登录成功' });
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;