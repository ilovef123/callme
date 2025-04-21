<template>
  <div class="chat-page">
    <div class="chat-container">
      <div class="sidebar">
        <input type="text" class="search" placeholder="搜索用户" />
        <ul class="user-list">
          <li
            v-for="user in users"
            :key="user.id"
            :class="{ active: user.id === selectedUserId }"
            @click="switchUser(user.id)"
          >
            <div class="avatar" :style="{ backgroundColor: user.color }">
              {{ user.name[0] }}
            </div>
            <span>{{ user.name }}</span>
          </li>
        </ul>

      </div>
      <div class="chat-window">
        <div class="chat-header">{{ currentUser().name }}</div>
        <div class="chat-messages">
          <div
            v-for="(msg, index) in currentMessages()"
            :key="index"
            :class="['bubble', msg.from === 'me' ? 'me' : 'other']"
          >
            {{ msg.text }}
          </div>
        </div>

        <div class="chat-input">
          <div class="input-top">
            <div class="icons-left">
              <i class="iconfont icon-face" />
              <i class="iconfont icon-file" />
              <i class="iconfont icon-cut" />
              <i class="iconfont icon-comment" />
            </div>
            <div class="icons-right">
              <i class="iconfont icon-record" />
              <i class="iconfont icon-call" />
            </div>
          </div>
          <div class="input-main">
            <textarea placeholder="输入消息..." rows="1" v-model="inputMessage" />
            <button class="send-button" @click="sendMessage">发送(S)</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ChatPage.ts"></script>
<style lang="scss" src="./ChatPage.scss" scoped></style>
