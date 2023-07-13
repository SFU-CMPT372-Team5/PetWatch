<template>
    <template v-if="!loggedIn">
        <VBtn color="blue-darken-2" @click="signIn('auth0')">Start Chat (Login Required)</VBtn>
    </template>

    <template v-else>
        <div class="text-center">
            <v-dialog
                v-model="dialog"
                fullscreen
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        color="blue-darken-2"
                        @click="startChat"
                    >
                        Start Chat
                    </v-btn>
                </template>
                
                <VCard>
                    <VCardActions>
                        <VBtn color="red-darken-2" variant="elevated" @click="() => dialog=false">Close Chat</VBtn>
                    </VCardActions>
                    <Chat :chatID="chatUID" :ownerName="ownerName" :isStranger="true"/>
                </VCard>
            </v-dialog>
        </div>
    </template>
</template>

<script setup lang="ts">
const {signIn} = useAuth();
</script>

<script lang="ts">
import Chat from "../Chat.vue"
import ChatModel from "types/models/chat";

export default {
    components: {Chat},
    props: {
        loggedIn: Boolean,
        ownerName: String
    },
    data () {
        return {
            dialog: false,
            loadChat: false,
            chatUID: undefined as string|undefined
        }
    },
    methods: {
        async startChat() {
            this.loadChat = true;
            try {
                const chatRes = await $fetch<ChatModel>(`/api/pet/${this.$route.params.petID}/chat/create`, {
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