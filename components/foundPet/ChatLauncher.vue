<template>
    <template v-if="!loggedIn">
        <VBtn color="blue-darken-2" @click="signIn('auth0')">Start Chat (Login Required)</VBtn>
    </template>

    <template v-else>
        <div class="text-center">
            <v-dialog
                v-model="dialog"
                :height="$vuetify.display.smAndDown ? undefined : '90%'"
                :width="$vuetify.display.smAndDown ? undefined : '75%'"
                :fullscreen="$vuetify.display.smAndDown"
            >
                <template v-slot:activator="{ props }">
                    <v-btn
                        color="blue-darken-2"
                        @click="startChat"
                    >
                        Start Chat
                    </v-btn>
                </template>
                
                <VCard class="fill-height" density="compact">
                    <Chat :chatID="chatUID" :petID="($route.params!.petID as string)" :strangerName="ownerName" :isStranger="true" @close="closeChat" @chatEnded="chatEnded"/>
                </VCard>
                <VDialog v-model="endedDialog" persistent>
                    <VRow justify="center">
                        <VCard width="min-content" color="indigo-darken-1" rounded="xl" class="pa-5">
                            <VCardTitle class=text-center>
                                <VIcon size="72" >mdi-sleep</VIcon><br>
                                Chat Ended
                            </VCardTitle>
                            <VCardActions>
                                <VBtn variant="elevated" color="green-darken-3" @click="closeChat();">Close Chat</VBtn>
                            </VCardActions>
                        </VCard>
                    </VRow>
                </VDialog>
            </v-dialog>

        </div>
    </template>
</template>

<script setup lang="ts">
const {signIn} = useAuth();
</script>

<script lang="ts">
import Chat from "../Chat.vue"
import ChatModel from "~/types/models/chat";

export default {
    components: {Chat},
    props: {
        loggedIn: Boolean,
        ownerName: String
    },
    data () {
        return {
            dialog: false,
            endedDialog: false,
            chatUID: undefined as string|undefined
        }
    },
    methods: {
        async startChat() {
            try {
                const chatRes = await $fetch<ChatModel>(`/api/pet/${this.$route.params.petID}/chat/create`, {
                    method: "post"
                })
                this.chatUID = chatRes.Chat_UID;
                this.dialog = true;
            } catch(e) {
                alert("Could not create chat")
                return;
            }
        },
        chatEnded() {
            //When the chat is forcefully ended (such as when the pet is marked as found)
            this.endedDialog = true;
        },
        closeChat() {
            this.dialog = false;
            this.endedDialog = false;
        }
    }
}
</script>