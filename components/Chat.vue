<template>
    <!-- https://vuetifyjs.com/en/components/sheets/ I normally just follow examples to see how to use these -->
    
    <VSheet rounded height="100%">
        <!-- Fluid means "fill parent div horizontally as best as possible with snapping to only select dimensions" -->
        <VContainer fluid style="display: flex; flex-direction: column; height: 100%;">
            <!-- Chat feed -->
            <VCard color="teal" variant="flat">
                <VCardTitle>Chat with: {{ ownerName }}</VCardTitle>
            </VCard>
            <VSheet color="grey-lighten-2" rounded style="overflow-y: auto; flex-grow: 1; height: 100%;">
                
                <VContainer fluid class="chatContainer" ref="chatContainer">
                    <!-- Cant be bothered with sockets for now -->
                    <VBtn location="center center" position="absolute" style="max-width: fit-content;" @click="checkForNewMessages" :loading="checkNewMessageLoading">Check for new messages</VBtn>
                    <!-- <InfoMessage/> -->

                    <template v-for="(message, index) in messages">
                        <!-- Assume messages are in chronological order -->
                        <TimeMessage v-if="timeDiffSignificant(message.timestamp, messages[index-1]?.timestamp ?? 0)"
                            :timestamp="message.timestamp"
                        />

                        <ChatMessage
                            :message-content="message.text" 
                            :author-is-local="message.fromLocalAuthor"
                        /> <!-- The ':' in :message-content means "the following text is code, probably referencing a variable" -->
                    </template>

                </VContainer>
            </VSheet>

            <!-- Chat box -->
            <VTextField 
                placeholder="Send Message"
                single-line
                v-model="textBoxData"
                @keydown.enter="submitTextBox"
            >
                <!-- v-model is how text entered in the text box is added to a variable in the data object below -->

                <template v-slot:append-inner>
                    <VFadeTransition>
                        <VIcon 
                            color="green-accent-4" 
                            v-if="textBoxData.length > 0" 
                            @click="submitTextBox"
                        >mdi-send</VIcon>
                    </VFadeTransition>
                </template>
            </VTextField>
        </VContainer>
    </VSheet>
</template>

<script lang="ts">
import MessageModel from "types/models/message";
import ChatMessage from "./chatComponents/ChatMessage.vue";
import InfoMessage from "./chatComponents/InfoMessage.vue";
import TimeMessage from "./chatComponents/TimeMessage.vue";
import {TextMessagePayload} from "~/types/chat/messageTypes";

const SIGNIFICANT_TIME_DIFFERENCE = 1000 * 60 * 30 //30 minutes;

export default {
    components: {ChatMessage, InfoMessage, TimeMessage},
    data() {
        return {
            messages: [
            ] as TextMessagePayload[],
            textBoxData: "",

            checkNewMessageLoading: false
        }
    },
    props: {
        "chatID": String,
        "ownerName": String,
        "isStranger": Boolean
    },
    methods: {
        submitTextBox() {
            if (this.textBoxData.length <= 0) return;
            this.postMessage({
                text: this.textBoxData,
                fromLocalAuthor: true,
                timestamp: Date.now()
            });
            this.textBoxData = "";
        },

        async postMessage(messagePayload: TextMessagePayload) {
            try {
                const sendRes = await $fetch(`/api/pet/${this.$route.params.petID}/chat/${this.chatID}/sendMessage`, {
                    method: "post",
                    body: {
                        text: messagePayload.text
                    }
                })
    
                if (sendRes) {
                    this.messages.push(messagePayload);
                }
            } catch(e) {
                alert(e);
            }
        },

        /**
         * 
         * @param timeA Time such that timeA >= timeB
         * @param timeB 
         * @returns True if timeA >= timeB + Significant diff constant
         */
        timeDiffSignificant(timeA: number, timeB: number) {
            return timeA >= timeB + SIGNIFICANT_TIME_DIFFERENCE
        },

        async refreshMessages() {
            try {
                const messages = await $fetch<MessageModel[]>(`/api/pet/${this.$route.params.petID}/chat/${this.chatID}/messages`)

                this.messages.length = 0;
                messages.forEach(m => {
                    this.messages.push({
                        fromLocalAuthor: !m.isOwnerMessage && this.isStranger,
                        timestamp: m.timeSent,
                        text: m.text
                    })
                })
            } catch(e) {
                alert("error!");
            }
        },
        async checkForNewMessages() {
            this.checkNewMessageLoading = true;
            this.checkForNewMessages();

            setTimeout(() => {
                this.checkNewMessageLoading = false;
            }, 1500)
        }
    },
    mounted() {
        this.refreshMessages();
    }
}
</script>

<style lang="css" scoped>
.chatContainer {
    display: flex;
    min-height: 100% !important;
    flex-direction: column;
    
    justify-content: flex-end;
    align-content: flex-end;
}
</style>