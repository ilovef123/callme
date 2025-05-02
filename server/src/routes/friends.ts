import express from 'express';
import User from '../models/User';
import Friend from '../models/Friend';

const router = express.Router();

// 添加好友
router.post('/add', async (req, res) => {
  const { userId, friendIphone } = req.body;
  const friendUser = await User.findOne({ iphone: friendIphone });
  if (!friendUser) return res.json({ success: false, message: '用户不存在' });

  // 添加到自己的好友列表
  let myFriends = await Friend.findOne({ userId });
  if (!myFriends) {
    myFriends = await Friend.create({ userId, friends: [] });
  }
  if (!myFriends.friends.find((f: any) => f.userId === friendUser._id.toString())) {
    myFriends.friends.push({ userId: friendUser._id.toString(), remark: friendUser.username });
    await myFriends.save();
  }

  // 自动互为好友（可选）
  let friendFriends = await Friend.findOne({ userId: friendUser._id.toString() });
  if (!friendFriends) {
    friendFriends = await Friend.create({ userId: friendUser._id.toString(), friends: [] });
  }
  if (!friendFriends.friends.find((f: any) => f.userId === userId)) {
    friendFriends.friends.push({ userId, remark: '' });
    await friendFriends.save();
  }

  res.json({ success: true });
});

// 获取好友列表（支持 /list/:userId 和 /list?userId=xxx）
router.get('/list/:userId', async (req, res) => {
  const userId = req.params.userId;
  const friends = await Friend.findOne({ userId });
  if (!friends) return res.json([]);
  // 查询好友详细信息
  const users = await User.find({ _id: { $in: friends.friends.map((f: any) => f.userId) } });
  res.json(users);
});

router.get('/list', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ message: 'userId is required' });
  const friends = await Friend.findOne({ userId });
  if (!friends) return res.json([]);
  const users = await User.find({ _id: { $in: friends.friends.map((f: any) => f.userId) } });
  res.json(users);
});

export default router;