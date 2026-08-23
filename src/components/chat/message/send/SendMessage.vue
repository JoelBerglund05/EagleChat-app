<template>
  <form class="send-message" @submit.prevent="handleSend">
    <div class="send-message__input-wrap">
      <textarea
        ref="messageInput"
        v-model="message"
        rows="1"
        class="send-message__input"
        placeholder="Type a message..."
        @input="autoResize"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.enter.shift.exact="message += '\n'"
      />

      <button
        type="submit"
        class="send-message__button"
        :disabled="!message.trim() || isSending"
      >
        {{ isSending ? 'Sending...' : 'Send' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['send'])

const message = ref('')
const isSending = ref(false)
const messageInput = ref(null)

const autoResize = () => {
  const el = messageInput.value

  if (!el) return

  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

const handleSend = async () => {
  const text = message.value.trim()

  if (!text || isSending.value) return

  isSending.value = true
  emit('send', text)

  await nextTick()

  message.value = ''
  autoResize()
  isSending.value = false
}

watch(
  () => message.value,
  () => {
    nextTick(autoResize)
  }
)

onMounted(() => {
  autoResize()
})
</script>

<style scoped>
.send-message {
  width: 100%;
}

.send-message__input-wrap {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid #dfe3ea;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0px 0px .25rem rgba(16, 24, 40, .8);
}

.send-message__input {
  flex: 1;
  min-height: 42px;
  max-height: 160px;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  line-height: 1.5;
  color: #101828;
  padding: 8px 0;
}

.send-message__input::placeholder {
  color: #98a2b3;
}

.send-message__button {
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.send-message__button:hover:not(:disabled) {
  opacity: 0.92;
}

.send-message__button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
