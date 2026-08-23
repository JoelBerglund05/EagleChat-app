<script setup>
import Chat from './components/chat/Chat.vue'
import SideBar from './components/conversations/SideBar.vue';

import { ref } from 'vue';

const selectedConversationId = ref(null);

const selectConversation = (conversationId) => {
    selectedConversationId.value = conversationId;
};

const conversationCreated = (title, id) => {
    return {
        title: title,
        conversationId: id
    };
};
</script>

<template>
  <div class="app">
        <SideBar @conversationSelected="selectConversation" :conversation-created="conversationCreated"/>
    <main class="main">
      <Chat @conversation-created="conversationCreated" :conversation-id="selectedConversationId" />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
}
</style>
