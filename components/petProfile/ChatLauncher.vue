<template>
    <v-dialog
        v-model="dialog"
        :height="$vuetify.display.smAndDown ? undefined : '90%'"
        :width="$vuetify.display.smAndDown ? undefined : '75%'"
        :fullscreen="$vuetify.display.smAndDown"
    >
        <template v-slot:activator="{ props }">
            <v-btn
                color="pink-accent-1"
                variant="elevated"
                @click="openChat"
            >
                Open Chat
            </v-btn>
        </template>
        
        <VCard class="fill-height" density="compact">
            <Chat :chatID="chatUID" :petID="petID" :isStranger="false" :strangerName="strangerName" @close="closeChat()"/>
        </VCard>
    </v-dialog>
</template>

<script lang="ts">
import Chat from "../Chat.vue"
import ChatModel from "types/models/chat";

export default {
    components: {Chat},
    props: {
        petID: String,
        chatID: String,
        strangerName: String
    },
    data () {
        return {
            dialog: false,
            chatUID: undefined as string|undefined
        }
    },
    methods: {
        async openChat() {
            try {
                const chatRes = await $fetch<ChatModel>(`/api/pet/${this.petID}/chat/${this.chatID}/get`)

                this.dialog = true;
                this.chatUID = chatRes.Chat_UID;
            } catch(e) {
                return;
            }
        },
        closeChat() {
            this.dialog = false;
        },
        chatEnded() {
            this.dialog = false;
        }
    }
}
</script>