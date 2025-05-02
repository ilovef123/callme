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
            v-for="user in filteredUsers"
            :key="user._id"
            :class="['contacts-item', { active: user._id === selectedUserId }]"
            @click="switchUser(user._id)"
          >
            <div class="avatar-wechat" :style="{ backgroundColor: user.color }">
  <img v-if="user.avatar" :src="user.avatar" class="avatar-img" alt="头像" @error="e => e.target.style.display='none'" />
  <span v-else>{{ user.username ? user.username[0] : '' }}</span>
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
              <div
                v-for="msg in currentMessages()"
                :key="msg.id"
                :class="['bubble', msg.sender === 'me' ? 'me' : 'other']"
              >
                <div class="bubble-meta">
                  <span v-if="msg.sender !== 'me'">
                    <img v-if="currentUser()?.avatar" :src="currentUser()?.avatar" class="avatar-small" alt="头像" @error="e => e.target.style.display='none'" />
                    <span v-else class="avatar-small" :style="{backgroundColor: currentUser()?.color}">{{ currentUser()?.username ? currentUser()?.username[0] : '' }}</span>
                  </span>
                </div>
                <div class="bubble-content selectable">{{ msg.content }}</div>
              </div>
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
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import eventBus from '@/eventBus'
import axios from 'axios'
let ws: WebSocket | null = null
import MainNav from '@/views/chat/MainNav.vue'
import ContactsPage from '@/views/chat/ContactsPage/ContactsPage.vue'
import MomentsPage from '@/views/chat/MomentsPage/MomentsPage.vue'
import ProfilePage from '@/views/chat/ProfilePage.vue'

interface User {
  _id: string
  username: string
  color?: string
}
interface Message {
  id: number
  sender: 'me' | 'other'
  content: string
}

const user = JSON.parse(localStorage.getItem('user') || '{}')
const users = ref<User[]>([])
const messages = ref<Record<string, Message[]>>({})

const activeTab = ref('chat')
const userSearch = ref('')
const selectedUserId = ref<string>('') // 初始为空，未选中任何好友
const inputMessage = ref('')
const messagesRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// 拉取好友列表
async function fetchFriends() {
  const res = await axios.get('http://localhost:3001/api/friend/list', {
    params: { userId: user._id || user.userId }
  })
  // 给每个好友分配一个随机颜色
  users.value = (res.data || []).map((u: any) => ({
    ...u,
    color: u.color || getRandomColor()
  }))
  // 不自动选中任何好友，selectedUserId 保持为 ''
}

function getRandomColor() {
  const colors = ['#ff7675', '#74b9ff', '#55efc4', '#a29bfe', '#fab1a0', '#fdcb6e']
  return colors[Math.floor(Math.random() * colors.length)]
}

const filteredUsers = computed(() =>
  users.value.filter(user =>
    (user.username || '').toLowerCase().includes(userSearch.value.toLowerCase())
  )
)

async function switchUser(id: string) {
  selectedUserId.value = id
  await fetchHistory(id)
  nextTick(scrollToBottom)
}

async function fetchHistory(friendId: string) {
  const res = await axios.get('http://localhost:3001/api/message/list', {
    params: { userId: user._id || user.userId, friendId }
  })
  messages.value[friendId] = (res.data || []).map((msg: any) => ({
    id: msg._id,
    sender: msg.from === user._id ? 'me' : 'other',
    content: msg.content
  }))
}

function currentUser() {
  return users.value.find(user => user._id === selectedUserId.value)
}

function currentMessages() {
  return messages.value[selectedUserId.value] || []
}

async function sendMessage() {
  const msg = inputMessage.value.trim()
  if (!msg) return
  // 先保存到数据库
  await axios.post('http://localhost:3001/api/message/send', {
    from: user._id,
    to: selectedUserId.value,
    content: msg
  })
  // 通过 WebSocket 推送给对方
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'chat',
      from: user._id,
      to: selectedUserId.value,
      content: msg
    }))
  }
  // 本地追加消息
  if (!messages.value[selectedUserId.value]) messages.value[selectedUserId.value] = []
  messages.value[selectedUserId.value].push({
    id: Date.now(),
    sender: 'me',
    content: msg
  })
  inputMessage.value = ''
  nextTick(scrollToBottom)
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
  if (ws) ws.close()
  ws = new WebSocket('ws://localhost:3002')
  ws.onopen = () => {
    ws!.send(JSON.stringify({ type: 'init', userId: user._id || user.userId }))
  }
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'chat') {
      // 只处理当前聊天对象的消息
      if (data.from === selectedUserId.value) {
        if (!messages.value[selectedUserId.value]) messages.value[selectedUserId.value] = []
        messages.value[selectedUserId.value].push({
          id: Date.now(),
          sender: 'other',
          content: data.content
        })
        nextTick(scrollToBottom)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './ChatPage.scss';
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
</style>