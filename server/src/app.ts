import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

// 路由文件
import authRoutes from './routes/auth';
import friendRoutes from './routes/friends';
import messageRoutes from './routes/message';
import momentRoutes from './routes/moment';
import userRoutes from './routes/user';


const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/callme', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// 路由挂载
app.use('/api/auth', authRoutes);         // 登录/注册相关
app.use('/api/friend', friendRoutes);     // 好友相关
app.use('/api/message', messageRoutes);   // 聊天消息相关
app.use('/api/moment', momentRoutes);     // 朋友圈动态相关
app.use('/api/user', userRoutes);         // 用户相关（含头像上传）


// 静态资源托管（头像图片）
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 启动服务
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});