<template>
    <VCard>
        <VCardText v-if="namePending">
            <SharedPageLoading />
        </VCardText>

        <template v-else>
            <VCardTitle>
                <!-- Proper things coming soon -->
                {{ strangerName }}
            </VCardTitle>
            <VCardText :class="textPending ? '' : 'truncateOneLine'">
                <VProgressCircular v-if="textPending" indeterminate/>
                <template v-else>{{ lastText }}</template>
            </VCardText>
    
            <!-- <VCardText>Laura: This is a message</VCardText> -->
            <VCardActions style="justify-content: center;">
                <ChatLauncher :chatID="chatData.Chat_UID" :petID="petID" :strangerName="strangerName"/>
            </VCardActions>
        </template>
    </VCard>
</template>

<script lang="ts">
import ChatModel from '~/types/models/chat';
import type { PropType } from 'vue';
import ChatLauncher from './ChatLauncher.vue'
import { UserDetails } from '~/types/models/user';

export default {
    components: {ChatLauncher},
    props: {
        chatData: {
            type: Object as PropType<ChatModel>,
            required: true
        },
        petID: String,        
    },
    data() {
        return {
            namePending: true,
            textPending: true,
            strangerName: undefined as undefined|string,
            lastText: undefined as undefined|string
        }
    },
    methods: {
        async fetchLatestMessage() {
            try {
                const lastMessage = await $fetch(`/api/pet/${this.petID}/chat/${this.chatData.Chat_UID}/latestMessage`);

                if ("text" in lastMessage) {
                    this.lastText = `${lastMessage.isOwnerMessage ? 'You' : 'Them'}: ${lastMessage.text}`;
                }
            } catch(e) {
                this.lastText = "Open to see messages"
            }
            this.textPending = false; //Always do this incase the stranger details fail to arrive
        }
    },
    async mounted() {
        //Get details of users in this chat
        try {
            const chatData = await $fetch(`/api/pet/${this.petID}/chat/${this.chatData.Chat_UID}/memberDetails`);

            if ("strangerDetails" in chatData) {
                this.strangerName = chatData.strangerDetails?.name ?? "Finder";
            } else {
                this.strangerName = "Finder";
            }
            this.namePending = false;
        } catch(e) {
            this.strangerName = "Finder";
            this.namePending = false;
        }

        try {
            const lastMessage = await $fetch(`/api/pet/${this.petID}/chat/${this.chatData.Chat_UID}/latestMessage`);

            if ("text" in lastMessage) {
                this.lastText = `${lastMessage.isOwnerMessage ? 'You' : 'Them'}: ${lastMessage.text}`;
            }
        } catch(e) {
            this.lastText = "Open to see messages"
        }

        this.fetchLatestMessage();
        setInterval(() => {
            this.fetchLatestMessage();
        }, 5000)
    }
}
</script>

<style scoped>
.truncateOneLine {
    white-space: nowrap ;
    word-break: normal;
    overflow: hidden ;
    text-overflow: ellipsis;
}
</style>