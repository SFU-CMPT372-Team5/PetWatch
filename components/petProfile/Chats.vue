<template>
    <VCard>
        <VCardTitle class="text-center">
            Chats
        </VCardTitle>

        <VContainer>
            <VRow justify="center">
            <VCol :cols="chatCardCols" v-for="chat in chatData">
                <PetProfileChatCard :chatData="chat" :petID="(chat.petID as string)" />
            </VCol>
            </VRow>
        </VContainer>
    </VCard>
</template>

<script lang="ts">
import ChatModel from 'types/models/chat';
export default {
    props: {
        petID: {
            type: String,
            required: true
        }
    },
    data: () => {
        return {
            chatData: undefined as undefined|ChatModel[],
            chatRefresh: undefined as NodeJS.Timeout|undefined
        }
    },
    computed: {
        chatCardCols() {
            if (this.$vuetify.display.lgAndUp) return 3;
            if (this.$vuetify.display.md) return 4;
            if (this.$vuetify.display.sm) return 6;
            return 12;
        }
    },
    methods: {
        async fetchChats() {
            try {
                const chatData = await $fetch<ChatModel[]>(`/api/pet/${this.petID}/chats`)

                if (chatData != undefined) {
                    this.chatData = chatData;
                }
            } catch(e) {}
        }
    },
    async mounted() {
        this.chatRefresh = setInterval(() => {
            this.fetchChats()
        }, 15000)

        this.fetchChats();
    },
    onUnmounted() {
        clearInterval(this.chatRefresh);  
    }
    
}
</script>