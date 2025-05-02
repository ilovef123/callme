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
              :class="{active: selectedUser && (selectedUser._id === contact._id || selectedUser.id === contact.id)}"
              @click="selectUser(contact)">
            <div class="avatar-wechat" :style="{ backgroundColor: contact.color }">
  <img v-if="contact.avatar" :src="contact.avatar" class="avatar-img" alt="头像" @error="e => e.target.style.display='none'" />
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
  <img v-if="selectedUser.avatar" :src="selectedUser.avatar" class="avatar-img" alt="头像" @error="e => e.target.style.display='none'" />
  <span v-else>{{ selectedUser.username ? selectedUser.username[0] : (selectedUser.name ? selectedUser.name[0] : '') }}</span>
</div>
          <div class="user-info-name">{{ selectedUser.username || selectedUser.name || '' }}</div>
          <div v-if="selectedUser.remark" class="user-info-remark">备注：{{ selectedUser.remark }}</div>
          <div v-if="selectedUser.iphone || selectedUser.phone" class="user-info-phone">手机号：{{ selectedUser.iphone || selectedUser.phone }}</div>
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
import { onMounted } from 'vue'
import {
  contacts,
  contactsSearch,
  filteredContacts,
  highlight,
  selectedUser,
  selectUser,
  addModalVisible,
  addForm,
  addContact,
  onAddKeydown,
  addMsg,
  fetchContacts
} from './ContactsPage'

function clearContactSelection() {
  selectedUser.value = null
}

onMounted(fetchContacts)
</script>

<style scoped lang="scss">
@import './ContactsPage.scss';
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
</style>