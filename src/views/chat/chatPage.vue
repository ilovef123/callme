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
            <input type="text" v-model="userSearch" placeholder="搜索用户" />
          </div>
          <ul class="contacts-list">
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              :class="['contacts-item', { active: user.id === selectedUserId }]"
              @click="switchUser(user.id)"
            >
              <div class="avatar-wechat" :style="{ backgroundColor: user.color }">
                {{ user.name[0] }}
              </div>
              <span class="contact-name-wechat">{{ user.name }}</span>
            </li>
          </ul>
        </div>
        <div class="chat-right-panel">
          <div class="chat-window">
            <div class="chat-header">{{ currentUser()?.name }}</div>
            <div class="chat-messages" ref="messagesRef">
              <div
                v-for="msg in currentMessages()"
                :key="msg.id"
                :class="['bubble', msg.sender === 'me' ? 'me' : 'other']"
              >
                <div class="bubble-meta">
                  <span v-if="msg.sender !== 'me'" class="avatar-small" :style="{backgroundColor: currentUser()?.color}">{{ currentUser()?.name[0] }}</span>
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
  import { ref, computed, onMounted, nextTick } from 'vue'
  import MainNav from '@/views/chat/MainNav.vue'
  import ContactsPage from '@/views/chat/ContactsPage/ContactsPage.vue'
  import MomentsPage from '@/views/chat/MomentsPage/MomentsPage.vue'
  import ProfilePage from '@/views/chat/ProfilePage.vue'
  import type { User, Message } from './types'
  
  const users = ref<User[]>([
    { id: 1, name: 'Tea', color: '#ff7675' },
    { id: 2, name: 'Gai', color: '#74b9ff' },
    { id: 3, name: 'Zeng', color: '#55efc4' },
    { id: 4, name: 'Chen', color: '#a29bfe' },
    { id: 5, name: 'JJJ', color: '#fab1a0' }
  ])
  const messages = ref<Record<number, Message[]>>({
    1: [{ id: 1, sender: 'me', content: '你好，Tea' }],
    2: [{ id: 2, sender: 'me', content: '你好，Gai' }],
    3: [{ id: 3, sender: 'me', content: '你好，Zeng' }],
    4: [{ id: 4, sender: 'me', content: '你好，Chen' }],
    5: [{ id: 5, sender: 'me', content: '你好，JJJ' }]
  })
  
  const activeTab = ref('chat')
  const userSearch = ref('')
  const selectedUserId = ref(users.value[0].id)
  const inputMessage = ref('')
  const messagesRef = ref<HTMLElement | null>(null)
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  
  const filteredUsers = computed(() =>
    users.value.filter(user =>
      user.name.toLowerCase().includes(userSearch.value.toLowerCase())
    )
  )
  
  function switchUser(id: number) {
    selectedUserId.value = id
    nextTick(scrollToBottom)
  }
  
  function currentUser() {
    return users.value.find(user => user.id === selectedUserId.value)
  }
  
  function currentMessages() {
    return messages.value[selectedUserId.value] || []
  }
  
  function sendMessage() {
    const msg = inputMessage.value.trim()
    if (!msg) return
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
  
  onMounted(scrollToBottom)
  </script>
  
  <style lang="scss" scoped>
  @import './ChatPage.scss';
  </style>