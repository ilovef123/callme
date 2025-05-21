import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Moment from '../models/Moment';
import Friend from '../models/Friend';

const router = express.Router();

// 配置 multer 存储
const upload = multer({
  dest: 'C:/Users/Administrator/Desktop/nginx-1.28.0/html/callme/uploads/', // 统一到 public/uploads
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// 发布动态（支持图片上传）
router.post('/add', upload.array('imgs', 9), async (req, res) => {
  try {
    const { userId, content } = req.body;
    // 处理图片路径
    let imgs: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imgs = req.files.map((file: any) => `/uploads/${file.filename}`);
    }
    if (!userId || !content) {
      return res.status(400).json({ success: false, message: 'userId 和 content 必填' });
    }
    await Moment.create({ userId, content, images: imgs, createdAt: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 获取朋友圈动态（带用户名和头像）
router.get('/list', async (req, res) => {
  const { userId } = req.query;
  let ids;
  if (!userId) {
    ids = null;
  } else {
    const friends = await Friend.findOne({ userId });
    ids = [userId];
    if (friends) ids.push(...friends.friends.map((f: any) => f.userId));
  }

  const match: any = ids ? { userId: { $in: ids } } : {};
  const moments = await Moment.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $addFields: {
        userIdObj: { $toObjectId: "$userId" }
      }
    },
    {
      $lookup: {
        from: 'userList', // 修正为实际集合名
        localField: 'userIdObj',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $addFields: {
        avatar: { $arrayElemAt: ['$userInfo.avatar', 0] },
        username: { $arrayElemAt: ['$userInfo.username', 0] }
      }
    },
    { $project: { userInfo: 0, userIdObj: 0 } }
  ]);
  res.json(moments);
});

// 删除动态
import mongoose from 'mongoose';

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: '缺少动态ID' });
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: '动态ID格式错误' });
    }
    const objectId = new mongoose.Types.ObjectId(id);
    const result = await Moment.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: '动态已删除' });
    } else {
      res.json({ success: false, message: '未找到该动态' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: '服务器错误', error: err.message });
  }
});

export default router;