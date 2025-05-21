<template>
  <div class="chat-page-layout">
    <!-- 固定导航栏 -->
    <div class="nav-fixed-area">
      <MainNav :activeTab="activeTab" @update:activeTab="onNavTabChange" />
    </div>
    <template v-if="activeTab === 'chat'">
      <div class="contacts-left-panel">
        <div class="contacts-top-bar">
          <span class="contacts-title">消息</span>
        </div>
        <div class="contacts-search-bar">
          <input type="text" v-model="userSearch" placeholder="搜索好友" />
        </div>
        <ul class="contacts-list" @click.self="clearChat">
          <li
            v-for="user in (filteredUsers || [])"
            :key="user._id"
            :class="['contacts-item', { active: user._id === selectedUserId }]"
            @click="switchUser(user._id)"
            style="position:relative;"
          >
            <div class="avatar-wechat" :style="{ backgroundColor: user.color, position: 'relative' }">
              <img v-if="getAvatar(user)" :src="getAvatar(user)" class="avatar-img" alt="头像" style="width: 48px; height: 48px;border-radius: 7px;margin-top: 0;"
                   @error="e => { const t = e.target as HTMLImageElement | null; if(t) t.style.display='none'; }" />
              <span v-else>{{ user.username ? user.username[0] : '' }}</span>
              <span v-if="unreadCount[user._id] && unreadCount[user._id] > 0" class="msg-red-dot">{{ unreadCount[user._id] > 99 ? '99+' : unreadCount[user._id] }}</span>
            </div>
            <span class="contact-name-wechat">{{ user.username }}</span>
          </li>
        </ul>
      </div>
      <div class="chat-right-panel">
        <template v-if="selectedUserId">
          <div class="chat-window">
            <div class="chat-header">{{ currentUser()?.username }}</div>
            <div class="chat-messages" ref="messagesRef">
              <template v-for="(msg, i) in (currentMessages() || [])" :key="msg.id">
  <div v-if="shouldShowTime(msg, i, currentMessages())" class="bubble-time-top">
    {{ formatTime(msg.time) }}
  </div>
  <div :class="['bubble', msg.sender === 'me' ? 'me' : 'other']">
    <template v-if="msg.sender === 'me'">
      <div class="bubble-content selectable">{{ msg.content }}</div>
      <!-- 不显示自己的头像 -->
    </template>
    <template v-else>
      <img v-if="getAvatar(currentUser())" :src="getAvatar(currentUser())" class="avatar-small avatar-left" alt="头像"
        @error="e => { const t = e.target as HTMLImageElement | null; if(t) t.style.display='none'; }" />
      <span v-else class="avatar-small avatar-left" :style="{backgroundColor: currentUser()?.color}">{{ currentUser()?.username ? currentUser()?.username[0] : '' }}</span>
      <div class="bubble-content selectable">{{ msg.content }}</div>
    </template>
  </div>
</template>
            </div>
            <div class="chat-input">
              <div class="input-main">
                <textarea
                  v-model="inputMessage"
                  placeholder="输入消息，按Enter发送"
                  rows="1"
                  ref="textareaRef"
                  @input="autoResize"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.shift.enter.stop
                />
                <button class="send-button" @click="sendMessage">发送</button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="chat-placeholder">
            <span class="callme-logo">Call Me</span>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="activeTab === 'contacts'">
      <ContactsPage />
    </template>
    <template v-else-if="activeTab === 'moments'">
      <MomentsPage />
    </template>
    <template v-else-if="activeTab === 'profile'">
      <ProfilePage />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import eventBus from '@/eventBus'
import axios from 'axios'
let ws: WebSocket | null = null
let reconnectTimer: any = null // 自动重连定时器
import MainNav from '@/views/chat/MainNav.vue'
import ContactsPage from '@/views/chat/ContactsPage/ContactsPage.vue'
import MomentsPage from '@/views/chat/MomentsPage/MomentsPage.vue'
import ProfilePage from '@/views/chat/ProfilePage.vue'

interface User {
  _id: string
  username: string
  color?: string
  avatar?: string
  name?: string
}
interface Message {
  id: number
  sender: 'me' | 'other'
  content: string
  time?: string | number // 增加时间字段
}

const user = JSON.parse(localStorage.getItem('user') || '{}')
const users = ref<User[]>([])
const messages = ref<Record<string, Message[]>>({})
// 未读消息计数
const unreadCount = ref<Record<string, number>>({})

const activeTab = ref('chat')
const userSearch = ref('')
const selectedUserId = ref<string>('') // 初始为空，未选中任何好友
const inputMessage = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 拉取好友列表
async function fetchFriends() {
  const res = await axios.get('/api/friend/list', {
    params: { userId: user._id || user.userId }
  })
  // 给每个好友分配一个随机颜色
  users.value = (res.data || []).filter(Boolean).map((u: any) => ({
    ...u,
    color: u.color || getRandomColor()
  }))
  // 初始化所有好友的未读数属性，防止新加好友无红点属性
  users.value.forEach(u => {
    if (!(u._id in unreadCount.value)) {
      unreadCount.value[u._id] = 0;
    }
  });
  // 不自动选中任何好友，selectedUserId 保持为 ''
}

function getRandomColor() {
  const colors = ['#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#fab1a0', '#fdcb6e']
  return colors[Math.floor(Math.random() * colors.length)]
}

const filteredUsers = computed(() =>
  (users.value || []).filter(Boolean).filter(user =>
    (user.username || '').toLowerCase().includes(userSearch.value.toLowerCase())
  )
)

async function switchUser(id: string) {
  selectedUserId.value = id
  await fetchHistory(id)
  // 切换会话时清零未读，保证响应式
  unreadCount.value = { ...unreadCount.value, [id]: 0 };
  nextTick(scrollToBottom)
}

async function fetchHistory(friendId: string) {
  const res = await axios.get('/api/message/list', {
    params: { userId: user._id || user.userId, friendId }
  });
  messages.value[friendId] = (res.data || []).map((msg: any) => ({
    id: msg._id,
    sender: msg.from === user._id ? 'me' : 'other',
    content: msg.content,
    time: msg.createdAt // 新增时间
  }));
  nextTick(scrollToBottom);
}

// 监听 selectedUserId 变化自动拉取历史消息
watch(selectedUserId, (newId: string) => {
  if (newId) fetchHistory(newId);
});

// ws.onmessage 已自动追加消息，无需变动

function currentUser() {
  return users.value.find(user => user._id === selectedUserId.value)
}

function currentMessages() {
  return messages.value[selectedUserId.value] || []
}

// 发送消息（只通过 ws 推送，所有消息追加都靠 ws.onmessage）
async function sendMessage() {
  const msg = inputMessage.value.trim();
  if (!msg) return;
  const fromId = user._id || user.userId || '';
  if (!fromId) {
    alert('当前用户信息异常，请重新登录或刷新页面！');
    return;
  }
  // 先保存到数据库
  try {
    await axios.post('/api/message/send', {
      from: String(fromId),
      to: String(selectedUserId.value || ''),
      content: msg
    });
  } catch (e) {
    const err = e as any;
    alert('发送失败: ' + (err.response?.data?.message || err.message));
    return;
  }
  // 通过 WebSocket 推送，服务端会推送给双方
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'chat',
      from: fromId,
      to: selectedUserId.value,
      content: msg
    }));
  }
  // 不再本地追加，由 ws.onmessage 统一处理
  inputMessage.value = '';
  nextTick(scrollToBottom);
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function autoResize() {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
}

function onNavTabChange(tab: string) {
  activeTab.value = tab
}

function clearChat() {
  selectedUserId.value = ''
}

function getAvatar(obj: any) {
  if (!obj) return '';
  return obj.avatar || '';
}

// 监听 localStorage storage 事件，user 变化时自动刷新好友列表
window.addEventListener('storage', (e) => {
  if (e.key === 'user') fetchFriends()
})
onMounted(() => {
  fetchFriends()
  eventBus.on('friend-added', fetchFriends)
  scrollToBottom()
  connectWS()
})

onUnmounted(() => {
  eventBus.off('friend-added', fetchFriends)
})

function connectWS() {
  if (ws) ws.close();
  // 动态拼接 ws 地址，适配本地和服务器
  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const wsHost = window.location.host; // 自动获取当前域名和端口
  // ws = new WebSocket(`${wsProtocol}://${wsHost}/ws`);
  ws = new WebSocket("ws://8.134.188.92:3002");
  ws.onopen = () => {
    console.log('[ws] 连接已建立');
    ws!.send(JSON.stringify({ type: 'init', userId: user._id || user.userId }));
  };
  // WebSocket 消息处理（所有聊天消息都靠 ws 推送）
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'chat') {
    // 判断消息归属
    // 统一用字符串比较，兼容 _id/userId
    const myId = String(user._id || user.userId || '');
    const isMe = String(data.from) === myId;
    let unreadKey = '';
    if (isMe) {
      // 自己发出的消息，只追加到当前会话窗口
      if (!messages.value[selectedUserId.value]) messages.value[selectedUserId.value] = [];
      messages.value[selectedUserId.value] = [
        ...messages.value[selectedUserId.value],
        {
          id: Date.now(),
          sender: 'me',
          content: data.content,
          time: data.time || Date.now()
        }
      ];
      // 自己发消息不计未读
    } else {
      // 好友发来的消息
      if (!messages.value[data.from]) messages.value[data.from] = [];
      messages.value[data.from] = [
        ...messages.value[data.from],
        {
          id: Date.now(),
          sender: 'other',
          content: data.content,
          time: data.time || Date.now()
        }
      ];
      unreadKey = String(data.from);
    }
    // 未读数逻辑：只有收到好友消息且不是当前会话时才计数
    if (unreadKey && unreadKey !== selectedUserId.value) {
      unreadCount.value = { ...unreadCount.value, [unreadKey]: (unreadCount.value[unreadKey] || 0) + 1 };
    } else {
      nextTick(scrollToBottom);
    }
    fetchFriends();
  }
  // 好友变更事件
  if (data.type === 'friend_update') {
    fetchFriends();
  }
};
  ws.onclose = (e) => {
    console.warn('[ws] 连接已断开，2秒后自动重连', e);
    reconnectTimer = setTimeout(connectWS, 2000);
  };
  ws.onerror = (e) => {
    console.error('[ws] 连接出错', e);
    ws?.close();
  };
}
onUnmounted(() => {
  ws?.close();
  if (reconnectTimer) clearTimeout(reconnectTimer);
});
function formatTime(t: string | number | undefined) {
  if (!t) return '';
  let date: Date;
  if (typeof t === 'number') {
    date = new Date(t);
  } else if (!isNaN(Number(t))) {
    date = new Date(Number(t));
  } else {
    date = new Date(t);
  }
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

// 仅当与上一条消息时间大于5分钟时显示时间
function shouldShowTime(msg: any, idx: number, arr: any[]) {
  if (!msg.time) return false;
  if (idx === 0) return true;
  const cur = new Date(msg.time).getTime();
  const prev = arr[idx - 1]?.time ? new Date(arr[idx - 1].time).getTime() : 0;
  // 5分钟=300000毫秒
  return cur - prev > 5 * 60 * 1000;
}

</script>

<style lang="scss">@use './ChatPage.scss' as *;
.unread-dot {
  position: absolute;
  right: 2px;
  top: 2px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  background: #ff3b30;
  color: #fff;
  border-radius: 9px;
  font-size: 12px;
  text-align: center;
  padding: 0 4px;
  z-index: 2;
  box-shadow: 0 0 2px #fff;
}
.bubble-time-top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 4px auto;
  font-size: 12px;
  color: #fff;
  background: #bfbfbf;
  border-radius: 10px;
  padding: 2px 14px;
  width: fit-content;
  min-width: 48px;
  box-sizing: border-box;
  opacity: 0.95;
}

.chat-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.callme-logo {
  font-size: 3.5rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive, sans-serif;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #19e6b3 0%, #1e90ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  text-shadow: 3px 5px 8px rgba(30, 144, 255, 0.18);
  user-select: none;
  padding: 0 10px;
  margin: 0 auto;
  display: inline-block;
}
.msg-red-dot {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  background: #ff3b30;
  color: #fff;
  border-radius: 9px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  font-weight: bold;
  box-shadow: 0 0 2px #fff;
  z-index: 2;
}
</style>