import { defineComponent, reactive, ref, onMounted } from 'vue';

interface Message {
  text: string;
  from: 'me' | 'other';
}

interface User {
  id: number;
  name: string;
  color: string;
}

export default defineComponent({
  name: 'ChatPage',
  setup() {
    const users: User[] = [
      { id: 1, name: 'Tea', color: '#ff7f7f' },
      { id: 2, name: 'Gai', color: '#4fc3f7' },
      { id: 3, name: 'Zeng', color: '#a5d6a7' },
      { id: 4, name: 'Chen', color: '#b39ddb' },
      { id: 5, name: 'JJJ', color: '#f06292' }
    ];

    const selectedUserId = ref<number>(5);
    const messageMap: Record<number, Message[]> = reactive({});
    const inputMessage = ref('');

    // 🔗 【接口：加载消息记录】
    const loadMessages = async (userId: number) => {
      // TODO: 替换为从数据库加载（用 fetch/axios 请求后端）
      // 示例：
      // const res = await axios.get(`/api/messages?userId=${userId}`);
      // messageMap[userId] = res.data;

      // 模拟数据
      messageMap[userId] = [
        { text: '你好，我是 ' + users.find(u => u.id === userId)?.name, from: 'other' }
      ];
    };

    const currentMessages = () => messageMap[selectedUserId.value] || [];

    const sendMessage = async () => {
      const text = inputMessage.value.trim();
      if (!text) return;

      const newMsg: Message = { text, from: 'me' };

      if (!messageMap[selectedUserId.value]) {
        messageMap[selectedUserId.value] = [];
      }
      messageMap[selectedUserId.value].push(newMsg);

      // 📨 【接口：发送消息到后端】
      // TODO: 替换为发消息接口
      // 示例：
      // await axios.post('/api/sendMessage', {
      //   userId: selectedUserId.value,
      //   message: newMsg
      // });

      inputMessage.value = '';
    };

    const switchUser = async (id: number) => {
      selectedUserId.value = id;
      if (!messageMap[id]) {
        await loadMessages(id); // 第一次切换加载
      }
    };

    const currentUser = () => users.find(u => u.id === selectedUserId.value)!;

    onMounted(() => {
      loadMessages(selectedUserId.value); // 初次加载默认用户的消息
    });

    return {
      users,
      selectedUserId,
      currentUser,
      currentMessages,
      inputMessage,
      sendMessage,
      switchUser
    };
  }
});
