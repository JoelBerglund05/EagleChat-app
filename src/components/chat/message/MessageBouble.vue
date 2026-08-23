<template>
  <div class="message-bouble" :class="{ 'is-own': isOwn, 'is-system': isSystem }">
    <div v-if="avatar && !isOwn" class="message-bouble__avatar">
      <img :src="avatar" :alt="author || 'User'" />
    </div>

    <div class="message-bouble__content">
      <div v-if="author && !isOwn" class="message-bouble__author">{{ author }}</div>

      <div class="message-bouble__bubble">
        <slot>{{ text }}</slot>
      </div>

      <div v-if="time" class="message-bouble__time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  isOwn: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.message-bouble {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin: 10px 0;
}

.message-bouble.is-own {
  justify-content: flex-end;
}

.message-bouble.is-system {
  justify-content: center;
}

.message-bouble__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #e8ecf3;
}

.message-bouble__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-bouble__content {
  display: flex;
  flex-direction: column;
  max-width: 72%;
}

.message-bouble.is-own .message-bouble__content {
  align-items: flex-end;
}

.message-bouble__author {
  margin: 0 0 4px 8px;
  font-size: 12px;
  color: #7b7f90;
}

.message-bouble__bubble {
  background: #f3f5f8;
  color: #1f2937;
  padding: 10px 14px;
  border-radius: 16px 16px 16px 4px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.message-bouble.is-own .message-bouble__bubble {
  background: linear-gradient(135deg, #5b8def, #4f46e5);
  color: #fff;
  border-radius: 16px 16px 4px 16px;
}

.message-bouble.is-system .message-bouble__bubble {
  background: #eef2ff;
  color: #4b5563;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
}

.message-bouble__time {
  margin-top: 4px;
  font-size: 11px;
  color: #9aa3b2;
}
</style>
