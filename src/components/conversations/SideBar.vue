<template>
	<aside class="sidebar">
		<div class="sidebar__header">
			<h2>Conversations</h2>
			<button type="button" aria-label="New conversation" @click="createConversation">+</button>
		</div>

		<ul class="conversation-list">
			<li v-for="conversation in conversations" :key="conversation.id">
				<button
					type="button"
					class="conversation"
					:class="{ 'conversation--active': conversation.id === activeId }"
					@click="selectConversation(conversation.id)"
				>
					{{ conversation.title }}
				</button>
			</li>
		</ul>
	</aside>
</template>

<script setup>
import { ref, watch } from 'vue'

const conversations = ref([])
const activeId = ref(null)

const emit = defineEmits(['conversationSelected'])

const props = defineProps({
  conversationCreated: {
    type: Function,
    required: true
  }
})

watch(() => props.conversationCreated, (newConversation) => {
  if (newConversation) {
    conversations.value.unshift(newConversation)
    activeId.value = newConversation.conversationId
  }
})

const getConversations = async () => {
  try {
    conversations.value = await window.api.conversations.get()
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return []
  }
}

function createConversation() {
	const conversation = { id: Date.now(), title: 'New conversation' }
	conversations.value.unshift(conversation)
	activeId.value = conversation.id
}

function selectConversation(id) {
	activeId.value = id
    emit('conversationSelected', id)
}

getConversations()
</script>

<style scoped>
.sidebar {
	width: 260px;
	height: 100%;
	padding: 1rem;
	background: #3d3f4d;
	border-right: 1px solid #e2e5e9;
}

.sidebar__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
}

h2 {
	margin: 0;
	font-size: 1rem;
}

button {
	border: 0;
	cursor: pointer;
}

.sidebar__header button {
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	color: #fff;
	background: #2563eb;
	font-size: 1.25rem;
}

.conversation-list {
	display: grid;
	gap: .25rem;
	padding: 0;
	margin: 0;
	list-style: none;
}

.conversation {
	width: 100%;
	padding: .75rem;
	border-radius: .5rem;
	background: transparent;
	text-align: left;
}

.conversation:hover,
.conversation--active {
	background: #686b7e;
}
</style>
