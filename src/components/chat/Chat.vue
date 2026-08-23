<script setup>
import MessageBouble from './message/MessageBouble.vue'
import SendMessage from './message/send/SendMessage.vue'
import { ref, watch } from 'vue'

const conversation = ref({
    conversationId: null,
    title: '',
    messages: []
}
)

const emit = defineEmits(['conversationCreated'])

const props = defineProps({
    conversationId: {
        type: Number,
        default: null
    }
})

watch(() => props.conversationId, async (newId) => {
    if (newId !== null) {
        const fetchedConversation = await window.api.conversations.getWithId(newId)
        const fetchedMessages = await window.api.messages.get(newId)
        const formattedMessages = fetchedMessages.map((message) => {
            return {
                text: message.content,
                isOwn: message.role === 'user',
            }
        })
        conversation.value = {
            conversationId: fetchedConversation.id,
            title: fetchedConversation.title,
            messages: formattedMessages
        }
        console.log('Fetched conversation:', conversation.value, 'fetched conversations: ', fetchedConversation)
    } else {
        conversation.value = {
            conversationId: null,
            title: '',
            messages: []
        }
    }
}, { immediate: true })



const formatMessages = (messageToFormat = null) => {
    if (messageToFormat) {
        return [
            {
                role: messageToFormat.isOwn ? 'user' : 'assistant',
                content: messageToFormat.text
            }
        ]
    }
    const formattedMessages = conversation.value.messages.map((message) => {
        return {
            role: message.isOwn ? 'user' : 'assistant',
            content: message.text
        }
    })
    return formattedMessages
}

const handleSend = async (message) => {
    if (conversation.value.messages.length === 0) {
        const response = await fetch('http://127.0.0.1:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: formatMessages({
                    text: `Du ska generera en kort och relevant titel baserat på meddelandet som skickas till dig. Regler: Svara endast med titeln. Ingen förklaring, introduktion eller annan text. Titeln får vara maximalt 20 tecken lång, inklusive mellanslag. Gör titeln så beskrivande och relevant som möjligt. Använd samma språk som meddelandet. Använd inte citattecken runt titeln. Om meddelandet handlar om en fråga eller ett problem, skapa en titel som sammanfattar ämnet snarare än själva frågan. Meddelande: ${message}`,
                    isOwn: true
                }
                )
            })
        })
        if (!response.ok) {
            console.error('Error generating title:', response.statusText)
            return
        }
        const data = await response.json()
        const newConversation = await window.api.conversations.create(data.reply.content)
        conversation.value.conversationId = newConversation.id
        conversation.value.title = newConversation.title
    }
    const sentMessage = {
        text: message,
        author: 'Joel',
        isOwn: true,
        role: 'user'
    }
    conversation.value.messages.push(sentMessage)

    const newMessage = await window.api.messages.create(conversation.value.conversationId, sentMessage.isOwn ? 'user' : 'assistant', sentMessage.text)

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
    conversation.value.messages.push(receivedMessage)

    const newReceivedMessage = await window.api.messages.create(conversation.value.conversationId, receivedMessage.isOwn ? 'user' : 'assistant', receivedMessage.text)
}
</script>

<template>
	<section class="chat">
        <div class="message">
        <MessageBouble
            v-for="(message, index) in conversation.messages"
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
    left: 50%;
    transform: translateX(-50%);
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
