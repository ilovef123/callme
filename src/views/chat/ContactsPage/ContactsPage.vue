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
          <ul class="contacts-list">
            <li v-for="contact in filteredContacts" :key="contact.id" class="contacts-item"
                :class="{active: selectedUser && selectedUser.id === contact.id}"
                @click="selectUser(contact)">
              <div class="avatar-wechat" :style="{ backgroundColor: contact.color }">{{ contact.name[0] }}</div>
              <span class="contact-name-wechat" v-html="highlight(contact.name)"></span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 右侧：用户信息展示 -->
      <div class="contacts-right-panel">
        <div v-if="selectedUser" class="user-info-card">
          <div class="avatar-wechat" :style="{ backgroundColor: selectedUser.color, marginRight: '0', marginBottom: '18px' }">{{ selectedUser.name ? selectedUser.name[0] : '' }}</div>
          <div class="user-info-name">{{ selectedUser.name }}</div>
          <div v-if="selectedUser.remark" class="user-info-remark">备注：{{ selectedUser.remark }}</div>
          <div v-if="selectedUser.phone" class="user-info-phone">手机号：{{ selectedUser.phone }}</div>
        </div>
        <div v-else class="user-info-placeholder">请选择左侧联系人</div>
      </div>
      <!-- 添加联系人弹窗 -->
      <div v-if="addModalVisible" class="contact-detail-modal" @click.self="addModalVisible = false">
        <div class="contact-detail-card">
          <div class="contact-detail-info">
            <div class="contact-detail-name">添加联系人</div>
            <input v-model="addForm.name" class="add-input" placeholder="姓名" @keydown="onAddKeydown" />
            <input v-model="addForm.remark" class="add-input" placeholder="备注" @keydown="onAddKeydown" />
            <input v-model="addForm.phone" class="add-input" placeholder="手机号" @keydown="onAddKeydown" />
          </div>
          <button class="detail-close-btn" @click="addContact">添加</button>
          <button class="detail-close-btn" style="background:#aaa;" @click="addModalVisible = false">取消</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
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
  } from './ContactsPage'
  </script>
  
  <style scoped lang="scss">
  @import './ContactsPage.scss';
  </style>