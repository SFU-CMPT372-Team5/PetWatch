<template>
    <VContainer fluid style="display: flex; flex-direction: column; height: 100%;" class="pa-0">
        <!-- Chat feed -->
        <VCard color="teal" variant="flat" class="pb-3 pt-3" >
            <VCardTitle>
                <VBtn color="red-darken-3" class="mr-4" @click="$emit('close')">Close</VBtn>
                Chat with: {{ strangerName }}
            </VCardTitle>
        </VCard>
        <VSheet color="grey-lighten-2" rounded style="overflow-y: auto; flex-grow: 1; height: 100%;">
            
            <VContainer fluid class="chatContainer" ref="chatContainer">
                <InfoMessage/>

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
            hide-details
            variant="outlined"
            autofocus
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
</template>

<script lang="ts">
import MessageModel from "types/models/message";
import ChatMessage from "./chatComponents/ChatMessage.vue";
import InfoMessage from "./chatComponents/InfoMessage.vue";
import TimeMessage from "./chatComponents/TimeMessage.vue";
import {TextMessagePayload} from "~/types/chat/messageTypes";

const SIGNIFICANT_TIME_DIFFERENCE = 1000 * 60 * 5 //5 minutes;

export default {
    components: {ChatMessage, InfoMessage, TimeMessage},
    data() {
        return {
            messages: [
            ] as TextMessagePayload[],
            textBoxData: "",

            checkNewMessageLoading: false,
            refreshing: false,

            updater: undefined as NodeJS.Timeout|undefined,

            postingMessage: false //Semaphore hahaha
        }
    },
    props: {
        "chatID": String,
        "petID": String,
        "strangerName": String,
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
            this.postingMessage = true;
            try {
                const sendRes = await $fetch<MessageModel>(`/api/pet/${this.petID}/chat/${this.chatID}/sendMessage`, {
                    method: "post",
                    body: {
                        text: messagePayload.text
                    }
                })

                if (sendRes != undefined) {
                    messagePayload.timestamp = sendRes.timeSent
                    this.messages.push(messagePayload);
                }
            } catch(e) {
                alert(e);
            } finally {
                this.postingMessage = false;
            }
        },

        timeOfLastReceivedMessage() {
            if (this.messages.length > 0) {
                return this.messages[this.messages.length - 1].timestamp;
            }
            return 0;
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
            if (this.postingMessage) return; //Solves the case where a new message is posted but not added to the array in time before this goes off

            this.refreshing = true;
            try {
                const messages = await $fetch<MessageModel[]>(`/api/pet/${this.$route.params.petID}/chat/${this.chatID}/messagesAfter?t=${this.timeOfLastReceivedMessage()}`)

                messages.forEach(m => {
                    this.messages.push({
                        fromLocalAuthor: m.isOwnerMessage != this.isStranger,
                        timestamp: m.timeSent,
                        text: m.text
                    })
                })
                this.refreshing = false;
            } catch(e) {
                if (e?.status == 401) { //Basically means chat was deleted
                    clearInterval(this.updater)
                    this.$emit("chatEnded");
                }
            }
        },
        checkForNewMessages() {
            if (this.refreshing) return;
            this.checkNewMessageLoading = true;
            this.refreshMessages();

            setTimeout(() => {
                this.checkNewMessageLoading = false;
            }, 1500)
        }
    },
    mounted() {
        this.refreshMessages();

        this.updater = setInterval(() => {
            if (!this.refreshing) this.refreshMessages();
        }, 5000)
    },
    unmounted() {
        clearInterval(this.updater);
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