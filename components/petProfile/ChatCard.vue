<template>
    <VCard>
        <VCardTitle>
            <!-- Proper things coming soon -->
            Chat with: {{chatData.strangerID}}
        </VCardTitle>
        <!-- <VCardText>Laura: This is a message</VCardText> -->
        <VCardActions style="justify-content: center;">
            <ChatLauncher :chatID="chatData.Chat_UID" :petID="petID"/>
        </VCardActions>
    </VCard>
</template>

<script lang="ts">
import ChatModel from 'types/models/chat';
import type { PropType } from 'vue';
import ChatLauncher from './ChatLauncher.vue'

export default {
    components: {ChatLauncher},
    props: {
        chatData: {
            type: Object as PropType<ChatModel>,
            required: true
        },
        petID: String,
        strangerName:String
        
    },
    strangerName:'f',
    

    methods: {
        openChat() {
            
        }
    }
}
</script>