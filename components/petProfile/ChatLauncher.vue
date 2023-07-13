<template>
    <v-dialog
        v-model="dialog"
        fullscreen
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
        
        <VCard>
            <VCardActions>
                <VBtn color="red-darken-2" variant="elevated" @click="() => dialog=false">Close Chat</VBtn>
            </VCardActions>
            <Chat :chatID="chatUID" :petID="petID" strangerName="Finder" :isStranger="false"/>
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
        chatID: String
    },
    data () {
        return {
            dialog: false,
            loadChat: false,
            chatUID: undefined as string|undefined
        }
    },
    methods: {
        async openChat() {
            this.loadChat = true;
            try {
                const chatRes = await $fetch<ChatModel>(`/api/pet/${this.petID}/chat/${this.chatID}/get`, {
                    method: "post"
                })

                this.dialog = true;
                this.chatUID = chatRes.Chat_UID;
            } catch(e) {
                alert("error")
                this.loadChat = false;
                return;
            }
        }
    }
}
</script>