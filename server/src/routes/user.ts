import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User';

const router = express.Router();
// 用户注册
router.post('/register', async (req, res) => {
  const { iphone, username, password } = req.body;
  if (!iphone || !username || !password) {
    return res.json({ success: false, message: '参数缺失' });
  }
  try {
    const exist = await User.findOne({ iphone });
    if (exist) {
      return res.json({ success: false, message: '手机号已被注册' });
    }
    const user = await User.create({ iphone, username, password });
    res.json({ success: true, user });
  } catch (err: any) {
    res.json({ success: false, message: '注册失败', error: err.message });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { iphone, password } = req.body;
  if (!iphone || !password) {
    return res.json({ success: false, message: '参数缺失' });
  }
  try {
    const user = await User.findOne({ iphone, password }).lean();
    if (!user) {
      return res.json({ success: false, message: '手机号或密码错误' });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.json({ success: false, message: '登录失败', error: err.message });
  }
});
// 确保上传目录存在
const uploadDir = path.resolve('C:/Users/Administrator/Desktop/nginx-1.28.0/html/callme/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});
const upload = multer({ storage });

import mongoose from 'mongoose'; // 顶部已引入或自动补全

// 昵称修改接口
router.post('/updateNickname', async (req, res) => {
  const { userId, nickname } = req.body;
  if (!userId || !nickname) {
    return res.json({ success: false, message: '参数缺失' });
  }
  try {
    // 用 mongoose User 模型，userId 为 _id 字符串，昵称字段为 username
    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { username: nickname } }
    );
    if (result.modifiedCount === 1) {
      res.json({ success: true, message: '昵称更新成功' });
    } else {
      res.json({ success: false, message: '未找到用户或昵称未变更' });
    }
  } catch (err: any) {
    res.json({ success: false, message: '数据库错误', error: err.message });
  }
});

// 昵称修改接口
router.post('/updateNickname', async (req, res) => {
  const { userId, nickname } = req.body;
  if (!userId || !nickname) {
    return res.json({ success: false, message: '参数缺失' });
  }
  try {
    // 用 mongoose User 模型，userId 为 _id 字符串，昵称字段为 username
    const result = await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { username: nickname } }
    );
    if (result.modifiedCount === 1) {
      res.json({ success: true, message: '昵称更新成功' });
    } else {
      res.json({ success: false, message: '未找到用户或昵称未变更' });
    }
  } catch (err: any) {
    res.json({ success: false, message: '数据库错误', error: err.message });
  }
});

// 头像上传接口
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  const { userId } = req.body;
  console.log('收到头像上传请求，userId:', userId, '文件:', req.file?.filename);
  if (!userId) {
    return res.status(400).json({ success: false, message: '缺少 userId' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: '未上传文件' });
  }
  const avatarUrl = `/api/uploads/${req.file.filename}`;
  try {
    const result = await User.updateOne({ _id: new mongoose.Types.ObjectId(userId) }, { avatar: avatarUrl });
    if (result.modifiedCount === 0) {
      console.error('未找到用户或用户未被更新:', userId);
      return res.status(404).json({ success: false, message: '未找到用户或用户未被更新' });
    }
    res.json({ success: true, avatarUrl });
  } catch (err) {
    console.error('数据库更新失败:', err);
    res.status(500).json({ success: false, message: '数据库更新失败', error: err.message });
  }
});

// 获取指定用户详情
router.get('/detail', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: '缺少 userId' });
  }
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: '数据库错误', error: err.message });
  }
});

// 获取所有上传图片的 url 列表（动态展示用）
router.get('/api/uploads/list', (req, res) => {
  const uploadsDir = 'C:/Users/Administrator/Desktop/nginx-1.28.0/html/callme/uploads/';
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: '读取目录失败' });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
    const urls = images.map(name => `/api/uploads/${name}`);
    res.json(urls);
  });
});

export default router;
