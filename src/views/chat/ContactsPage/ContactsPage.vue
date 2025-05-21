<template>
  <div class="contacts-page-layout">
    <!-- 左侧：用户列表 -->
    <div class="contacts-left-panel">
      <div class="contacts-top-bar">
        <span class="contacts-title">联系人</span>
        <button class="add-btn-plain" @click="addModalVisible = true" aria-label="添加朋友">
          <svg width="22" height="22" viewBox="0 0 22 22">
            <line x1="11" y1="6" x2="11" y2="16" stroke="#409eff" stroke-width="2" stroke-linecap="round"/>
            <line x1="6" y1="11" x2="16" y2="11" stroke="#409eff" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="contacts-search-bar">
        <input type="text" v-model="contactsSearch" placeholder="搜索" />
      </div>
      <div class="contacts-list-wrapper">
        <ul class="contacts-list" @click.self="clearContactSelection">
          <li v-for="contact in filteredContacts" :key="contact._id || contact.id" class="contacts-item"
              :class="{active: selectedUser && (String(selectedUser._id || selectedUser.id) === String(contact._id || contact.id))}"
              @click="handleSelectUser(contact)">
            <div class="avatar-wechat" :style="{ backgroundColor: contact.color }">
              <img v-if="getAvatar(contact)" :src="getAvatar(contact)" class="avatar-img" alt="头像" style="width: 48px;height: 48px;border-radius: 7px;"
                   @error="e => { const t = e.target as HTMLImageElement | null; if(t) t.style.display='none'; }" />
              <span v-else>{{ contact.username ? contact.username[0] : (contact.name ? contact.name[0] : '') }}</span>
            </div>
            <span class="contact-name-wechat" v-html="highlight(contact.username || contact.name || '')"></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 右侧：用户信息展示 -->
    <div class="contacts-right-panel">
      <template v-if="selectedUser">
        <div class="user-info-card">
          <div class="avatar-wechat" :style="{ backgroundColor: selectedUser.color, marginRight: '0', marginBottom: '18px' }">
            <img v-if="getAvatar(selectedUser)" :src="getAvatar(selectedUser)" class="avatar-img" alt="头像"
                 @error="e => { const t = e.target as HTMLImageElement | null; if(t) t.style.display='none'; }" />
            <span v-else>{{ selectedUser.username ? selectedUser.username[0] : (selectedUser.name ? selectedUser.name[0] : '') }}</span>
          </div>
          <div class="user-info-name">{{ selectedUser.username || selectedUser.name || '' }}</div>
          <div v-if="selectedUser.remark" class="user-info-remark">备注：{{ selectedUser.remark }}</div>
          <div v-if="selectedUser.iphone || selectedUser.phone" class="user-info-phone">手机号：{{ selectedUser.iphone || selectedUser.phone }}</div>
          <div class="user-info-detail">
            <div v-if="selectedUser.gender"><b>性别：</b>{{ selectedUser.gender }}</div>
            <div v-if="selectedUser.email"><b>邮箱：</b>{{ selectedUser.email }}</div>
            <div v-if="selectedUser.signature"><b>签名：</b>{{ selectedUser.signature }}</div>
            <div v-if="selectedUser.birthday"><b>生日：</b>{{ selectedUser.birthday }}</div>
            <div v-if="selectedUser.address"><b>地址：</b>{{ selectedUser.address }}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="contacts-placeholder">
          <span class="callme-logo">Call Me</span>
        </div>
      </template>
    </div>
    <!-- 添加联系人弹窗 -->
    <div v-if="addModalVisible" class="contact-detail-modal" @click.self="addModalVisible = false">
      <div class="contact-detail-card">
        <div class="contact-detail-info">
          <div class="contact-detail-name">添加联系人</div>
          <input v-model="addForm.phone" class="add-input" placeholder="手机号" @keydown="onAddKeydown" />
        </div>
        <button class="detail-close-btn" @click="addContact">添加</button>
        <button class="detail-close-btn" style="background:#aaa;" @click="addModalVisible = false">取消</button>
        <div v-if="addMsg" style="color:#f56c6c;text-align:center;margin-top:10px;">{{ addMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Contact 类型补全所有用到的字段
interface Contact {
  _id?: string;
  id?: number;
  username?: string;
  name?: string;
  color?: string;
  remark?: string;
  iphone?: string;
  phone?: string;
  avatar?: string;
  gender?: string;
  email?: string;
  signature?: string;
  birthday?: string;
  address?: string;
}

// 使用 Contact 类型修饰相关变量
const contacts = ref<Contact[]>([]);
const selectedUser = ref<Contact | null>(null);
const contactsSearch = ref('');
const filteredContacts = computed(() => {
  if (!contactsSearch.value) return contacts.value;
  return contacts.value.filter(c =>
    (c.username && c.username.includes(contactsSearch.value)) ||
    (c.iphone && c.iphone.includes(contactsSearch.value)) ||
    (c.name && c.name.includes(contactsSearch.value)) ||
    (c.phone && c.phone.includes(contactsSearch.value))
  );
});
const addModalVisible = ref(false);
const addForm = ref({ phone: '' });
const addMsg = ref('');

function handleSelectUser(contact: Contact) {
  console.log('[DEBUG] selectUser:', contact)
  selectedUser.value = contact
  // 也可以在这里弹窗或做其他操作
}

function clearContactSelection() {
  selectedUser.value = null
}

function addContact() {
  addMsg.value = ''
  if (!/^1[3-9]\d{9}$/.test(addForm.value.phone)) {
    addMsg.value = '请输入有效的手机号'
    return
  }
  if (addForm.value.phone === user.iphone) {
    addMsg.value = '不能添加自己为好友'
    return
  }
  axios.post('/api/friend/add', {
    userId: user._id || user.userId,
    friendIphone: addForm.value.phone
  }).then(res => {
    addMsg.value = res.data.message
    if (res.data.success) {
      fetchContacts()
      addForm.value.phone = ''
      addModalVisible.value = false
    }
  }).catch(() => {
    addMsg.value = '添加失败，请重试'
  })
}

function onAddKeydown(event: KeyboardEvent) {
  // 添加联系人keydown事件逻辑
}

function highlight(text: string) {
  // 高亮搜索关键词逻辑
  return text
}

function getAvatar(obj: any) {
  if (!obj) return '';
  return obj.avatar || '';
}

// 获取当前登录用户
const user = JSON.parse(localStorage.getItem('user') || '{}');

async function fetchContacts() {
  try {
    const res = await axios.get('/api/friend/list', {
      params: { userId: user._id || user.userId }
    });
    contacts.value = res.data || [];
    console.log('接口获取到的联系人', contacts.value);
  } catch (e) {
    contacts.value = [];
    selectedUser.value = null;
    console.error('获取联系人失败', e);
  }
}

onMounted(fetchContacts);
</script>

<style lang="scss">
@use './ContactsPage.scss' as *;
.contacts-placeholder {
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
.user-info-detail {
  margin-top: 18px;
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  word-break: break-all;
  b {
    color: #222;
    font-weight: bold;
    margin-right: 6px;
  }
}
</style>