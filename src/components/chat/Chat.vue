<script setup>
import MessageBouble from './message/MessageBouble.vue'
import SendMessage from './message/send/SendMessage.vue'
import { ref } from 'vue'

const messages = ref([])

const formatMessages = () => {
    const formattedMessages = messages.value.map((message) => {
        return {
            role: message.isOwn ? 'user' : 'assistant',
            content: message.text
        }
    })
    return formattedMessages
}

const handleSend = async (message) => {
    const sentMessage = {
        text: message,
        author: 'Joel',
        isOwn: true,
        role: 'user'
    }
    messages.value.push(sentMessage)
    const response = await fetch('http://127.0.0.1:8000/api/chat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        messages: formatMessages()
    })
})

    if (!response.ok) {
        console.error('Error sending message:', response.statusText)
        return
    }

    const data = await response.json()
    const receivedMessage = {
        text: data.reply.content,
        author: 'AI',
        isOwn: false,
        role: data.reply.role
    }
    messages.value.push(receivedMessage)
}
</script>

<template>
	<section class="chat">
        <div class="message">
        <MessageBouble
            v-for="(message, index) in messages"
            :key="index"
            :text="message.text"
            :author="message.author"
            :is-own="message.isOwn"
        />
        </div>
		<SendMessage @send="(message) => handleSend(message)" class="send-message"/>
	</section>
</template>

<style scoped>
.send-message {
    position: fixed;
    bottom: 0;
    width: min(100%, 50em);
    background-color: var(--background);
    padding: 10px;
}
.message {
    width: min(100%, 50em);
    padding-bottom: 15rem;
}
.chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
}
</style>
