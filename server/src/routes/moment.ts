import express from 'express';
import Moment from '../models/Moment';
import Friend from '../models/Friend';

const router = express.Router();

// 发布动态
router.post('/add', async (req, res) => {
  const { userId, content, images } = req.body;
  await Moment.create({ userId, content, images, createdAt: new Date() });
  res.json({ success: true });
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

export default router;